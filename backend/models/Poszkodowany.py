from pydantic import BaseModel, Field, field_validator
from datetime import date
import re

from .Adres import Adres


class Poszkodowany(BaseModel):
    """
    Klasa reprezentująca dane poszkodowanego w systemie zgłoszeń.
    """
    pesel: str = Field(..., description="Numer PESEL (11 cyfr)")
    rodzaj_dokumentu: str = Field(..., description="Rodzaj dokumentu tożsamości (np. dowód osobisty, paszport)")
    seria_dokumentu: str = Field(..., description="Seria dokumentu")
    numer_dokumentu: str = Field(..., description="Numer dokumentu")
    imie: str = Field(..., min_length=2, description="Imię poszkodowanego")
    nazwisko: str = Field(..., min_length=2, description="Nazwisko poszkodowanego")
    data_urodzenia: date = Field(..., description="Data urodzenia (YYYY-MM-DD)")
    miejsce_urodzenia: str = Field(..., description="Miejsce urodzenia")
    numer_telefonu: str = Field(..., description="Numer telefonu kontaktowego")
    adres_zamieszkania: Adres = Field(..., description="Adres zamieszkania")

    

    @field_validator('pesel')
    def waliduj_pesel(cls, v):
        """Walidacja numeru PESEL - musi zawierać 11 cyfr"""
        if not re.match(r'^\d{11}$', v):
            raise ValueError('PESEL musi składać się z dokładnie 11 cyfr')
        return v

    @field_validator('numer_telefonu')
    def waliduj_telefon(cls, v):
        """Walidacja numeru telefonu - usuwa spacje i sprawdza format"""
        # Usuń spacje, myślniki i inne znaki
        cleaned = re.sub(r'[\s\-\(\)]', '', v)

        # Sprawdź czy zawiera tylko cyfry i opcjonalnie prefix +
        if not re.match(r'^\+?\d{9,15}$', cleaned):
            raise ValueError('Numer telefonu musi zawierać od 9 do 15 cyfr')
        return cleaned

    @field_validator('rodzaj_dokumentu')
    def waliduj_rodzaj_dokumentu(cls, v):
        """Walidacja rodzaju dokumentu"""
        dozwolone = ['dowód osobisty', 'paszport', 'prawo jazdy', 'karta pobytu']
        if v.lower() not in dozwolone:
            raise ValueError(f'Rodzaj dokumentu musi być jednym z: {", ".join(dozwolone)}')
        return v.lower()

    class Config:
        json_schema_extra = {
            "example": {
                "pesel": "90010112345",
                "rodzaj_dokumentu": "dowód osobisty",
                "seria_dokumentu": "ABC",
                "numer_dokumentu": "123456",
                "imie": "Jan",
                "nazwisko": "Kowalski",
                "data_urodzenia": "1990-01-01",
                "miejsce_urodzenia": "Warszawa",
                "numer_telefonu": "+48123456789",
                "adres_zamieszkania": {
                    "ulica": "Marszałkowska",
                    "nr_domu": "10/24",
                    "kod_pocztowy": "00-001",
                    "miejscowosc": "Warszawa",
                    "panstwo": "Polska"
                }
            }
        }