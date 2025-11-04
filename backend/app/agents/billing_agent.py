from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
from typing import Dict, List, Optional
from ..services.vector_store import vector_store


class BillingAgent:
    """
    Billing & Transactions Agent
    Strategy: Hybrid RAG/CAG
    - First query uses RAG to retrieve relevant billing policies
    - Caches static information for subsequent queries in the session
    """
    
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4", temperature=0.3)
        self.collection_name = "billing_documents"
        self.session_cache: Dict[str, List[str]] = {}
        
        self.system_prompt = """You are a professional financial advisor specializing in billing, 
        transactions, account management, and personal finance for SmartFinance AI. 
        
        Your PRIMARY expertise includes:
        - Account balance tracking and management
        - Transaction history analysis and insights
        - Spending patterns and trends
        - Budget optimization strategies
        - Savings account management
        - Financial goal funding strategies
        - Rewards points earning optimization
        
        Your SECONDARY expertise includes:
        - Explaining account charges and fees
        - Clarifying interest rates and APR
        - Processing refund requests
        - Resolving billing disputes
        - Transfer and payment processing
        
        COMMUNICATION STYLE:
        - Be friendly, supportive, and financially savvy
        - Use appropriate emojis (💰 💳 📊 💵 🎯)
        - Provide actionable money management advice
        - Reference specific account features and tools
        - Give personalized recommendations based on transaction patterns
        - Celebrate good financial behaviors
        - Encourage smart spending and saving habits
        
        KEY FEATURES TO REFERENCE:
        - Dashboard with real-time balance and transaction tracking
        - Monthly savings goals with progress bars
        - Rewards program (Silver/Gold/Platinum tiers)
        - Auto-Save and Round-Up features
        - High-yield savings account (2.5% APY)
        - Transaction categorization
        - Budget tracking and alerts
        
        FINANCIAL ADVICE APPROACH:
        - Analyze spending patterns when discussing transactions
        - Suggest ways to optimize savings based on income/expenses
        - Recommend using rewards points strategically
        - Encourage emergency fund building
        - Highlight opportunities to reach financial goals faster
        - Reference the 50/30/20 budgeting rule when appropriate
        
        Be helpful, accurate, and empathetic. Use the provided context to answer questions.
        If you don't know something specific, admit it and offer to connect them with a specialist."""
    
    def process_query(self, query: str, session_id: str, user_context: str = None) -> str:
        """Process billing query using Hybrid RAG/CAG strategy"""
        
        # Use provided user context or generic approach
        if not user_context:
            user_context = """
GENERAL CONTEXT:
You are helping a SmartFinance AI customer with their banking questions.
Provide helpful, accurate advice without assuming specific account details.
"""
        
        # Check if we have cached information for this session
        if session_id in self.session_cache:
            # Use CAG - cached context
            context = "\n".join(self.session_cache[session_id])
        else:
            # Use RAG - retrieve from vector store
            context_docs = vector_store.query_documents(
                collection_name=self.collection_name,
                query=query,
                k=3
            )
            context = "\n".join(context_docs)
            
            # Cache for future queries in this session
            self.session_cache[session_id] = context_docs
        
        # Create prompt with context
        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=f"""Billing & Financial Context:
{context}

{user_context}

User Question: {query}

Please provide a personalized, helpful response based on the context and user's financial profile above.
Reference their specific transactions, balance, or spending patterns when relevant.""")
        ])
        
        # Generate response
        messages = prompt.format_messages()
        response = self.llm.invoke(messages)
        
        return response.content
    
    def clear_cache(self, session_id: str):
        """Clear cached data for a session"""
        if session_id in self.session_cache:
            del self.session_cache[session_id]

