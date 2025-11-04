from typing import TypedDict, Annotated, Literal
from langchain_core.messages import HumanMessage, AIMessage, BaseMessage
from langgraph.graph import StateGraph, END
from langchain_openai import ChatOpenAI
import operator
import uuid
import os

from .billing_agent import BillingAgent
from .technical_support_agent import TechnicalSupportAgent
from .policy_agent import PolicyComplianceAgent


class AgentState(TypedDict):
    """State for the multi-agent system"""
    messages: Annotated[list[BaseMessage], operator.add]
    next_agent: str
    session_id: str
    final_response: str
    user_context: str


class AgentOrchestrator:
    """
    Orchestrator Agent using LangGraph
    Routes queries to specialized agents using OpenAI or AWS Bedrock
    """
    
    def __init__(self):
        # Try to use AWS Bedrock Claude for cost-effective routing, fallback to OpenAI
        try:
            from langchain_community.chat_models import BedrockChat
            
            # Check if AWS credentials are available
            aws_key = os.getenv("AWS_ACCESS_KEY_ID")
            aws_secret = os.getenv("AWS_SECRET_ACCESS_KEY")
            aws_token = os.getenv("AWS_SESSION_TOKEN")
            aws_region = os.getenv("AWS_DEFAULT_REGION", "us-east-1")
            
            if aws_key and aws_secret:
                # Check if temporary credentials (require session token)
                if aws_key.startswith("ASIA") and not aws_token:
                    raise Exception("Temporary AWS credentials (ASIA*) require AWS_SESSION_TOKEN")
                
                print(f"Initializing AWS Bedrock for routing (region: {aws_region})...")
                
                # Set up credentials for Bedrock
                bedrock_config = {
                    "model_id": "anthropic.claude-3-haiku-20240307-v1:0",
                    "model_kwargs": {"temperature": 0.1, "max_tokens": 200},
                    "region_name": aws_region
                }
                
                # Add session token if present
                if aws_token:
                    print("✓ Using temporary AWS credentials with session token")
                    os.environ["AWS_SESSION_TOKEN"] = aws_token
                
                self.router_llm = BedrockChat(**bedrock_config)
                print("✓ AWS Bedrock Claude initialized successfully")
            else:
                raise Exception("AWS_ACCESS_KEY_ID or AWS_SECRET_ACCESS_KEY not found")
        except Exception as e:
            print(f"AWS Bedrock not available ({str(e)}), using OpenAI for routing...")
            # Fallback to OpenAI GPT-3.5-turbo for routing (cheaper than GPT-4)
            self.router_llm = ChatOpenAI(
                model="gpt-3.5-turbo",
                temperature=0.1,
                max_tokens=200
            )
            print("✓ OpenAI GPT-3.5-turbo initialized for routing")
        
        # Initialize specialized agents with error handling
        print("Initializing specialized agents...")
        try:
            self.billing_agent = BillingAgent()
            print("✓ Billing Agent initialized")
        except Exception as e:
            print(f"⚠ Warning: Billing Agent initialization issue: {e}")
            self.billing_agent = BillingAgent()
            
        try:
            self.technical_agent = TechnicalSupportAgent()
            print("✓ Technical Support Agent initialized")
        except Exception as e:
            print(f"⚠ Warning: Technical Support Agent initialization issue: {e}")
            self.technical_agent = TechnicalSupportAgent()
            
        try:
            self.policy_agent = PolicyComplianceAgent()
            print("✓ Policy Compliance Agent initialized")
        except Exception as e:
            print(f"⚠ Warning: Policy Compliance Agent initialization issue: {e}")
            self.policy_agent = PolicyComplianceAgent()
        
        # Build the graph
        print("Building LangGraph workflow...")
        self.graph = self._build_graph()
        print("✓ Multi-agent system ready!")
        print("\n" + "="*50)
        print("SmartFinance AI Agentic System Initialized")
        print("="*50 + "\n")
    
    def _build_graph(self) -> StateGraph:
        """Build the LangGraph workflow"""
        
        workflow = StateGraph(AgentState)
        
        # Add nodes
        workflow.add_node("router", self._route_query)
        workflow.add_node("billing_agent", self._call_billing_agent)
        workflow.add_node("technical_agent", self._call_technical_agent)
        workflow.add_node("policy_agent", self._call_policy_agent)
        
        # Set entry point
        workflow.set_entry_point("router")
        
        # Add conditional edges from router
        workflow.add_conditional_edges(
            "router",
            self._decide_next_agent,
            {
                "billing_agent": "billing_agent",
                "technical_agent": "technical_agent",
                "policy_agent": "policy_agent"
            }
        )
        
        # All agents end after processing
        workflow.add_edge("billing_agent", END)
        workflow.add_edge("technical_agent", END)
        workflow.add_edge("policy_agent", END)
        
        return workflow.compile()
    
    def _route_query(self, state: AgentState) -> AgentState:
        """Analyze query and determine which agent should handle it"""
        
        user_message = state["messages"][-1].content
        
        routing_prompt = f"""You are a routing assistant for SmartFinance AI banking support.
Analyze the user's question and determine which specialized agent should handle it.

AGENTS:
1. policy_agent: PRIMARY agent for savings goals, financial planning, money management, budgeting, 
   investment advice, retirement planning, wealth building, app features overview, rewards program
   
2. billing_agent: Handles account balances, transactions, spending analysis, fees, charges, 
   interest rates, refunds, payments, transfers, account management
   
3. technical_agent: Handles app navigation, how to use features, settings configuration, 
   login problems, technical troubleshooting, password resets, app bugs

ROUTING PRIORITY:
- Questions about "goals", "saving", "budget", "financial advice", "how much to save", 
  "money management", "investment", "retirement" → policy_agent
- Questions about "balance", "transaction", "spending", "fees", "charges", "payment" → billing_agent
- Questions about "how to use", "navigate", "settings", "login", "password", "bug" → technical_agent

USER QUESTION: {user_message}

Respond with ONLY the agent name (billing_agent, technical_agent, or policy_agent)."""

        response = self.router_llm.invoke([HumanMessage(content=routing_prompt)])
        agent_choice = response.content.strip().lower()
        
        # Validate and clean the response
        if "billing" in agent_choice:
            state["next_agent"] = "billing_agent"
        elif "technical" in agent_choice:
            state["next_agent"] = "technical_agent"
        elif "policy" in agent_choice:
            state["next_agent"] = "policy_agent"
        else:
            # Default to billing if unclear
            state["next_agent"] = "billing_agent"
        
        return state
    
    def _decide_next_agent(self, state: AgentState) -> str:
        """Decision function for conditional edges"""
        return state["next_agent"]
    
    def _call_billing_agent(self, state: AgentState) -> AgentState:
        """Execute billing agent"""
        user_query = state["messages"][-1].content
        user_context = state.get("user_context")
        response = self.billing_agent.process_query(
            query=user_query,
            session_id=state["session_id"],
            user_context=user_context
        )
        state["final_response"] = response
        state["messages"].append(AIMessage(content=response))
        return state
    
    def _call_technical_agent(self, state: AgentState) -> AgentState:
        """Execute technical support agent"""
        user_query = state["messages"][-1].content
        user_context = state.get("user_context")
        response = self.technical_agent.process_query(
            query=user_query,
            user_context=user_context
        )
        state["final_response"] = response
        state["messages"].append(AIMessage(content=response))
        return state
    
    def _call_policy_agent(self, state: AgentState) -> AgentState:
        """Execute policy compliance agent"""
        user_query = state["messages"][-1].content
        user_context = state.get("user_context")
        response = self.policy_agent.process_query(
            query=user_query,
            user_context=user_context
        )
        state["final_response"] = response
        state["messages"].append(AIMessage(content=response))
        return state
    
    def process_message(self, message: str, session_id: str = None, user_context: str = None) -> tuple[str, str]:
        """
        Process a user message through the multi-agent system
        
        Args:
            message: User's question/message
            session_id: Optional session ID for context tracking
            user_context: Optional user context (account data, preferences, etc.)
        
        Returns:
            tuple: (response_text, agent_used)
        """
        try:
            if not session_id:
                session_id = str(uuid.uuid4())
            
            print(f"[Orchestrator] Processing: {message[:100]}")
            
            # Create initial state
            initial_state = AgentState(
                messages=[HumanMessage(content=message)],
                next_agent="",
                session_id=session_id,
                final_response="",
                user_context=user_context or ""
            )
            
            # Run the graph
            print("[Orchestrator] Running graph...")
            final_state = self.graph.invoke(initial_state)
            
            print(f"[Orchestrator] Complete. Agent: {final_state['next_agent']}, Response length: {len(final_state['final_response'])}")
            
            return final_state["final_response"], final_state["next_agent"]
            
        except Exception as e:
            print(f"[Orchestrator] ERROR: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            # Return error message instead of crashing
            return f"I apologize, but I encountered an error processing your request: {str(e)}", "error"


# Global instance
orchestrator = AgentOrchestrator()

