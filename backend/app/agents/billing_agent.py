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
        self.llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.3, timeout=30, request_timeout=30)
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
        
        try:
            # Simplified: Just answer the question directly without complex context
            simple_prompt = f"You are a financial advisor. Answer this question briefly and helpfully: {query}"
            
            print(f"[Billing Agent] Calling GPT-3.5-turbo...")
            response = self.llm.invoke(simple_prompt)
            print(f"[Billing Agent] Got response: {len(response.content)} chars")
            return response.content
        except Exception as e:
            print(f"[Billing Agent] ERROR: {type(e).__name__}: {str(e)}")
            import traceback
            traceback.print_exc()
            raise
    
    def clear_cache(self, session_id: str):
        """Clear cached data for a session"""
        if session_id in self.session_cache:
            del self.session_cache[session_id]

