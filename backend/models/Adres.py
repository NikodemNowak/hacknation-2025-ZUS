from pydantic import BaseModel, Field, model_validator
from typing import ClassVar, Dict
import re


class Adres(BaseModel):
    ulica: str = Field(..., description="Ulica do adresu")
    nr_domu: str = Field(..., description="Numer domu do adresu")
    kod_pocztowy: str = Field(..., description="Kod pocztowy")
    miejscowosc: str = Field(..., description="Miejscowość")
    panstwo: str = Field(..., description="Państwo")

    WZORCE_KODOW: ClassVar[Dict[str, str]] = {
        "Polska": r'^\d{2}-\d{3}$',
        "Niemcy": r'^\d{5}$',
        "USA": r'^\d{5}(-\d{4})?$',
        "Wielka Brytania": r'^[A-Z]{1,2}\d{1,2}[A-Z]?\s?\d[A-Z]{2}$',
        "Francja": r'^\d{5}$',
        "Kanada": r'^[A-Z]\d[A-Z]\s?\d[A-Z]\d$',
        "Czechy": r'^\d{3}\s?\d{2}$',
        "Włochy": r'^\d{5}$',
    }

    @model_validator(mode='after')
    def waliduj_kod_pocztowy_dla_panstwa(self):
        panstwo = self.panstwo
        kod = self.kod_pocztowy

        if panstwo in self.WZORCE_KODOW:
            wzorzec = self.WZORCE_KODOW[panstwo]
            if not re.match(wzorzec, kod, re.IGNORECASE):
                raise ValueError(
                    f'Kod pocztowy "{kod}" jest nieprawidłowy dla kraju {panstwo}. '
                    f'Oczekiwany format: {self._przykladowy_format(panstwo)}'
                )
        else:
            if not re.match(r'^[\w\s-]{3,10}$', kod):
                raise ValueError(
                    f'Kod pocztowy "{kod}" wygląda na nieprawidłowy. '
                    f'Dla kraju {panstwo} nie mamy szczegółowej walidacji.'
                )

        return self

    @staticmethod
    def _przykladowy_format(panstwo: str) -> str:
        przyklady = {
            "Polska": "XX-XXX (np. 00-001)",
            "Niemcy": "XXXXX (np. 10115)",
            "USA": "XXXXX lub XXXXX-XXXX (np. 90210)",
            "Wielka Brytania": "XXX XXX (np. SW1A 1AA)",
            "Francja": "XXXXX (np. 75001)",
            "Kanada": "XXX XXX (np. M5H 2N2)",
            "Czechy": "XXX XX (np. 110 00)",
            "Włochy": "XXXXX (np. 00118)",
        }
        return przyklady.get(panstwo, "sprawdź format dla tego kraju")
