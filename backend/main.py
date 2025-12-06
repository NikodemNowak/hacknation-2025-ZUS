# ========== backend/main.py ==========
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn
from uuid import uuid4
from datetime import date

from database import cases_db
from config import settings
from routes import poszkodowani_router, adres_router, event_description_router, case_router

app = FastAPI(
    title=settings.app_name,
    description="API do zarządzania danymi poszkodowanych",
    version=settings.app_version
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(poszkodowani_router, prefix=settings.api_prefix)
app.include_router(adres_router, prefix=settings.api_prefix)
app.include_router(event_description_router, prefix=settings.api_prefix)
app.include_router(case_router, prefix=settings.api_prefix)


@app.get("/")
async def root():
    return {
        "message": "API działa poprawnie",
        "version": settings.app_version,
        "endpoints": {
            "docs": "/docs",
            "poszkodowani": f"{settings.api_prefix}/poszkodowani",
            "adresy": f"{settings.api_prefix}/adresy",
            "event_description": f"{settings.api_prefix}/event-description"
        }
    }

if __name__ == "__main__":
    print(f"Uruchamianie {settings.app_name}...")
    print(f"Dokumentacja: http://localhost:{settings.port}/docs")
    print(f"API endpoint: http://localhost:{settings.port}{settings.api_prefix}/poszkodowani/")

    uvicorn.run("main:app", host=settings.host, port=settings.port, reload=True)




@app.post("/debug/seed-data")
def seed_dummy_data():
    """
    POPRAWIONA WERSJA: Dostosowana do nazw pól wymaganych przez walidację Pydantic.
    """

    # ==========================================
    # 1. OBIEKTY POMOCNICZE
    # ==========================================

    adres_wzor = {
        "ulica": "Przemysłowa",
        "nr_domu": "15",
        "nr_lokalu": None,
        "kod_pocztowy": "00-123",
        "miejscowosc": "Warszawa",
        "panstwo": "Polska"
    }

    # POPRAWKA 1: Dostosowanie do modelu Dzialalnosc (na podst. logów błędu)
    dane_platnika = {
        "nazwa_firmy": "BUD-MAX Sp. z o.o.",  # Było 'nazwa'
        "nip_regon": "5250001234",  # Było 'nip' i 'regon' osobno
        "kod_pkd": "41.20.Z",
        "adres_siedziby": adres_wzor  # Było 'adres'
    }

    # POPRAWKA 2: Dostosowanie do modelu PomocMedyczna (na podst. logów błędu)
    dane_pomocy_medycznej = {
        "czy_udzielono": True,  # Było 'czy_udzielono_pomocy'
        "rodzaj_pomocy": "Założenie opatrunku uciskowego",
        "kto_udzielil": "Ratownik medyczny Jan Nowak",
        "miejsce_udzielenia": "Szpital Bielański, Warszawa"
    }

    # ==========================================
    # 2. DANE POSZKODOWANEGO
    # ==========================================
    dane_poszkodowanego = {
        "pesel": "90010112345",
        "rodzaj_dokumentu": "dowód osobisty",
        "seria_dokumentu": "XYZ",
        "numer_dokumentu": "123456",
        "imie": "Adam",
        "nazwisko": "Nowak",
        "data_urodzenia": "1990-01-01",
        "miejsce_urodzenia": "Warszawa",
        "numer_telefonu": "+48500600700",
        "adres_zamieszkania": adres_wzor,
        "adres_korespondencyjny": None,
        "adres_ostatniego_zamieszkania_polska": None
    }

    # ==========================================
    # 3. DANE ZAWIADOMIENIA
    # ==========================================
    dane_zawiadomienia = {
        "data_utworzenia": str(date.today()),

        "platnik_skladek": dane_platnika,
        "poszkodowany": dane_poszkodowanego,

        "czy_zglasza_pelnomocnik": False,
        "pelnomocnik": None,

        "data_wypadku": "2023-11-15",
        "godzina_wypadku": "10:15:00",
        "miejsce_wypadku": "Hala produkcyjna nr 2, stanowisko montażu",

        "planowana_godzina_rozpoczecia": "08:00:00",
        "planowana_godzina_zakonczenia": "16:00:00",

        "rodzaj_urazow": "Skręcenie stawu skokowego",
        "opis_okolicznosci": "Podczas przenoszenia kartonów pracownik potknął się o pozostawioną paletę. " * 2,
        "przyczyna_zewnetrzna": "Nierówność podłoża / przeszkoda",
        "czy_naglosc": True,
        "zwiazek_z_praca": "Podczas wykonywania zwykłych czynności",

        "swiadkowie": [],
        "czy_udzielono_pomocy": True,
        "placowka_medyczna": "Szpital Bielański",
        "czy_powiadomiono_sluzby": False,
        "postepowania": []
    }

    # ==========================================
    # 4. DANE WYJAŚNIEŃ
    # ==========================================
    dane_wyjasnien = {
        "poszkodowany": dane_poszkodowanego,

        "data_wypadku": "2023-11-15",
        "godzina_wypadku": "10:15:00",
        "miejsce_wypadku": "Hala produkcyjna nr 2",

        "godzina_rozpoczecia_pracy": "08:00:00",
        "godzina_zakonczenia_pracy": "16:00:00",

        "rodzaj_urazow": "Skręcenie kostki prawej",

        "rodzaj_czynnosci": "Transport ręczny materiałów",
        "okolicznosci_wypadku": "Szedłem z magazynu na stanowisko montażowe niosąc pudełko z częściami.",
        "przyczyny_wypadku": "Niezauważenie przeszkody (palety) leżącej w ciągu komunikacyjnym.",
        "sekwencja_zdarzen": "1. Pobranie towaru. 2. Przejście alejką nr 4. 3. Zahaczenie nogą o paletę. 4. Upadek.",
        "opis_miejsca_wypadku": "Alejka betonowa, oświetlenie sztuczne, sucha nawierzchnia.",

        "czy_wypadek_podczas_obslugi_maszyn": False,
        "informacje_o_maszynie": None,

        "czy_stosowane_zabezpieczenia": True,
        "rodzaj_srodkow_ochrony": "Buty robocze z podnoskiem",
        "czy_srodki_wlasciwe_i_sprawne": True,

        "czy_stosowana_asekuracja": False,
        "czy_praca_do_wykonania_samodzielnie": True,
        "czy_wymagane_min_2_osoby": False,

        "czy_przestrzegane_zasady_bhp": True,
        "czy_posiada_przygotowanie": True,
        "czy_odbyte_szkolenia_bhp": True,
        "czy_opracowana_ocena_ryzyka": True,
        "srodki_zmniejszajace_ryzyko": "Szkolenia stanowiskowe, odzież ochronna",

        "czy_stan_nietrzezwosci": False,
        "czy_pod_wplywem_srodkow": False,
        "czy_badany_stan_trzeźwosci": True,
        "przez_kogo_badany": "Policja (na wezwanie kierownika)",

        "czy_prowadzone_postepowania": False,
        "postepowania": [],

        "pomoc_medyczna": dane_pomocy_medycznej,  # Używamy poprawionego obiektu
        "czy_na_zwolnieniu_w_dniu_wypadku": False,
        "swiadkowie": []
    }

    # ==========================================
    # 5. ZŁOŻENIE CAŁOŚCI
    # ==========================================
    dummy_case = {
        "id": str(uuid4()),
        "data_utworzenia": str(date.today()),
        "status": "Weryfikacja",
        "poszkodowany": dane_poszkodowanego,
        "zawiadomienie": dane_zawiadomienia,
        "wyjasnienia": dane_wyjasnien
    }

    cases_db.append(dummy_case)
    return {"message": "Dodano dane (Seed poprawiony)", "case_id": dummy_case["id"]}