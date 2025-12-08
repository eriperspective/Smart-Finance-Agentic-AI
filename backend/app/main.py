# CRITICAL: Load .env BEFORE importing anything that uses env vars!
from dotenv import load_dotenv
import os
from pathlib import Path

load_dotenv(dotenv_path=Path(__file__).resolve().parent.parent / ".env")

# Debug check: confirm keys are loaded
print("🔑 AWS_ACCESS_KEY_ID:", os.getenv("AWS_ACCESS_KEY_ID"))
print("🔑 AWS_SECRET_ACCESS_KEY:", os.getenv("AWS_SECRET_ACCESS_KEY")[:20] + "..." if os.getenv("AWS_SECRET_ACCESS_KEY") else "None")
print("🔑 AWS_SESSION_TOKEN:", "Present (" + str(len(os.getenv("AWS_SESSION_TOKEN", ""))) + " chars)" if os.getenv("AWS_SESSION_TOKEN") else "None")

# NOW import everything else (orchestrator will see the env vars)
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .api.chat import router as chat_router

# Create FastAPI app
app = FastAPI(
    title="SmartFinance AI API",
    description="Intelligent Financial Support Application with Multi-Agent AI System",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://localhost:3001",
        "https://*.vercel.app",  # Your Vercel frontend
        os.getenv("FRONTEND_URL", ""),  # Production frontend URL
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(chat_router, prefix="/api", tags=["chat"])


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "SmartFinance AI API",
        "version": "1.0.0",
        "status": "running",
        "docs": "/docs"
    }


@app.get("/health")
async def health():
    """Health check endpoint"""
    use_mock = os.getenv("USE_MOCK_AI", "false").lower() == "true"
    openai_key = os.getenv("OPENAI_API_KEY", "")
    
    # Auto-detect mock mode if no API key
    if not openai_key or openai_key == "":
        use_mock = True
    
    return {
        "status": "healthy",
        "environment": os.getenv("ENVIRONMENT", "development"),
        "mode": "demo" if use_mock else "live",
        "ai_provider": "mock" if use_mock else "openai"
    }


if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=8000,
        reload=True
    )

