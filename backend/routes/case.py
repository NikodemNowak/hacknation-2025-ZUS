from datetime import date
from typing import List, Optional
from pydantic import BaseModel

from database.db import cases_db
from fastapi import APIRouter, HTTPException, Query, status, Body
from models.Case import Case
from models.ZapisWyjasnienPoszkodowanego import ZapisWyjasnienPoszkodowanego
from models.ZawiadomienieOWypadku import ZawiadomienieOWypadku

router = APIRouter()

class StatusUpdate(BaseModel):
    status: str

# ==========================================
# 1. Lista spraw (Dashboard)
# ==========================================
@router.get("/cases", response_model=List[Case])
def get_cases(status_filter: Optional[str] = Query(None, alias="status")):
    """
    Pobiera listę spraw. Można filtrować po statusie:
    /cases?status=W trakcie
    /cases?status=Wysłano
    """
    if status_filter:
        filtered_cases = [
            c for c in cases_db if c.get("status") == status_filter
        ]
        return filtered_cases
    return cases_db


# ==========================================
# 2. Utworzenie nowej (pustej) sprawy
# ==========================================
@router.post(
    "/cases", response_model=Case, status_code=status.HTTP_201_CREATED
)
def create_case():
    """
    Tworzy nową, pustą sprawę i nadaje jej ID.
    """
    new_case = Case(
        data_utworzenia=str(date.today()),
        status="W trakcie",
        wyjasnienia=None,
        zawiadomienie=None,
        poszkodowany=None,
    )
    # Zapisujemy jako słownik do "bazy"
    cases_db.append(new_case.model_dump())
    return new_case


# ==========================================
# 3. Szczegóły konkretnej sprawy
# ==========================================
@router.get("/cases/{case_id}", response_model=Case)
def get_case_details(case_id: str):
    """
    Pobiera pełne dane sprawy na podstawie ID.
    """
    case_data = next((c for c in cases_db if c["id"] == case_id), None)

    if not case_data:
        raise HTTPException(
            status_code=404, detail="Sprawa o podanym ID nie istnieje"
        )

    return case_data


# ==========================================
# 4. Zapisywanie Zawiadomienia (Autosave)
# ==========================================
@router.patch("/cases/{case_id}/zawiadomienie")
def update_zawiadomienie(case_id: str, data: ZawiadomienieOWypadku):
    """
    Aktualizuje sekcję 'zawiadomienie' w danej sprawie.
    """
    case_idx = next(
        (i for i, c in enumerate(cases_db) if c["id"] == case_id), None
    )

    if case_idx is None:
        raise HTTPException(status_code=404, detail="Sprawa nie znaleziona")

    # Aktualizacja w bazie
    cases_db[case_idx]["zawiadomienie"] = data.model_dump()
    cases_db[case_idx][
        "status"
    ] = "W trakcie"  # Upewniamy się, że status to edycja

    return {
        "message": "Zawiadomienie zaktualizowane pomyślnie",
        "case_id": case_id,
    }


# ==========================================
# 5. Zapisywanie Wyjaśnień (Autosave)
# ==========================================
@router.patch("/cases/{case_id}/wyjasnienia")
def update_wyjasnienia(case_id: str, data: ZapisWyjasnienPoszkodowanego):
    """
    Aktualizuje sekcję 'wyjasnienia' w danej sprawie.
    """
    case_idx = next(
        (i for i, c in enumerate(cases_db) if c["id"] == case_id), None
    )

    if case_idx is None:
        raise HTTPException(status_code=404, detail="Sprawa nie znaleziona")

    cases_db[case_idx]["wyjasnienia"] = data.model_dump()
    cases_db[case_idx]["status"] = "W trakcie"

    return {
        "message": "Wyjaśnienia zaktualizowane pomyślnie",
        "case_id": case_id,
    }





from service.event_description_llm import analyze_opinion

@router.post("/cases/{case_id}/analyze-opinion")
def analyze_case_opinion(case_id: str):
    """
    Analiza kwalifikacji prawnej wypadku przez AI (Groq/Llama-3).
    Sprawdza 4 przesłanki: nagłość, przyczyna zewn., uraz, związek z pracą.
    """
    case_data = next((c for c in cases_db if c["id"] == case_id), None)
    if not case_data:
        raise HTTPException(status_code=404, detail="Sprawa nie znaleziona")

    result = analyze_opinion(case_data)
    
    # Obsługa błędów LLM
    if "error" in result:
        # Możemy zwrócić 503 lub 200 z informacją o błędzie
        return {
             "error": True,
             "message": result["error"],
             "details": {
                "suddenness": { "met": False, "justification": "Błąd analizy AI" },
                "external_cause": { "met": False, "justification": "Błąd analizy AI" },
                "injury": { "met": False, "justification": "Błąd analizy AI" },
                "work_connection": { "met": False, "justification": "Błąd analizy AI" }
             }
        }

    return result


# ==========================================
# 7. Aktualizacja Statusu
# ==========================================
@router.patch("/cases/{case_id}/status")
def update_case_status(case_id: str, data: StatusUpdate):
    """
    Aktualizuje tylko status sprawy.
    """
    case_idx = next(
        (i for i, c in enumerate(cases_db) if c["id"] == case_id), None
    )

    if case_idx is None:
        raise HTTPException(status_code=404, detail="Sprawa nie znaleziona")

    cases_db[case_idx]["status"] = data.status
    
    return {
        "message": "Status zaktualizowany pomyślnie",
        "case_id": case_id,
        "new_status": data.status
    }
