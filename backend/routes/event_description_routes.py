from typing import Any, Dict
from uuid import uuid4

from fastapi import APIRouter, HTTPException
from prompts.constants import get_flat_checklist_keys
from pydantic import BaseModel
from service.event_description_llm import process_event_step

router = APIRouter()
SESSIONS: Dict[str, Any] = {}


class StartSessionRequest(BaseModel):
    imie: str
    nazwisko: str
    nip: str


class StartSessionResponse(BaseModel):
    session_id: str
    welcome_message: str


class ChatRequest(BaseModel):
    session_id: str
    user_message: str


class ChatResponse(BaseModel):
    ai_message: str
    checklist: Dict[str, Any]
    is_finished: bool


@router.post("/start", response_model=StartSessionResponse)
async def start_session_endpoint(data: StartSessionRequest):
    session_id = str(uuid4())

    required_keys = get_flat_checklist_keys()

    initial_checklist = {key: None for key in required_keys}

    SESSIONS[session_id] = {
        "static_data": data.model_dump(),
        "checklist": initial_checklist,
        "history": "",
    }

    return StartSessionResponse(
        session_id=session_id,
        welcome_message="Dzień dobry. Proszę opisać własnymi słowami okoliczności zdarzenia.",
    )


@router.post("/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    if request.session_id not in SESSIONS:
        raise HTTPException(
            status_code=404, detail="Sesja nie istnieje lub wygasła."
        )

    session = SESSIONS[request.session_id]

    try:
        result = process_event_step(
            user_input=request.user_message,
            checklist_state=session["checklist"],
            history=session["history"],
        )
    except Exception as e:
        print(f"Błąd w logice LLM: {e}")
        raise HTTPException(status_code=500, detail="Błąd przetwarzania AI.")

    session["checklist"] = result["checklist"]
    session["history"] = result["history"]

    return ChatResponse(
        ai_message=result["ai_message"],
        checklist=result["checklist"],
        is_finished=result["is_finished"],
    )


@router.get("/session/{session_id}")
async def get_session_debug(session_id: str):
    return SESSIONS.get(session_id, {"error": "Not found"})
