from typing import List, Optional
from fastapi import APIRouter, HTTPException, Depends
from pydantic import BaseModel
from app.services.ai_service import ai_service

router = APIRouter()

class ChatMessage(BaseModel):
    role: str # 'human' or 'ai'
    content: str

class ChatRequest(BaseModel):
    query: str
    chat_history: Optional[List[ChatMessage]] = []

class ChatResponse(BaseModel):
    answer: str

def format_history(history: List[ChatMessage]):
    # Converts list of dicts to LangChain message tuples
    formatted = []
    for msg in history:
        formatted.append((msg.role, msg.content))
    return formatted

@router.post("/chat", response_model=ChatResponse)
async def medical_chat(request: ChatRequest):
    try:
        history = format_history(request.chat_history)
        answer = await ai_service.get_medical_chat_response(request.query, history)
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/appointment", response_model=ChatResponse)
async def appointment_assistant(request: ChatRequest):
    try:
        history = format_history(request.chat_history)
        answer = await ai_service.get_appointment_assistance(request.query, history)
        return ChatResponse(answer=answer)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
