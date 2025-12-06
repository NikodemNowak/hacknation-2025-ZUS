from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date, datetime, time
import re

class InformacjeOMaszynie(BaseModel):
    """Informacje o maszynie/urządzeniu użytym podczas wypadku"""
    nazwa: str = Field(..., description="Nazwa maszyny/narzędzia")
    typ: Optional[str] = Field(None, description="Typ urządzenia")
    data_produkcji: Optional[date] = Field(None, description="Data produkcji")
    czy_sprawne: bool = Field(..., description="Czy urządzenie było sprawne")
    czy_uzywane_zgodnie_z_instrukcja: bool = Field(..., description="Czy użytkowane zgodnie z zasadami producenta")
    opis_sposobu_uzytkowania: Optional[str] = Field(None, description="Opis sposobu użytkowania")
    czy_posiada_atest_deklaracje_zgodnosci: bool = Field(...,
                                                         description="Czy maszyna posiada atest/deklarację zgodności")
    czy_wpisana_do_ewidencji_srodkow_trwalych: bool = Field(...,
                                                            description="Czy wpisana do ewidencji środków trwałych")

    @field_validator('data_produkcji')
    def waliduj_date_produkcji(cls, v):
        if v is None:
            return v
        if v > date.today():
            raise ValueError('Data produkcji nie może być z przyszłości')
        return v
