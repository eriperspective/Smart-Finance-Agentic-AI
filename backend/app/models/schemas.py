from pydantic import BaseModel, Field
from typing import List, Optional, Literal
from datetime import datetime


class ChatMessage(BaseModel):
    role: Literal["user", "assistant", "system"]
    content: str
    timestamp: Optional[datetime] = None


class ChatRequest(BaseModel):
    message: str = Field(..., description="User's message to the AI assistant")
    session_id: Optional[str] = Field(None, description="Session ID for maintaining conversation context")
    user_id: Optional[str] = Field(None, description="User ID for personalization")
    user_context: Optional[str] = Field(None, description="Optional user context (balance, goals, etc.) for personalized responses")


class ChatResponse(BaseModel):
    message: str
    agent_used: str
    session_id: str
    timestamp: datetime


class AgentType(BaseModel):
    name: str
    description: str
    strategy: Literal["RAG", "CAG", "HYBRID"]

