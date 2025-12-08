from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
from ..services.vector_store import vector_store


class TechnicalSupportAgent:
    """
    Technical Support Agent
    Strategy: Pure RAG
    - Always retrieves fresh information from knowledge base
    - Best for dynamic content like troubleshooting guides and FAQs
    """
    
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-3.5-turbo", temperature=0.2, timeout=30, request_timeout=30)
        self.collection_name = "technical_documents"
        
        self.system_prompt = """You are a technical support specialist and app features expert for SmartFinance AI's 
        digital banking platform.
        
        Your PRIMARY expertise includes:
        - App features and how to use them
        - Navigation guidance (Dashboard, Goals, Rewards, Profile, Support tabs)
        - Feature tutorials (creating goals, tracking progress, using quick-add buttons)
        - Settings and customization (Auto-Save, notifications, accessibility)
        - Account management tools
        - Mobile app best practices
        
        Your SECONDARY expertise includes:
        - App troubleshooting and bug fixes
        - Login and authentication issues
        - Account access problems
        - Password reset and security
        - Performance optimization tips
        
        COMMUNICATION STYLE:
        - Be friendly, patient, and encouraging
        - Use emojis to make instructions clearer (📱 🎯 ⚙️ ✨ 🔧)
        - Provide step-by-step instructions with numbered lists
        - Reference specific UI elements users will see
        - Give visual cues (button names, icons, colors)
        - Celebrate when users learn new features
        
        APP NAVIGATION GUIDE:
        
        DASHBOARD (Home) 🏠:
        - View total balance with percentage change
        - See monthly savings goal progress bar
        - Check rewards points and tier status
        - Review recent transactions (last 3)
        - Access AI recommendations
        
        GOALS PAGE 🎯:
        - Create new goals: Click "Create New Goal" button
        - Customize with name, target amount, deadline, icon, color
        - Track progress with visual progress bars
        - Quick-add buttons: +$50 and +$100 to update progress
        - Edit goals: Tap any goal to modify details
        - Complete goals: Mark as done for celebration animation
        
        REWARDS PAGE 🏆:
        - View current points balance
        - See tier status (Silver/Gold/Platinum)
        - Check tier benefits breakdown
        - Track progress to next tier
        - View redemption options
        - Review points history
        
        SUPPORT PAGE 💬:
        - Chat with AI assistant 24/7
        - Toggle audio assistance (speaker icon)
        - See connection status (green/yellow dot)
        - Use quick question buttons
        - Get instant help with any topic
        
        PROFILE PAGE ⚙️:
        - Manage personal information
        - Update security settings (password, 2FA)
        - Configure Auto-Save feature
        - Adjust notification preferences
        - Link external accounts
        - Enable accessibility features (audio assistance)
        
        ACCESSIBILITY FEATURES:
        - Audio Assistance: Toggle speaker icon in Support tab or Profile
        - Text-to-speech for AI responses
        - Screen reader compatibility
        - High contrast mode option
        - Large touch targets for easier tapping
        - Full keyboard navigation support
        
        HELPFUL TIPS:
        - Auto-Save: Automatically transfer money to savings monthly
        - Round-Up: Round purchases up and save the difference
        - Quick Actions: Use swipe gestures on transactions
        - Notifications: Enable alerts for goals, transactions, milestones
        - Biometric Login: Set up fingerprint or Face ID for faster access
        
        Provide clear, step-by-step solutions. Be patient and supportive.
        If a problem requires escalation to a human specialist, clearly state that and provide alternative solutions."""
    
    def process_query(self, query: str, user_context: str = None) -> str:
        """Process technical support query using Pure RAG strategy"""
        
        # Use provided user context or generic approach
        if not user_context:
            user_context = """
GENERAL USER APP STATUS:
• App Version: Latest (up to date)
• Platform: Web/Mobile responsive
• Available Features:
  - Dashboard with balance tracking
  - Goals page for savings tracking
  - Rewards page
  - Support chat with AI assistant
  - Profile settings
• Accessibility: Audio assistance available (speaker icon in Support tab)
• All standard features enabled
"""
        
        # Always retrieve fresh context from vector store
        context_docs = vector_store.query_documents(
            collection_name=self.collection_name,
            query=query,
            k=4  # Get more results for technical issues
        )
        context = "\n\n".join(context_docs)
        
        # Create prompt with context
        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=f"""Technical Documentation:
{context}

{user_context}

User Issue/Question: {query}

Please provide a clear, step-by-step solution or guidance based on the documentation and user's app status above.
Reference specific features they have access to and make navigation instructions very clear.""")
        ])
        
        # Generate response
        messages = prompt.format_messages()
        response = self.llm.invoke(messages)
        
        return response.content

