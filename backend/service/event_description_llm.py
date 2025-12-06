import json
import os
from typing import List, Dict, Any

from prompts.constants import DEFINICJE_SZCZEGOLOWE

# LLM Congif
try:
    from groq import Groq
    client = Groq(api_key=os.environ.get("GROQ_API_KEY", ""))
    HAS_LLM_CLIENT = True
except ImportError:
    HAS_LLM_CLIENT = False

# Send request to LLM API
def call_llm_api(system_prompt: str, user_prompt: str) -> str:
    if HAS_LLM_CLIENT and os.environ.get("GROQ_API_KEY"):
        try:
            completion = client.chat.completions.create(
                model="llama3-70b-8192",
                messages=[
                    {"role": "system", "content": system_prompt},
                    {"role": "user", "content": user_prompt}
                ],
                temperature=0,
                stream=False,
                response_format={"type": "json_object"}
            )
            return completion.choices[0].message.content
        except Exception as e:
            print(f"Błąd API LLM: {e}")
            return "{}"

    print(" [MOCK LLM] Uruchomiono tryb symulacji (brak klucza API)")
    return "{}"


# Extract information from text using LLM
def extract_info_from_text(current_checklist: Dict[str, Any], history_str: str) -> Dict[str, Any]:
    # Najpierw spróbuj użyć LLM API
    if HAS_LLM_CLIENT and os.environ.get("GROQ_API_KEY"):
        system_prompt = f"""
        Jesteś analitykiem zgłoszeń ZUS. Twoim zadaniem jest analiza rozmowy i wypełnienie checklisty danymi.

        OBECNY STAN CHECKLISTY (JSON):
        {json.dumps(current_checklist, ensure_ascii=False)}

        ZASADY:
        1. Przeanalizuj historię rozmowy.
        2. Jeśli użytkownik podał informację pasującą do pola -> WPISZ JĄ (zacytuj lub streść).
        3. Jeśli użytkownik zaprzeczył (np. "nie było świadków") -> wpisz "BRAK" lub "NIE DOTYCZY".
        4. Jeśli pole jest już wypełnione, NIE ZMIENIAJ GO, chyba że użytkownik wyraźnie koryguje dane.
        5. Zwróć CAŁY zaktualizowany obiekt JSON z WSZYSTKIMI polami checklisty.
        """

        response_json_str = call_llm_api(system_prompt, f"Historia rozmowy:\n{history_str}")

        try:
            updated_data = json.loads(response_json_str)
            for key, value in updated_data.items():
                if key in current_checklist and value:
                    current_checklist[key] = value
            return current_checklist
        except json.JSONDecodeError:
            print(f"Błąd parsowania JSON z LLM: {response_json_str[:200]}")

    # Fallback: prosta ekstrakcja bez LLM (dla trybu testowego)
    import re
    from datetime import datetime, timedelta

    last_msg = history_str.split("User:")[-1] if "User:" in history_str else history_str
    last_msg_lower = last_msg.lower()

    # Data i godzina
    if current_checklist.get("Data i godzina wypadku") is None:
        if "wczoraj" in last_msg_lower:
            yesterday = (datetime.now() - timedelta(days=1)).strftime("%Y-%m-%d")
            time_match = re.search(r'(\d{1,2}):(\d{2})', last_msg)
            if time_match:
                current_checklist["Data i godzina wypadku"] = f"{yesterday} o godzinie {time_match.group(0)}"
            else:
                current_checklist["Data i godzina wypadku"] = f"{yesterday}"
        elif "dzisiaj" in last_msg_lower or "dziś" in last_msg_lower:
            today = datetime.now().strftime("%Y-%m-%d")
            time_match = re.search(r'(\d{1,2}):(\d{2})', last_msg)
            if time_match:
                current_checklist["Data i godzina wypadku"] = f"{today} o godzinie {time_match.group(0)}"
        else:
            # Szukaj daty w formacie DD.MM.YYYY lub DD-MM-YYYY
            date_match = re.search(r'(\d{1,2})[.\-/](\d{1,2})[.\-/](\d{4})', last_msg)
            time_match = re.search(r'(\d{1,2}):(\d{2})', last_msg)
            if date_match:
                date_str = f"{date_match.group(3)}-{date_match.group(2).zfill(2)}-{date_match.group(1).zfill(2)}"
                if time_match:
                    current_checklist["Data i godzina wypadku"] = f"{date_str} o godzinie {time_match.group(0)}"
                else:
                    current_checklist["Data i godzina wypadku"] = date_str
            elif time_match:
                current_checklist["Data i godzina wypadku"] = f"godzina {time_match.group(0)}"

    # Miejsce wypadku
    if current_checklist.get("Miejsce wypadku") is None:
        if "w pracy" in last_msg_lower or "w firmie" in last_msg_lower:
            places = []
            if "schodach" in last_msg_lower or "schodach" in last_msg_lower:
                places.append("schody")
            if "magazyn" in last_msg_lower:
                places.append("magazyn")
            if "biur" in last_msg_lower:
                places.append("biuro")
            if "parking" in last_msg_lower:
                places.append("parking")
            if "warsztat" in last_msg_lower:
                places.append("warsztat")

            if places:
                current_checklist["Miejsce wypadku"] = f"{', '.join(places)} w miejscu pracy"
            else:
                current_checklist["Miejsce wypadku"] = "miejsce pracy"

    # Rodzaj czynności
    if current_checklist.get("Rodzaj czynności wykonywanych w momencie wypadku") is None:
        activities = []
        if "schod" in last_msg_lower and ("wchodzi" in last_msg_lower or "schodzi" in last_msg_lower or "szedł" in last_msg_lower or "szła" in last_msg_lower):
            activities.append("poruszanie się po schodach")
        if "niosł" in last_msg_lower or "niosła" in last_msg_lower or "dźwigał" in last_msg_lower:
            activities.append("przenoszenie przedmiotów")
        if "pracował" in last_msg_lower or "pracowała" in last_msg_lower:
            activities.append("wykonywanie pracy")

        if activities:
            current_checklist["Rodzaj czynności wykonywanych w momencie wypadku"] = ", ".join(activities)

    # Szczegółowy opis okoliczności
    if current_checklist.get("Szczegółowy opis okoliczności i przyczyn") is None:
        if len(last_msg.strip()) > 20:
            current_checklist["Szczegółowy opis okoliczności i przyczyn"] = last_msg.strip()

    # Rodzaj urazów
    if current_checklist.get("Rodzaj urazów") is None:
        injuries = []
        if "skręc" in last_msg_lower:
            if "kostk" in last_msg_lower:
                injuries.append("skręcenie kostki")
            else:
                injuries.append("skręcenie")
        if "złam" in last_msg_lower:
            injuries.append("złamanie")
        if "stłucz" in last_msg_lower or "siniak" in last_msg_lower:
            injuries.append("stłuczenie")
        if "skalecz" in last_msg_lower or "rana" in last_msg_lower:
            injuries.append("skaleczenie")
        if "oparz" in last_msg_lower or "sparz" in last_msg_lower:
            injuries.append("oparzenie")
        if "uraz głowy" in last_msg_lower or "wstrząs mózgu" in last_msg_lower:
            injuries.append("uraz głowy")

        if injuries:
            current_checklist["Rodzaj urazów"] = ", ".join(injuries)

    # Świadkowie
    if current_checklist.get("Informacja o świadkach (dane, jeśli byli)") is None:
        if "nie było świadków" in last_msg_lower or "bez świadków" in last_msg_lower or "nikt nie widział" in last_msg_lower:
            current_checklist["Informacja o świadkach (dane, jeśli byli)"] = "BRAK ŚWIADKÓW"
        elif "świadek" in last_msg_lower or "widział" in last_msg_lower or "widziała" in last_msg_lower:
            # Próbuj wyciągnąć imiona i nazwiska
            name_pattern = r'[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+\s+[A-ZĄĆĘŁŃÓŚŹŻ][a-ząćęłńóśźż]+'
            names = re.findall(name_pattern, last_msg)
            if names:
                current_checklist["Informacja o świadkach (dane, jeśli byli)"] = ", ".join(names)
            else:
                current_checklist["Informacja o świadkach (dane, jeśli byli)"] = "Świadkowie obecni (szczegóły w opisie)"

    return current_checklist


def generate_next_question(missing_fields: List[str], history_str: str) -> str:

    if not missing_fields:
        return "Dziękuję! Zebrałem wszystkie niezbędne informacje. Czy chcesz coś jeszcze dodać przed zapisaniem?"

    system_prompt = f"""
    Jesteś urzędnikiem ZUS przyjmującym zgłoszenie wypadku.
    Brakuje nam informacji w polach: {missing_fields}.

    TWOJA BAZA WIEDZY (DEFINICJE PRAWNE):
    {json.dumps(DEFINICJE_SZCZEGOLOWE, ensure_ascii=False)}

    ZADANIE:
    Zadaj JEDNO uprzejme, konkretne pytanie, aby uzyskać informację do pola: "{missing_fields[0]}".
    Opieraj się na definicjach prawnych (np. pytając o nagłość, dopytaj czy zdarzenie było nagłe czy trwało długo).
    Nie pytaj o wszystko na raz.
    """

    if HAS_LLM_CLIENT and os.environ.get("GROQ_API_KEY"):
        completion = client.chat.completions.create(
            model="llama3-70b-8192",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": f"Historia rozmowy:\n{history_str}"}
            ],
            temperature=0.7
        )
        return completion.choices[0].message.content

    return f"Proszę podać informację dotyczącą: {missing_fields[0]}?"


def process_event_step(
        user_input: str,
        checklist_state: Dict[str, Any],
        history: str
) -> Dict[str, Any]:


    updated_history = history + f"\nUser: {user_input}"
    new_checklist_state = extract_info_from_text(checklist_state, updated_history)
    missing_fields = [missing_info_key for missing_info_key, missing_info_value in new_checklist_state.items() if not missing_info_value]
    is_finished = len(missing_fields) == 0

    ai_response = generate_next_question(missing_fields, updated_history)

    updated_history += f"\nAI: {ai_response}"

    return {
        "ai_message": ai_response,
        "checklist": new_checklist_state,
        "history": updated_history,
        "is_finished": is_finished
    }