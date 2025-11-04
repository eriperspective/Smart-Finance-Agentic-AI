from langchain_openai import ChatOpenAI
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.messages import HumanMessage, SystemMessage
from typing import Optional


class PolicyComplianceAgent:
    """
    Policy & Compliance Agent
    Strategy: Pure CAG (Context-Augmented Generation)
    - Uses pre-loaded static policy documents
    - No vector search needed - all policies loaded at initialization
    - Fast, consistent responses for regulatory and policy questions
    """
    
    def __init__(self):
        self.llm = ChatOpenAI(model="gpt-4", temperature=0.1)
        
        self.system_prompt = """You are a comprehensive financial advisor and AI assistant for SmartFinance AI.
        
        Your PRIMARY expertise includes:
        - Savings goals creation and tracking strategies
        - Money management and budgeting advice
        - Financial planning and wealth building
        - Investment guidance and retirement planning
        - Rewards program optimization
        - App features and functionality explanations
        
        Your SECONDARY expertise includes:
        - Terms of Service interpretation
        - Privacy Policy details
        - KYC (Know Your Customer) requirements
        - Anti-fraud policies and procedures
        - Regulatory compliance
        - User rights and responsibilities
        
        COMMUNICATION STYLE:
        - Be friendly, encouraging, and supportive
        - Use emojis appropriately to make responses engaging (💰 💵 🎯 📊 🏆 ✨)
        - Provide specific, actionable advice
        - Reference actual app features and how to use them
        - Give personalized recommendations based on user context
        - Break down complex financial concepts into simple terms
        - Be enthusiastic about helping users achieve their financial goals
        
        When discussing savings goals:
        - Encourage realistic but ambitious targets
        - Explain how to use the Goals page features
        - Mention the quick-add buttons and progress tracking
        - Celebrate their current progress
        - Provide strategic tips for reaching goals faster
        
        When discussing money management:
        - Reference the 50/30/20 rule
        - Explain budgeting features in the app
        - Give personalized saving strategies
        - Highlight Auto-Save and Round-Up features
        
        When discussing app features:
        - Give step-by-step navigation instructions
        - Explain what they can do on each page (Dashboard, Goals, Rewards, Profile, Support)
        - Mention accessibility features like audio assistance
        
        Provide accurate, authoritative answers based on the comprehensive policy documentation.
        Be clear, helpful, and aim to empower users to take control of their financial future."""
        
        # Static policy context (loaded at initialization)
        self.static_context = self._load_static_policies()
    
    def _load_static_policies(self) -> str:
        """Load static policy documents into memory"""
        # In production, this would load from files or database
        # For now, we'll use comprehensive policy text
        
        policies = """
SMARTFINANCE AI - COMPREHENSIVE FINANCIAL GUIDANCE & POLICIES

=== SAVINGS GOALS & FINANCIAL PLANNING ===

1. SAVINGS GOALS SYSTEM
SmartFinance AI offers a comprehensive savings goals feature to help users achieve their financial dreams.

CREATING GOALS:
• Navigate to the Goals tab in the bottom navigation
• Click "Create New Goal" button
• Customize your goal with:
  - Goal name (e.g., "Vacation", "Emergency Fund", "New Car", "Home Down Payment")
  - Current amount saved
  - Target amount
  - Deadline date
  - Icon and color theme for personalization
• Track progress in real-time with visual progress bars
• Use quick-add buttons (+$50, +$100) to update progress instantly

POPULAR GOAL IDEAS:
• Emergency Fund: $10,000-$50,000 (recommended 6 months expenses)
• Vacation: $3,000-$10,000
• New Car: $20,000-$50,000
• Home Down Payment: $50,000-$100,000+
• Retirement: Ongoing contributions
• Wedding: $20,000-$40,000
• Education: Variable based on program

GOAL MANAGEMENT:
• Edit goals anytime (amount, deadline, details)
• Mark goals as complete to trigger celebration animations
• Archive completed goals for historical tracking
• Create unlimited goals
• Get milestone notifications

2. MONEY MANAGEMENT & BUDGETING

THE 50/30/20 RULE (Recommended):
• 50% for Needs: Housing, utilities, groceries, transportation, insurance
• 30% for Wants: Entertainment, dining out, hobbies, subscriptions
• 20% for Savings: Emergency fund, retirement, goals, investments

SMARTFINANCE AI BUDGETING FEATURES:
• Automatic expense categorization
• Monthly spending insights and visualizations
• Budget vs actual tracking
• Customizable spending limits by category
• Alerts when approaching limits
• Visual spending trends and patterns
• Year-over-year comparisons

SAVINGS STRATEGIES:
• Auto-Save: Automate regular transfers to savings
• Round-Up: Round purchases to nearest dollar, save difference
• Goal-Based Saving: Allocate specific amounts to specific goals
• High-Yield Savings: 2.5% APY on savings accounts
• Emergency Fund Priority: Build 3-6 months expenses first

3. FINANCIAL DASHBOARD FEATURES

YOUR DASHBOARD SHOWS:
• Total Balance: Real-time account balance with growth percentage
• Monthly Savings Goal: Progress bar showing advancement toward goal
• Rewards Points: Current points and tier status (Silver/Gold/Platinum)
• Recent Transactions: Last 3 transactions with amounts and categories
• AI Recommendations: Personalized savings tips and insights

TRANSACTION TRACKING:
• Real-time transaction updates
• Color-coded entries (green for income, red for spending)
• Detailed transaction history
• Search and filter capabilities
• Export statements (PDF, CSV)
• Receipt attachment feature

4. REWARDS PROGRAM

TIER SYSTEM:
• Silver Tier: 0-25,000 points
  - 1x points on purchases
  - Basic customer support
  - Standard rates
  
• Gold Tier: 25,001-50,000 points
  - 2x points on purchases
  - Priority customer support
  - Better interest rates
  - Quarterly bonus points
  
• Platinum Tier: 50,000+ points
  - 3x points on purchases
  - Dedicated financial advisor
  - Best interest rates
  - Travel insurance included
  - Airport lounge access
  - Birthday bonus points

EARNING POINTS:
• 1 point per dollar spent (baseline)
• Tier multipliers apply automatically
• Bonus points for:
  - Completing savings goals (1,000-5,000 points)
  - Maintaining positive balance (500 points/month)
  - Referrals (2,500 points per successful referral)
  - Using Auto-Save feature (250 points/month)

REDEEMING POINTS:
• Cash back (100 points = $1)
• Gift cards (15% bonus value)
• Travel rewards (hotels, flights)
• Charity donations
• Statement credits
• No expiration on points

5. INVESTMENT & WEALTH BUILDING

INVESTMENT OPTIONS:
• High-Yield Savings Account: 2.5% APY, FDIC insured
• Index Funds: Long-term growth, 7-10% average annual returns
• Retirement Accounts: 401(k), IRA with tax advantages
• Automated Investing: Robo-advisor services available
• Custom Portfolios: Work with financial advisor

RETIREMENT PLANNING:
• Recommended savings: 10-15x annual income by retirement
• Contribute 15-20% of income to retirement accounts
• Maximize employer matching (free money!)
• Consider Roth IRA for tax-free growth
• Rebalance portfolio annually

WEALTH BUILDING STRATEGIES:
• Pay yourself first (automate savings)
• Invest consistently regardless of market conditions
• Diversify across asset classes
• Keep emergency fund separate from investments
• Review and adjust strategy quarterly

6. APP FEATURES & FUNCTIONALITY

DASHBOARD FEATURES:
• Balance Overview: Total balance with percentage change
• Goal Tracking: Visual progress bars for all active goals
• Rewards Summary: Points, tier, and benefits
• Transaction Feed: Recent activity with categories
• Quick Actions: Transfer, pay bills, deposit checks

GOALS PAGE:
• Create unlimited custom goals
• Visual progress tracking
• Quick-add buttons for updates
• Edit or archive goals
• Celebration animations on completion
• Historical goal view

REWARDS PAGE:
• Current points balance
• Tier status and progress to next tier
• Tier benefits breakdown
• Redemption options
• Points history
• Tier progression timeline

PROFILE SETTINGS:
• Personal information management
• Security settings (2FA, password)
• Auto-Save configuration
• Notification preferences
• Linked accounts
• Accessibility options (audio assistance)

ACCESSIBILITY FEATURES:
• Audio Assistance: Toggle in Support tab or Profile
• Text-to-speech for AI responses
• Screen reader support
• High contrast mode
• Large touch targets
• Keyboard navigation

7. SECURITY & FRAUD PROTECTION

ACCOUNT SECURITY:
• 256-bit encryption for all data
• Two-factor authentication available
• Biometric login (fingerprint, Face ID)
• Device authorization
• Session timeout for inactive accounts

FRAUD MONITORING:
• 24/7 automated fraud detection
• Real-time transaction alerts
• Immediate card lock/unlock feature
• Zero liability for verified fraud
• 100% money-back guarantee
• Report suspicious activity anytime

8. CUSTOMER SUPPORT

SUPPORT CHANNELS:
• AI Assistant: 24/7 instant support in Support tab
• Live Chat: 6am-10pm PT
• Phone Support: 1-800-SMART-FI
• Email: support@smartfinance.ai
• In-app messaging

AI ASSISTANT CAPABILITIES:
• Answer questions about savings goals
• Provide money management advice
• Explain features and functionality
• Help with transactions and account issues
• Give personalized financial recommendations
• Assist with goal creation and tracking
• Explain rewards program details

=== TRADITIONAL POLICIES ===

9. ACCOUNT ELIGIBILITY
Users must be 18 years or older and residents of supported countries.
Valid government-issued ID required for account verification (KYC).

10. ACCEPTABLE USE POLICY
Accounts are for personal or business banking use only.
Prohibited activities: money laundering, fraud, illegal transactions.
Users must maintain accurate account information.

11. FEES AND CHARGES
Monthly maintenance fee: $0 for accounts with $500+ balance.
ATM withdrawal fees: $2.50 for out-of-network ATMs.
Overdraft protection: $35 per occurrence.
International transaction fee: 3% of transaction amount.
Wire transfer fee: $25 domestic, $45 international.

12. PRIVACY POLICY
We collect: personal information, transaction data, device information.
Data usage: fraud prevention, service improvement, legal compliance.
Data sharing: Limited to legal requirements and service providers.
User rights: Access, correction, and deletion of personal data.
Cookie policy: Essential cookies only, no third-party tracking.

13. KYC REQUIREMENTS
Initial verification: Government ID, proof of address, SSN/Tax ID.
Ongoing monitoring: Periodic re-verification for compliance.
Enhanced due diligence for high-risk customers or large transactions.

14. ACCOUNT TERMINATION
We reserve the right to close accounts for policy violations.
Users may close accounts at any time with zero balance.
Outstanding balances must be settled before closure.

15. DISPUTE RESOLUTION
Disputes must be reported within 60 days of transaction.
We investigate all disputes within 10 business days.
Arbitration required for disputes exceeding $10,000.
"""
        return policies
    
    def process_query(self, query: str, user_context: str = None) -> str:
        """Process policy query using Pure CAG strategy"""
        
        # Use provided user context or generic approach
        if not user_context:
            user_context = """
GENERAL CONTEXT:
You are helping a SmartFinance AI customer with financial planning and policy questions.
Provide helpful advice and information without assuming specific account details.
Focus on general guidance, best practices, and explaining features.
"""
        
        # Use pre-loaded static context (no retrieval needed)
        prompt = ChatPromptTemplate.from_messages([
            SystemMessage(content=self.system_prompt),
            HumanMessage(content=f"""SmartFinance AI Policies & Features:
{self.static_context}

{user_context}

User Question: {query}

Please provide a personalized, accurate answer based on the policies and user's financial profile above.
Reference their specific numbers when relevant (balance, goals, rewards, etc.) to make the response feel personalized and actionable.""")
        ])
        
        # Generate response
        messages = prompt.format_messages()
        response = self.llm.invoke(messages)
        
        return response.content

