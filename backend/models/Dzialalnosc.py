from pydantic import BaseModel, Field, field_validator, model_validator
from typing import Optional
import re

from .Adres import Adres


class Dzialalnosc(BaseModel):
    """
    Klasa reprezentująca dane działalności gospodarczej.
    """
    nip_regon: str = Field(..., description="NIP (10 cyfr) lub REGON (9 lub 14 cyfr)")
    nazwa_firmy: str = Field(..., min_length=2, description="Nazwa firmy/działalności")
    kod_pkd: Optional[str] = Field(None, description="Kod PKD działalności (można pobrać z CEIDG)")
    adres_siedziby: Adres = Field(..., description="Adres siedziby firmy/prowadzenia działalności")
    adres_prowadzenia_dzialalnosci: Optional[Adres] = Field(None, description="Adres prowadzenia działalności (jeśli inny niż siedziba)")
    licencje: Optional[str] = Field(None, description="Opis posiadanych licencji (opcjonalnie)")
    koncesje: Optional[str] = Field(None, description="Opis posiadanych koncesji (opcjonalnie)")
    numer_telefonu: Optional[str] = Field(None, description="Numer telefonu kontaktowego do firmy")

    @field_validator('nip_regon')
    def waliduj_nip_regon(cls, v):
        cleaned = re.sub(r'[\s-]', '', v)
        if re.match(r'^\d{10}$', cleaned):
            return cleaned
        if re.match(r'^\d{9}$', cleaned) or re.match(r'^\d{14}$', cleaned):
            return cleaned
        raise ValueError('NIP musi składać się z 10 cyfr, REGON z 9 lub 14 cyfr')

    @field_validator('numer_telefonu')
    def waliduj_telefon(cls, v):
        if v is None:
            return v
        cleaned = re.sub(r'[^\d+]', '', v)
        if not re.match(r'^\+?\d{9,15}$', cleaned):
            raise ValueError('Numer telefonu jest niepoprawny')
        return cleaned

    @model_validator(mode='after')
    def ensure_nazwa_and_nip(self):
        if not self.nazwa_firmy or not self.nip_regon:
            raise ValueError('Nazwa firmy i NIP/REGON są wymagane')
        return self

    class Config:
        json_schema_extra = {
            "example": {
                "nip_regon": "1234567890",
                "nazwa_firmy": "Firma Budowlana Kowalski",
                "kod_pkd": "43.99.Z",
                "adres_siedziby": {
                    "ulica": "Marszałkowska",
                    "nr_domu": "10/24",
                    "kod_pocztowy": "00-001",
                    "miejscowosc": "Warszawa",
                    "panstwo": "Polska"
                },
                "adres_prowadzenia_dzialalnosci": None,
                "licencje": "Licencja budowlana nr 12345",
                "koncesje": None,
                "numer_telefonu": "+48123456789"
            }
        }
