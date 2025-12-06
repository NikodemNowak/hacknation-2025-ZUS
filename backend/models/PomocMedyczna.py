from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date, datetime, time
import re


class PomocMedyczna(BaseModel):
    """Informacje o udzielonej pomocy medycznej"""
    czy_udzielono: bool = Field(..., description="Czy udzielono pierwszej pomocy")
    data_udzielenia: Optional[date] = Field(None, description="Data udzielenia pierwszej pomocy")
    nazwa_placowki: Optional[str] = Field(None, description="Nazwa placówki ochrony zdrowia")
    okres_hospitalizacji: Optional[str] = Field(None, description="Okres hospitalizacji (np. '3 dni', '2 tygodnie')")
    miejsce_hospitalizacji: Optional[str] = Field(None, description="Miejsce hospitalizacji")
    rozpoznany_uraz: Optional[str] = Field(None, description="Uraz rozpoznany na podstawie dokumentacji lekarskiej")
    okres_niezdolnosci: Optional[str] = Field(None, description="Okres niezdolności do świadczenia pracy")