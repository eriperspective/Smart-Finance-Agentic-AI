"""
Mock Agent for Demo Purposes
Provides realistic responses without requiring OpenAI API key
"""

import random
import time

class MockAgent:
    """Mock agent that simulates AI responses for demo purposes"""
    
    def __init__(self):
        self.responses = {
            "billing": [
                "Based on your account activity, I can see your current balance is $2,450.00. Your last transaction was a deposit of $500 on December 3rd. Is there anything specific about your billing you'd like to know?",
                "Your monthly maintenance fee of $12.00 was processed on December 1st. You have auto-pay enabled, which saves you $5/month. Would you like to review your recent transactions?",
                "I've reviewed your account and found no unusual charges. Your spending this month totals $1,245.50, which is 15% lower than last month. Great job managing your expenses!",
                "Your account is in good standing with no pending fees. You earned $2.35 in interest last month. Would you like to explore ways to maximize your savings interest?",
            ],
            "technical": [
                "I can help with that technical issue! First, try clearing your browser cache and cookies. If you're using the mobile app, make sure you're running the latest version (v2.4.1). Let me know if the issue persists.",
                "Great question! To enable two-factor authentication, go to Settings → Security → Enable 2FA. You'll receive a verification code via SMS or email. This adds an extra layer of security to your account.",
                "The app is fully responsive and works on iOS, Android, and web browsers. For the best experience, I recommend using Chrome, Safari, or Firefox. The mobile app is available in the App Store and Google Play.",
                "To update your notification preferences, navigate to Settings → Notifications. You can customize alerts for transactions, bill reminders, savings goals, and security updates. Would you like help with a specific notification setting?",
            ],
            "policy": [
                "Our savings goal feature helps you track progress toward financial targets. You can set multiple goals, and we'll automatically calculate how much you need to save monthly. Plus, you earn bonus rewards points for meeting milestones!",
                "SmartFinance AI offers several account protection features: fraud detection, transaction alerts, account freeze capability, and FDIC insurance up to $250,000. Your security is our top priority.",
                "Our privacy policy ensures your data is encrypted and never shared with third parties without consent. We use bank-level encryption (256-bit SSL) and comply with all financial regulations including GDPR and CCPA.",
                "To qualify for premium rewards, maintain a minimum balance of $1,000 and make at least 5 transactions monthly. Premium members earn 2x points on all purchases and get exclusive partner discounts. Would you like to learn more about upgrading?",
            ],
            "general": [
                "I'm here to help with any questions about your account, billing, technical issues, or our policies. What would you like to know?",
                "As your AI financial assistant, I can help you with account management, savings goals, rewards tracking, and answering policy questions. How can I assist you today?",
                "I have access to your account information and can provide personalized advice on budgeting, savings, and account features. What brings you here today?",
                "Welcome! I can assist with billing inquiries, technical support, policy questions, or general account information. What would you like help with?",
            ]
        }
        
        self.greeting_keywords = ["hello", "hi", "hey", "good morning", "good afternoon", "good evening", "greetings"]
        self.billing_keywords = ["bill", "charge", "fee", "payment", "balance", "transaction", "deposit", "withdrawal", "money", "cost", "price"]
        self.technical_keywords = ["app", "login", "password", "error", "bug", "issue", "problem", "not working", "broken", "technical", "mobile", "browser", "update"]
        self.policy_keywords = ["policy", "rule", "regulation", "privacy", "security", "account", "feature", "savings", "goal", "reward", "premium", "upgrade"]
    
    def determine_category(self, query: str) -> str:
        """Determine which category the query belongs to"""
        query_lower = query.lower()
        
        # Check for greetings
        if any(keyword in query_lower for keyword in self.greeting_keywords):
            return "general"
        
        # Count keyword matches for each category
        billing_count = sum(1 for keyword in self.billing_keywords if keyword in query_lower)
        technical_count = sum(1 for keyword in self.technical_keywords if keyword in query_lower)
        policy_count = sum(1 for keyword in self.policy_keywords if keyword in query_lower)
        
        # Return category with highest match
        counts = {
            "billing": billing_count,
            "technical": technical_count,
            "policy": policy_count
        }
        
        max_category = max(counts, key=counts.get)
        
        # If no clear category, return general
        if counts[max_category] == 0:
            return "general"
        
        return max_category
    
    def get_response(self, query: str, agent_type: str = None) -> tuple[str, str]:
        """
        Get a mock response for the given query
        
        Args:
            query: User's question
            agent_type: Optional override for agent type
            
        Returns:
            Tuple of (response_text, agent_used)
        """
        # Simulate processing delay
        time.sleep(0.5)
        
        # Determine category if not specified
        if agent_type is None:
            category = self.determine_category(query)
        else:
            category = agent_type
        
        # Get response from appropriate category
        if category in self.responses:
            response = random.choice(self.responses[category])
        else:
            response = random.choice(self.responses["general"])
        
        # Determine agent name based on category
        agent_names = {
            "billing": "Billing Agent",
            "technical": "Technical Support Agent",
            "policy": "Policy Compliance Agent",
            "general": "Router Agent"
        }
        
        agent_used = agent_names.get(category, "Router Agent")
        
        return response, agent_used
    
    def process_query(self, query: str, session_id: str = None, user_context: str = None) -> tuple[str, str]:
        """
        Main entry point for processing queries (compatible with real agent interface)
        
        Args:
            query: User's question
            session_id: Session identifier (unused in mock)
            user_context: User context information (unused in mock)
            
        Returns:
            Tuple of (response_text, agent_used)
        """
        return self.get_response(query)


# Singleton instance
mock_agent = MockAgent()

