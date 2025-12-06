from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date, time

from .Poszkodowany import Poszkodowany
from .InformacjeOMaszynie import InformacjeOMaszynie
from .PostepowanieOrganow import PostepowanieOrganow
from .PomocMedyczna import PomocMedyczna
from .Swiadek import Swiadek

class ZapisWyjasnienPoszkodowanego(BaseModel):
    """
    Pełny zapis wyjaśnień poszkodowanego zgodnie z wymaganiami ZUS.
    Zawiera wszystkie informacje wymagane do oceny wypadku przy pracy.
    """

    # === DANE PODSTAWOWE ===
    poszkodowany: Poszkodowany = Field(..., description="Obiekt poszkodowanego")
    data_wypadku: date = Field(..., description="Data wypadku")
    godzina_wypadku: time = Field(..., description="Godzina wypadku")
    miejsce_wypadku: str = Field(..., description="Dokładny adres/lokalizacja miejsca wypadku")

    # === PLANOWANE GODZINY PRACY ===
    godzina_rozpoczecia_pracy: time = Field(..., description="Planowana godzina rozpoczęcia pracy")
    godzina_zakonczenia_pracy: time = Field(..., description="Planowana godzina zakończenia pracy")

    # === RODZAJ URAZÓW ===
    rodzaj_urazow: str = Field(..., description="Rodzaj urazów jakich doznał poszkodowany")

    # === CZYNNOŚCI I OKOLICZNOŚCI ===
    rodzaj_czynnosci: str = Field(
        ...,
        description="Rodzaj czynności wykonywanych do momentu wypadku, związanych z działalnością"
    )
    okolicznosci_wypadku: str = Field(
        ...,
        description="Szczegółowy opis okoliczności, w których doszło do wypadku"
    )
    przyczyny_wypadku: str = Field(..., description="Przyczyny wypadku")
    sekwencja_zdarzen: str = Field(
        ...,
        description="Sekwencja zdarzeń - co się działo kolejno, jakie fakty doprowadziły do urazu"
    )
    opis_miejsca_wypadku: str = Field(
        ...,
        description="Opis miejsca wypadku (warunki, stan podłogi, oświetlenie itp.)"
    )

    # === MASZYNY I NARZĘDZIA ===
    czy_wypadek_podczas_obslugi_maszyn: bool = Field(
        ...,
        description="Czy wypadek powstał podczas obsługi maszyn/narzędzi"
    )
    informacje_o_maszynie: Optional[InformacjeOMaszynie] = Field(
        None,
        description="Szczegóły maszyny/urządzenia (jeśli dotyczy)"
    )

    # === ŚRODKI OCHRONY BHP ===
    czy_stosowane_zabezpieczenia: bool = Field(
        ...,
        description="Czy stosowane zabezpieczenia przed wypadkiem"
    )
    rodzaj_srodkow_ochrony: Optional[str] = Field(
        None,
        description="Rodzaj stosowanych środków ochrony (np. buty, kask, odzież ochronna, rękawice)"
    )
    czy_srodki_wlasciwe_i_sprawne: Optional[bool] = Field(
        None,
        description="Czy stosowane środki ochrony były właściwe i sprawne"
    )

    # === ASEKURACJA I ORGANIZACJA PRACY ===
    czy_stosowana_asekuracja: bool = Field(..., description="Czy stosowana asekuracja podczas pracy")
    czy_praca_do_wykonania_samodzielnie: bool = Field(
        ...,
        description="Czy daną pracę można było wykonywać samodzielnie"
    )
    czy_wymagane_min_2_osoby: bool = Field(
        ...,
        description="Czy pracę musiały wykonywać co najmniej dwie osoby"
    )

    # === PRZESTRZEGANIE ZASAD BHP ===
    czy_przestrzegane_zasady_bhp: bool = Field(
        ...,
        description="Czy w trakcie pracy przestrzegane zasady BHP"
    )
    czy_posiada_przygotowanie: bool = Field(
        ...,
        description="Czy posiadane przygotowanie do wykonywania zadań z zakresu działalności"
    )
    czy_odbyte_szkolenia_bhp: bool = Field(
        ...,
        description="Czy odbyte szkolenia BHP dla pracodawców"
    )
    czy_opracowana_ocena_ryzyka: bool = Field(
        ...,
        description="Czy opracowana ocena ryzyka zawodowego"
    )
    srodki_zmniejszajace_ryzyko: Optional[str] = Field(
        None,
        description="Środki stosowane w celu zmniejszenia ryzyka"
    )

    # === STAN W CHWILI WYPADKU ===
    czy_stan_nietrzezwosci: bool = Field(
        ...,
        description="Czy w chwili wypadku w stanie nietrzeźwości"
    )
    czy_pod_wplywem_srodkow: bool = Field(
        ...,
        description="Czy pod wpływem środków odurzających lub psychotropowych"
    )
    czy_badany_stan_trzeźwosci: bool = Field(
        ...,
        description="Czy w dniu wypadku badany stan trzeźwości"
    )
    przez_kogo_badany: Optional[str] = Field(
        None,
        description="Przez kogo badany stan trzeźwości (np. policja)"
    )

    # === POSTĘPOWANIA WYJAŚNIAJĄCE ===
    czy_prowadzone_postepowania: bool = Field(
        ...,
        description="Czy podjęte czynności wyjaśniające przez organy kontroli"
    )
    postepowania: Optional[List[PostepowanieOrganow]] = Field(
        None,
        description="Lista postępowań prowadzonych przez różne organy"
    )

    # === POMOC MEDYCZNA ===
    pomoc_medyczna: PomocMedyczna = Field(..., description="Informacje o udzielonej pomocy medycznej")

    # === ZWOLNIENIE LEKARSKIE ===
    czy_na_zwolnieniu_w_dniu_wypadku: bool = Field(
        ...,
        description="Czy w dniu wypadku przebywał na zwolnieniu lekarskim"
    )

    swiadkowie: Optional[List[Swiadek]] = Field(
        None,
        description="Lista świadków wypadku (jeśli dotyczy)"
    )

    @field_validator('godzina_rozpoczecia_pracy', 'godzina_zakonczenia_pracy', 'godzina_wypadku')
    def waliduj_godziny(cls, v):
        if v is None:
            raise ValueError('Godzina nie może być pusta')
        return v

    @field_validator('data_wypadku')
    def waliduj_date_wypadku(cls, v):
        if v > date.today():
            raise ValueError('Data wypadku nie może być z przyszłości')
        return v