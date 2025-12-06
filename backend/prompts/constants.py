
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
    "pomoc_medyczna",

    "czy_wypadek_podczas_obslugi_maszyn",
    "informacje_o_maszynie",

    "czy_stosowane_zabezpieczenia",
    "rodzaj_srodkow_ochrony",
    "czy_srodki_wlasciwe_i_sprawne",
    "czy_przestrzegane_zasady_bhp",

    "czy_stosowana_asekuracja",
    "czy_praca_do_wykonania_samodzielnie",

    "swiadkowie",
    "czy_badany_stan_trzeźwosci",
    "przez_kogo_badany",
    "czy_prowadzone_postepowania"
]

CHECKLISTA_PYTAN = {
    "rodzaj_czynnosci": "Jakie konkretnie czynności wykonywał poszkodowany w momencie zdarzenia? (np. przenoszenie, malowanie, obsługa maszyny)",
    "okolicznosci_wypadku": "Szczegółowy opis przebiegu zdarzenia - co dokładnie się wydarzyło?",
    "przyczyny_wypadku": "Co było bezpośrednią przyczyną? (np. poślizgnięcie, awaria maszyny, upadek przedmiotu, przyczyna zewnętrzna)",
    "sekwencja_zdarzen": "Opis krok po kroku: co działo się bezpośrednio przed, w trakcie i po wypadku.",
    "opis_miejsca_wypadku": "Warunki w miejscu wypadku (np. oświetlenie, stan nawierzchni, pogoda - jeśli na zewnątrz).",

    "rodzaj_urazow": "Jakich obrażeń doznał poszkodowany? (np. złamanie, stłuczenie, rana cięta).",
    "pomoc_medyczna": "Czy udzielono pierwszej pomocy? Czy wezwano pogotowie? Czy poszkodowany trafił do szpitala?",

    "czy_wypadek_podczas_obslugi_maszyn": "Czy wypadek wydarzył się podczas pracy z maszyną lub urządzeniem technicznym? (Tak/Nie)",
    "informacje_o_maszynie": "Jeśli była maszyna: czy była sprawna? Czy posiadała osłony? Jaka to maszyna?",

    "czy_stosowane_zabezpieczenia": "Czy stosowano środki ochrony zbiorowej lub indywidualnej?",
    "rodzaj_srodkow_ochrony": "Jakie konkretnie środki ochrony miał poszkodowany? (kask, buty, okulary, rękawice).",
    "czy_srodki_wlasciwe_i_sprawne": "Czy te środki były sprawne i odpowiednie do zagrożenia?",
    "czy_przestrzegane_zasady_bhp": "Czy praca była wykonywana zgodnie z przepisami BHP?",

    "czy_stosowana_asekuracja": "Czy ktoś asekurował poszkodowanego? (jeśli praca tego wymagała).",
    "czy_praca_do_wykonania_samodzielnie": "Czy tę pracę można było wykonywać w pojedynkę, czy wymagała zespołu?",

    "swiadkowie": "Czy byli naoczni świadkowie zdarzenia? (Jeśli tak - imiona i nazwiska).",
    "czy_badany_stan_trzeźwosci": "Czy sprawdzono trzeźwość poszkodowanego po wypadku?",
    "przez_kogo_badany": "Kto przeprowadził badanie trzeźwości? (np. Policja, pracodawca, szpital).",
    "czy_prowadzone_postepowania": "Czy na miejscu była Policja, Prokurator lub Inspekcja Pracy?"
}

def get_flat_checklist_keys():
    return AI_EXTRACT_KEYS