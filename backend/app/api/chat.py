from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from sse_starlette.sse import EventSourceResponse
from typing import AsyncGenerator
import json
import asyncio
from datetime import datetime
from concurrent.futures import ThreadPoolExecutor

from ..models.schemas import ChatRequest, ChatResponse
from ..agents.orchestrator import orchestrator

# Thread pool for running synchronous operations
executor = ThreadPoolExecutor(max_workers=4)

router = APIRouter()


async def generate_chat_stream(message: str, session_id: str, user_context: str = None) -> AsyncGenerator[str, None]:
    """
    Generate streaming response for chat
    Simulates token-by-token streaming for better UX
    """
    try:
        # Get response from orchestrator (run in thread pool to avoid blocking)
        print(f"Processing message: {message[:50]}...")
        loop = asyncio.get_event_loop()
        response_text, agent_used = await loop.run_in_executor(
            executor,
            orchestrator.process_message,
            message,
            session_id,
            user_context
        )
        print(f"Got response from {agent_used}: {len(response_text)} chars")
        
        # Stream the response in chunks (not word by word - too slow!)
        words = response_text.split()
        chunk_size = 3  # Send 3 words at a time for faster streaming
        
        for i in range(0, len(words), chunk_size):
            # Get chunk of words
            chunk_words = words[i:i + chunk_size]
            chunk = " ".join(chunk_words)
            
            # Add space after chunk if not at the end
            if i + chunk_size < len(words):
                chunk += " "
            
            # Yield as server-sent event
            data = {
                "content": chunk,
                "agent": agent_used,
                "done": False
            }
            yield f"data: {json.dumps(data)}\n\n"
            
            # Minimal delay for streaming effect (much faster)
            await asyncio.sleep(0.01)
        
        # Send completion signal
        final_data = {
            "content": "",
            "agent": agent_used,
            "done": True
        }
        yield f"data: {json.dumps(final_data)}\n\n"
        
    except Exception as e:
        print(f"ERROR in generate_chat_stream: {type(e).__name__}: {str(e)}")
        import traceback
        traceback.print_exc()
        error_data = {
            "content": f"I apologize, but I encountered an error: {str(e)}. Please try again.",
            "agent": "error",
            "done": True
        }
        yield f"data: {json.dumps(error_data)}\n\n"
    finally:
        # Ensure connection is properly closed
        await asyncio.sleep(0)


@router.post("/chat/stream")
async def chat_stream(request: ChatRequest):
    """
    Streaming chat endpoint using Server-Sent Events (SSE)
    Returns token-by-token response for real-time display
    """
    if not request.message or len(request.message.strip()) == 0:
        raise HTTPException(status_code=400, detail="Message cannot be empty")
    
    session_id = request.session_id or "default"
    
    return EventSourceResponse(
        generate_chat_stream(request.message, session_id, request.user_context),
        media_type="text/event-stream"
    )


@router.post("/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    """
    Non-streaming chat endpoint
    Returns complete response at once
    """
    try:
        if not request.message or len(request.message.strip()) == 0:
            raise HTTPException(status_code=400, detail="Message cannot be empty")
        
        session_id = request.session_id or "default"
        
        # Get response from orchestrator (run in thread pool to avoid blocking)
        loop = asyncio.get_event_loop()
        response_text, agent_used = await loop.run_in_executor(
            executor,
            orchestrator.process_message,
            request.message,
            session_id,
            request.user_context
        )
        
        return ChatResponse(
            message=response_text,
            agent_used=agent_used,
            session_id=session_id,
            timestamp=datetime.now()
        )
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error processing request: {str(e)}")


@router.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "service": "SmartFinance AI Chat API",
        "timestamp": datetime.now().isoformat()
    }

