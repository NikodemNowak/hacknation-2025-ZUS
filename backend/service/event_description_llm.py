import json
from typing import Any, Dict, List

from config import settings
from prompts.constants import CHECKLISTA_PYTAN, EXTRACTION_PROMPT_RULES, OPINION_ANALYSIS_PROMPT

try:
    from groq import Groq

    client = (
        Groq(api_key=settings.groq_api_key) if settings.groq_api_key else None
    )
    HAS_LLM_CLIENT = True if client else False
except ImportError:
    HAS_LLM_CLIENT = False
    client = None


def call_llm_api(
    system_prompt: str, user_prompt: str, expect_json: bool = True
) -> str:
    if not HAS_LLM_CLIENT or not client or not settings.groq_api_key:
        print("⚠️ Brak konfiguracji LLM API")
        return "{}" if expect_json else ""

    try:
        params = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt},
            ],
            "temperature": 0 if expect_json else 0.7,
            "stream": False,
        }

        if expect_json:
            params["response_format"] = {"type": "json_object"}

        completion = client.chat.completions.create(**params)
        return completion.choices[0].message.content

    except Exception as e:
        print(f"❌ Błąd API LLM: {e}")
        return "{}" if expect_json else ""


def extract_info_from_text(
    current_checklist: Dict[str, Any], history_str: str
) -> Dict[str, Any]:

    if not HAS_LLM_CLIENT or not client or not settings.groq_api_key:
        print(
            "⚠️ Brak konfiguracji LLM - checklisty nie zostaną automatycznie wypełnione"
        )
        return current_checklist

    system_prompt = f"""
    Jesteś analitykiem zgłoszeń ZUS. Twoim zadaniem jest analiza rozmowy i wypełnienie checklisty danymi.

    OBECNY STAN CHECKLISTY (JSON):
    {json.dumps(current_checklist, ensure_ascii=False)}

    ZASADY:
    1. Przeanalizuj CAŁĄ historię rozmowy.
    2. Jeśli użytkownik podał informację -> WPISZ JĄ.
    3. Jeśli zaprzeczył -> wpisz "BRAK".
    4. Nie zmieniaj istniejących danych bez korygowania przez użytkownika.
    5. Zwróć zaktualizowany JSON.

    {EXTRACTION_PROMPT_RULES}

      SZCZEGÓŁOWE WYTYCZNE:

    A. "rodzaj_czynnosci":
       - Konkretna czynność fizyczna (np. wchodzenie po schodach).

    B. "okolicznosci_wypadku":
       - Krótki opis kontekstu.

    C. "sekwencja_zdarzen":
       - Ciąg przyczynowo-skutkowy.

    D. "opis_miejsca_wypadku":
       - Cechy otoczenia.

    E. Pola logiczne:
       - Zostaw null jeśli brak wzmianki.

    WAŻNE: Odpowiedz TYLKO JSONem.
    """

    response_json_str = ""
    try:
        response_json_str = call_llm_api(
            system_prompt, f"Historia rozmowy:\n{history_str}"
        )

        if not response_json_str or response_json_str == "{}":
            return current_checklist

        updated_data = json.loads(response_json_str)

        for key, value in updated_data.items():
            if key in current_checklist:
                if value and value not in [None, "", "null"]:
                    current_checklist[key] = value

        return current_checklist

    except json.JSONDecodeError as e:
        print(f"❌ Błąd parsowania JSON z LLM: {e}")
        return current_checklist
    except Exception as e:
        print(f"❌ Nieoczekiwany błąd w extract_info_from_text: {e}")
        return current_checklist


def generate_next_question(missing_fields: List[str], history_str: str) -> str:

    if not missing_fields:
        return "Dziękuję! Zebrałem wszystkie niezbędne informacje. Czy chcesz coś jeszcze dodać przed zapisaniem?"

    system_prompt = f"""
    Jesteś urzędnikiem ZUS.
    Brakuje informacji w polach: {missing_fields}.

    BAZA WIEDZY:
    {json.dumps(CHECKLISTA_PYTAN, ensure_ascii=False)}

    ZADANIE:
    Zadaj JEDNO uprzejme pytanie o: "{missing_fields[0]}".
    """

    try:
        response = call_llm_api(
            system_prompt,
            f"Historia rozmowy:\n{history_str}",
            expect_json=False,
        )

        if response and response.strip():
            return response.strip()
        else:
            return f"Proszę podać informację dotyczącą: {missing_fields[0]}?"

    except Exception as e:
        print(f"❌ Błąd w generate_next_question: {e}")
        return f"Proszę podać informację dotyczącą: {missing_fields[0]}?"


def process_event_step(
    user_input: str, checklist_state: Dict[str, Any], history: str
) -> Dict[str, Any]:

    updated_history = history + f"\nUser: {user_input}"

    new_checklist_state = extract_info_from_text(
        checklist_state, updated_history
    )

    missing_fields = [
        missing_info_key
        for missing_info_key, missing_info_value in new_checklist_state.items()
        if not missing_info_value
    ]
    is_finished = len(missing_fields) == 0

    ai_response = generate_next_question(missing_fields, updated_history)

    updated_history += f"\nAI: {ai_response}"

    return {
        "ai_message": ai_response,
        "checklist": new_checklist_state,
        "history": updated_history,
        "is_finished": is_finished,
    }


def analyze_opinion(case_data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Analyzes the full case data to determine if it meets the criteria for a work accident.
    """
    if not HAS_LLM_CLIENT or not client or not settings.groq_api_key:
        print("⚠️ Brak konfiguracji LLM dla opinii")
        return {
            "error": "LLM not configured",
            "decision": "unknown"
        }
    
    zawiadomienie = case_data.get("zawiadomienie", {})
    wyjasnienia = case_data.get("wyjasnienia", {})
    
    user_prompt = f"""
    DANE SPRAWY DO ANALIZY:
    
    1. ZAWIADOMIENIE O WYPADKU:
    {json.dumps(zawiadomienie, ensure_ascii=False, indent=2, default=str)}
    
    2. WYJAŚNIENIA POSZKODOWANEGO:
    {json.dumps(wyjasnienia, ensure_ascii=False, indent=2, default=str)}
    """
    
    try:
        response_json_str = call_llm_api(
            OPINION_ANALYSIS_PROMPT, 
            user_prompt,
            expect_json=True
        )
        
        if not response_json_str:
            return {"error": "Empty response from LLM"}
            
        return json.loads(response_json_str)
        
    except Exception as e:
        print(f"❌ Error during opinion analysis: {e}")
        return {"error": str(e)}
