import json
from typing import List, Dict, Any

from prompts.constants import CHECKLISTA_PYTAN
from config import settings

# LLM Congif
try:
    from groq import Groq
    client = Groq(api_key=settings.groq_api_key) if settings.groq_api_key else None
    HAS_LLM_CLIENT = True if client else False
except ImportError:
    HAS_LLM_CLIENT = False
    client = None

# Send request to LLM API
def call_llm_api(system_prompt: str, user_prompt: str, expect_json: bool = True) -> str:
    if not HAS_LLM_CLIENT or not client or not settings.groq_api_key:
        print("⚠️ Brak konfiguracji LLM API")
        return "{}" if expect_json else ""

    try:
        params = {
            "model": "llama-3.3-70b-versatile",
            "messages": [
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": user_prompt}
            ],
            "temperature": 0 if expect_json else 0.7,
            "stream": False
        }

        if expect_json:
            params["response_format"] = {"type": "json_object"}

        completion = client.chat.completions.create(**params)
        return completion.choices[0].message.content

    except Exception as e:
        print(f"❌ Błąd API LLM: {e}")
        return "{}" if expect_json else ""


# Extract information from text using LLM
def extract_info_from_text(current_checklist: Dict[str, Any], history_str: str) -> Dict[str, Any]:

    if not HAS_LLM_CLIENT or not client or not settings.groq_api_key:
        print("⚠️ Brak konfiguracji LLM - checklisty nie zostaną automatycznie wypełnione")
        return current_checklist

    system_prompt = f"""
    Jesteś analitykiem zgłoszeń ZUS. Twoim zadaniem jest analiza rozmowy i wypełnienie checklisty danymi.

    OBECNY STAN CHECKLISTY (JSON):
    {json.dumps(current_checklist, ensure_ascii=False, indent=2)}

    ZASADY:
    1. Przeanalizuj CAŁĄ historię rozmowy, nie tylko ostatnią wiadomość.
    2. Jeśli użytkownik podał informację pasującą do pola -> WPISZ JĄ (zachowaj szczegóły).
    3. Jeśli użytkownik zaprzeczył (np. "nie było świadków") -> wpisz "BRAK" lub "NIE DOTYCZY".
    4. Jeśli pole jest już wypełnione, NIE ZMIENIAJ GO, chyba że użytkownik wyraźnie koryguje dane.
    5. Puste pola (null) pozostaw jako null jeśli nie ma informacji.
    6. Zwróć CAŁY zaktualizowany obiekt JSON z WSZYSTKIMI polami checklisty.
    7. Zachowaj klucze dokładnie takie same jak w oryginalnej checkliście.
    
      SZCZEGÓŁOWE WYTYCZNE DLA PÓL (BARDZO WAŻNE):
    
    A. "rodzaj_czynnosci":
       - NIE wpisuj słowa "praca" ani "wykonywanie obowiązków". To zbyt ogólne.
       - Wpisz KONKRETNĄ czynność fizyczną, np.: "wchodzenie po schodach", "obsługa maszyny", "przenoszenie paczek", "siedzenie przy biurku".
       - Jeśli użytkownik napisał "przewróciłem się na schodach", czynnością było "przemieszczanie się po schodach".
    
    B. "okolicznosci_wypadku":
       - Opisz krótko kontekst sytuacyjny, np. "poślizgnięcie się na mokrej nawierzchni podczas schodzenia".
    
    C. "sekwencja_zdarzen":
       - Musi to być ciąg przyczynowo-skutkowy.
       - Przykład: "Poszkodowany wchodził na schody -> Potknął się o stopień -> Upadł i skręcił nogę".
       - Jeśli użytkownik podał tylko skutek (upadłem), a nie przyczynę (dlaczego?), zostaw to pole null lub wpisz tylko to co pewne.

    D. "opis_miejsca_wypadku":
       - Wyciągnij cechy otoczenia: "mokra podłoga", "ciemna klatka schodowa", "nierówne stopnie".
       - Jeśli użytkownik napisał tylko "schody", wpisz "schody w miejscu pracy".

    E. Pola logiczne (BHP, Maszyny, Świadkowie):
       - Jeśli użytkownik nie wspomniał o temacie -> ZOSTAW null.
       - Wpisz "NIE DOTYCZY" lub "BRAK" tylko jeśli użytkownik wyraźnie zaprzeczył.


    WAŻNE: Odpowiedz TYLKO poprawnym JSONem, bez dodatkowego tekstu.
    """

    try:
        response_json_str = call_llm_api(system_prompt, f"Historia rozmowy:\n{history_str}")

        if not response_json_str or response_json_str == "{}":
            print("⚠️ LLM zwrócił pusty obiekt")
            return current_checklist

        updated_data = json.loads(response_json_str)

        # Update only fileds, wchich LLM did this time
        for key, value in updated_data.items():
            if key in current_checklist:
                # Update with Aktualizuj jeśli wartość nie jest pusta i nie jest None
                if value and value not in [None, "", "null"]:
                    current_checklist[key] = value

        return current_checklist

    except json.JSONDecodeError as e:
        print(f"❌ Błąd parsowania JSON z LLM: {e}")
        if 'response_json_str' in locals():
            print(f"Otrzymana odpowiedź: {response_json_str[:300]}...")
        return current_checklist
    except Exception as e:
        print(f"❌ Nieoczekiwany błąd w extract_info_from_text: {e}")
        return current_checklist


def generate_next_question(missing_fields: List[str], history_str: str) -> str:

    if not missing_fields:
        return "Dziękuję! Zebrałem wszystkie niezbędne informacje. Czy chcesz coś jeszcze dodać przed zapisaniem?"

    system_prompt = f"""
    Jesteś urzędnikiem ZUS przyjmującym zgłoszenie wypadku.
    Brakuje nam informacji w polach: {missing_fields}.

    TWOJA BAZA WIEDZY (DEFINICJE PRAWNE):
    {json.dumps(CHECKLISTA_PYTAN, ensure_ascii=False)}

    ZADANIE:
    Zadaj JEDNO uprzejme, konkretne pytanie, aby uzyskać informację do pola: "{missing_fields[0]}".
    Opieraj się na definicjach prawnych (np. pytając o nagłość, dopytaj czy zdarzenie było nagłe czy trwało długo).
    Nie pytaj o wszystko na raz.
    Odpowiedz TYLKO pytaniem, bez dodatkowych komentarzy.
    """

    try:
        response = call_llm_api(system_prompt, f"Historia rozmowy:\n{history_str}", expect_json=False)

        if response and response.strip():
            return response.strip()
        else:
            # Fallback
            return f"Proszę podać informację dotyczącą: {missing_fields[0]}?"

    except Exception as e:
        print(f"❌ Błąd w generate_next_question: {e}")
        return f"Proszę podać informację dotyczącą: {missing_fields[0]}?"


def process_event_step(
        user_input: str,
        checklist_state: Dict[str, Any],
        history: str
) -> Dict[str, Any]:

    # Add user input to history
    updated_history = history + f"\nUser: {user_input}"

    # Extract new info from text
    new_checklist_state = extract_info_from_text(checklist_state, updated_history)

    # Check for missing fields
    missing_fields = [
        missing_info_key
        for missing_info_key, missing_info_value in new_checklist_state.items()
        if not missing_info_value
    ]
    is_finished = len(missing_fields) == 0

    # Generate next question if not finished
    ai_response = generate_next_question(missing_fields, updated_history)

    # Add AI response to history
    updated_history += f"\nAI: {ai_response}"

    return {
        "ai_message": ai_response,
        "checklist": new_checklist_state,
        "history": updated_history,
        "is_finished": is_finished
    }