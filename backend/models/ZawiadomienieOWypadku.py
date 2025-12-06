from pydantic import BaseModel, Field, model_validator, field_validator
from typing import Optional, List
from datetime import date, time

from .Adres import Adres
from .Dzialalnosc import Dzialalnosc
from .Poszkodowany import Poszkodowany
from .Swiadek import Swiadek
from .PostepowanieOrganow import PostepowanieOrganow


class Pelnomocnik(BaseModel):
    """
    Dane pełnomocnika zgłaszającego wypadek (jeśli dotyczy).
    """
    pesel: Optional[str] = Field(None, description="PESEL pełnomocnika (jeśli nadany)")
    rodzaj_dokumentu: str = Field(..., description="Rodzaj dokumentu tożsamości")
    seria_numer_dokumentu: str = Field(..., description="Seria i numer dokumentu")
    imie: str = Field(..., min_length=2, description="Imię pełnomocnika")
    nazwisko: str = Field(..., min_length=2, description="Nazwisko pełnomocnika")
    data_urodzenia: date = Field(..., description="Data urodzenia")
    numer_telefonu: Optional[str] = Field(None, description="Numer telefonu do kontaktu")

    adres_zamieszkania: Adres = Field(..., description="Adres zamieszkania pełnomocnika")
    adres_koresponcencyjny: Optional[Adres] = Field(None, description="Adres do korespondencji (jeśli inny)")


class ZawiadomienieOWypadku(BaseModel):
    """
    Główny model reprezentujący Zawiadomienie o wypadku przy pracy.
    """

    # === DANE IDENTYFIKACYJNE ===
    data_utworzenia: date = Field(default_factory=date.today, description="Data sporządzenia zawiadomienia")

    # === STRONY ZGŁOSZENIA ===
    platnik_skladek: Dzialalnosc = Field(..., description="Dane osoby prowadzonej działalność (Płatnika)")
    poszkodowany: Poszkodowany = Field(..., description="Dane osoby poszkodowanej")

    czy_zglasza_pelnomocnik: bool = Field(False, description="Czy zgłoszenia dokonuje pełnomocnik?")
    pelnomocnik: Optional[Pelnomocnik] = Field(None,
                                               description="Dane pełnomocnika (wymagane jeśli czy_zglasza_pelnomocnik=True)")

    # === INFORMACJE O WYPADKU ===
    data_wypadku: date = Field(..., description="Data zdarzenia")
    godzina_wypadku: time = Field(..., description="Godzina zdarzenia")
    miejsce_wypadku: str = Field(..., description="Dokładny opis miejsca wypadku (adres, lokalizacja wewnątrz)")

    planowana_godzina_rozpoczecia: time = Field(..., description="Godzina planowanego rozpoczęcia pracy w dniu wypadku")
    planowana_godzina_zakonczenia: time = Field(..., description="Godzina planowanego zakończenia pracy w dniu wypadku")

    # === OKOLICZNOŚCI I PRZYCZYNY ===
    rodzaj_urazow: str = Field(..., description="Opis urazów jakich doznał poszkodowany (skutek)")

    opis_okolicznosci: str = Field(
        ...,
        min_length=20,
        description="Szczegółowy opis w jakich okolicznościach doszło do wypadku (sekwencja zdarzeń)"
    )

    przyczyna_zewnetrzna: str = Field(
        ...,
        description="Wskazanie przyczyny zewnętrznej (czynnik sprawczy spoza organizmu, np. maszyna, śliska nawierzchnia)"
    )

    czy_naglosc: bool = Field(
        ...,
        description="Czy zdarzenie miało charakter nagły (trwało nie dłużej niż dniówkę roboczą)?"
    )

    zwiazek_z_praca: str = Field(
        ...,
        description="Opis związku z prowadzoną działalnością (jakie czynności wykonywano w momencie wypadku)"
    )

    # === DODATKOWE INFORMACJE ===
    swiadkowie: Optional[List[Swiadek]] = Field(None, description="Lista świadków zdarzenia")

    czy_udzielono_pomocy: bool = Field(..., description="Czy udzielono pierwszej pomocy?")
    placowka_medyczna: Optional[str] = Field(None,
                                             description="Nazwa i adres placówki medycznej, jeśli udzielono pomocy")

    czy_powiadomiono_sluzby: bool = Field(..., description="Czy powiadomiono policję/prokuraturę?")
    postepowania: Optional[List[PostepowanieOrganow]] = Field(
        None,
        description="Opis podjętych postępowań przez organy (jeśli dotyczy)"
    )

    @model_validator(mode='after')
    def sprawdz_pelnomocnika(self):
        if self.czy_zglasza_pelnomocnik and not self.pelnomocnik:
            raise ValueError("Zaznaczono zgłoszenie przez pełnomocnika, ale nie podano jego danych.")
        return self

    @field_validator('data_wypadku')
    def waliduj_date_wypadku(cls, v):
        if v > date.today():
            raise ValueError("Data wypadku nie może być z przyszłości.")
        return v