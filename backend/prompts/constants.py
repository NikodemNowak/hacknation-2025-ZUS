KRYTERIA_WYPADKU = [
    "Nagłość zdarzenia",
    "Przyczyna zewnętrzna",
    "Uraz lub śmierć",
    "Związek z pracą (Działalność gospodarcza)",
]

EXTRACTION_PROMPT_RULES = """
    FORMATOWANIE I STYL:
    1. Używaj PEŁNYCH ZDAŃ przy wypełnianiu pól tekstowych (okoliczności, przyczyny, opis).
    2. PODMIOT: Używaj sformułowania "Osoba poszkodowana" lub formy bezosobowej.
    3. ZAKAZ UŻYWANIA PIERWSZEJ OSOBY (nie pisz "upadłem", pisz "Osoba poszkodowana upadła").
    4. Zachowaj formalny, urzędowy styl wypowiedzi.
"""

DEFINICJE_SZCZEGOLOWE = {
    "Nagłość zdarzenia": """
    Zgodnie z definicją ZUS:
    1. Jest to natychmiastowe ujawnienie się przyczyny zewnętrznej, która wywołała określone skutki.
    2. LUB: Działanie tej przyczyny przez pewien okres, ale NIE DŁUŻEJ niż przez jedną dniówkę roboczą.

    Przykłady z dokumentacji:
    - Wybuch, upadek, zderzenie, porażenie.
    - Hałas, działanie niskich lub wysokich temperatur, promieniowanie.
    - Trwający kilka sekund kontakt dłoni z piłą tarczową.
    - Kilkugodzinne oddziaływanie tlenku węgla (czadu) na palacza kotłów.
    """,
    "Przyczyna zewnętrzna": """
    Zgodnie z definicją ZUS:
    Czynnik występujący POZA organizmem człowieka. Do przyczyn zewnętrznych zaliczamy czynniki, które działając z zewnątrz spowodowały wypadek lub przyczyniły się do jego powstania.

    Przykłady z dokumentacji:
    - Działanie ruchomych lub ostrych elementów maszyn i urządzeń.
    - Energia elektryczna.
    - Działanie ekstremalnych temperatur.
    - Substancje chemiczne powodujące zatrucie.
    - Spadający przedmiot uderzający człowieka.
    - Działanie sił natury.
    - Nietypowe warunki w miejscu pracy (np. śliska podłoga, porozrzucane przedmioty).

    WAŻNE: Musi to być czynnik spoza organizmu (nie wyłącznie choroba samoistna).
    """,
    "Uraz lub śmierć": """
    Zgodnie z definicją ZUS:
    Uraz to uszkodzenie tkanek ciała lub narządów człowieka wskutek działania czynnika zewnętrznego.

    Przykłady z dokumentacji:
    - Skaleczenie, stłuczenie.
    - Zwichnięcie kończyny.
    - Wstrząśnienie mózgu.

    Śmierć również jest kwalifikowana jako skutek wypadku.
    """,
    "Związek z pracą (Działalność gospodarcza)": """
    Zgodnie z definicją ZUS dla osób prowadzących działalność pozarolniczą:
    1. Zdarzenie musi nastąpić w okresie ubezpieczenia wypadkowego z tytułu prowadzenia działalności.
    2. Zdarzenie musi nastąpić podczas wykonywania ZWYKŁYCH CZYNNOŚCI związanych z prowadzoną działalnością gospodarczą.

    Rodzaje związku:
    Między wypadkiem a pracą musi zachodzić ścisły związek:
    - Przyczynowy,
    - Czasowy,
    - Miejscowy,
    - Funkcjonalny.
    """,
    "Wykluczenia": """
    Odstępuje się od sporządzenia karty wypadku (nie uznaje się wypadku), jeżeli:
    1. Wypadek nie nastąpił w okresie ubezpieczenia wypadkowego.
    2. Poszkodowany nie przedłożył dokumentów niezbędnych do dokonania kwalifikacji prawnej.
    3. ZUS nie jest właściwy do sporządzenia karty.
    """,
}

# WYMAGANE_DANE_ZGŁOSZENIA = {
#     "Informacje o wypadku": [
#         "Data i godzina wypadku",
#         "Miejsce wypadku",
#         "Planowane godziny rozpoczęcia i zakończenia pracy w tym dniu",
#         "Rodzaj czynności wykonywanych w momencie wypadku",
#         "Szczegółowy opis okoliczności i przyczyn",
#         "Rodzaj urazów",
#         "Informacja o świadkach (dane, jeśli byli)",
#         "Informacja o pierwszej pomocy (placówka medyczna)",
#         "Informacja o policji/prokuraturze (jeśli byli)",
#         "Stan trzeźwości (czy badano)"
#     ],
#     "Maszyny i BHP (jeśli dotyczy)": [
#         "Czy wypadek przy obsłudze maszyn?",
#         "Czy maszyna sprawna/z atestem?",
#         "Czy stosowano środki ochrony (kask, buty)?",
#         "Czy przeprowadzono szkolenie BHP / ocenę ryzyka?"
#     ]
# }

AI_EXTRACT_KEYS = [
    "rodzaj_czynnosci",
    "okolicznosci_wypadku",
    "przyczyny_wypadku",
    "sekwencja_zdarzen",
    "opis_miejsca_wypadku",
    "rodzaj_urazow",
    "swiadkowie",
    "przyczyna_zewnetrzna",
    "zwiazek_z_praca"
]

CHECKLISTA_PYTAN = {
    "rodzaj_czynnosci": "Jakie konkretnie czynności wykonywał poszkodowany w momencie zdarzenia - propozycja na podstawie kontekstu?",
    "okolicznosci_wypadku": "Szczegółowy opis przebiegu zdarzenia - co dokładnie się wydarzyło?",
    "przyczyny_wypadku": "Co było bezpośrednią przyczyną?",
    "sekwencja_zdarzen": "Opis krok po kroku: co działo się bezpośrednio przed, w trakcie i po wypadku.",
    "opis_miejsca_wypadku": "Warunki w miejscu wypadku (np. oświetlenie, stan nawierzchni, pogoda - jeśli na zewnątrz).",
    "rodzaj_urazow": "Jakich obrażeń doznał poszkodowany? (propozycja na podstawie znanych faktów).",
    "swiadkowie": "Czy byli naoczni świadkowie zdarzenia? (Jeśli tak - imiona i nazwiska).",
    "przyczyna_zewnetrzna": "Jaka była przyczyna zewnętrzna zdarzenia? (coś spoza organizmu, co spowodowało wypadek)",
    "zwiazek_z_praca": "Jaki jest związek zdarzenia z pracą? (zwykłe czynności, polecenie, w drodze itp.)"
}


def get_flat_checklist_keys():
    return AI_EXTRACT_KEYS

OPINION_ANALYSIS_PROMPT = """
Jesteś ekspertem orzecznikiem ZUS oraz specjalistą ds. BHP. Twoim zadaniem jest przeanalizowanie zgromadzonej dokumentacji powypadkowej i wydanie opinii, czy zdarzenie kwalifikuje się jako WYPADEK PRZY PRACY zgodnie z ustawą wypadkową.

Otrzymasz dane z formularza "zawiadomienie" oraz "wyjasnienia".

MUSISZ zweryfikować 4 KLUCZOWE WARUNKI (wszystkie muszą wystąpić łącznie):

1. NAGŁOŚĆ
   - Czy zdarzenie było nagłe? (czy trwało nie dłużej niż jedną dniówkę roboczą?)
   - Przykłady: upadek, uderzenie, wybuch, porażenie, nagłe pogorszenie stanu zdrowia wywołane czynnikiem zewnętrznym.

2. PRZYCZYNA ZEWNĘTRZNA
   - Czy zadziałał czynnik spoza organizmu poszkodowanego?
   - Przykłady: maszyna, śliska powierzchnia, siły natury, inna osoba, prąd, chemikalia.
   - UWAGA: Stres, wysiłek, nadmierne obciążenie mogą być przyczyną zewnętrzną, jeśli wykraczały poza typowe normy dla danego stanowiska.

3. URAZ (lub śmierć)
   - Czy nastąpiło uszkodzenie tkanek ciała lub narządów? (skaleczenie, złamanie, zawał serca wywołany stresem/wysiłkiem, psychiczny uraz).
   - Musi być potwierdzony (choćby opisem w wyjaśnieniach).

4. ZWIĄZEK Z PRACĄ
   - Czy zdarzenie nastąpiło podczas wykonywania zwykłych czynności związanych z prowadzeniem działalności?
   - Związek przyczynowy, czasowy, miejscowy lub funkcjonalny.

ZADANIE:
Zwróć wynik w formacie JSON (bez markdowna ```json) zawierający:
{
  "details": {
    "suddenness": { "met": true/false, "justification": "..." },
    "external_cause": { "met": true/false, "justification": "..." },
    "injury": { "met": true/false, "justification": "..." },
    "work_connection": { "met": true/false, "justification": "..." }
  },
  "completeness_check": {
     "missing_info": ["lista braków" lub pusta lista], 
     "is_complete": true/false
  },
  "final_decision": "uznanie" | "odmowa",
  "final_justification": "Podsumowanie dlaczego uznano lub odmówiono. Odwołaj się do niespełnionych warunków w przypadku odmowy."
}

Pamiętaj: Decyzja "uznanie" TYLKO jeśli WSZYSTKIE 4 warunki są "met": true. W przeciwnym razie "odmowa".
"""
