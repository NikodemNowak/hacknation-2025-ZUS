from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import date
import re


class Adres(BaseModel):
    ulica: str = Field(..., description="Ulica do adresu")
    nr_domu: str = Field(..., description="Numer domu do adresu")
    kod_pocztowy: str = Field(..., description="Kod pocztowy")
    miejscowosc: str = Field(..., description="Miejscowość")
    panstwo: str = Field(..., description="Państwo")
    
