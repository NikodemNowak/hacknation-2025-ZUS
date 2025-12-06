
KRYTERIA_WYPADKU = [
    "Nagłość zdarzenia",
    "Przyczyna zewnętrzna",
    "Uraz lub śmierć",
    "Związek z pracą (Działalność gospodarcza)"
]

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
    """
}

WYMAGANE_DANE_ZGŁOSZENIA = {
    "Informacje o wypadku": [
        "Data i godzina wypadku",
        "Miejsce wypadku",
        "Planowane godziny rozpoczęcia i zakończenia pracy w tym dniu",
        "Rodzaj czynności wykonywanych w momencie wypadku",
        "Szczegółowy opis okoliczności i przyczyn",
        "Rodzaj urazów",
        "Informacja o świadkach (dane, jeśli byli)",
        "Informacja o pierwszej pomocy (placówka medyczna)",
        "Informacja o policji/prokuraturze (jeśli byli)",
        "Stan trzeźwości (czy badano)"
    ],
    "Maszyny i BHP (jeśli dotyczy)": [
        "Czy wypadek przy obsłudze maszyn?",
        "Czy maszyna sprawna/z atestem?",
        "Czy stosowano środki ochrony (kask, buty)?",
        "Czy przeprowadzono szkolenie BHP / ocenę ryzyka?"
    ]
}



def get_flat_checklist_keys():
    keys = []
    for category, items in WYMAGANE_DANE_ZGŁOSZENIA.items():
        for item in items:
            keys.append(item)
    return keys