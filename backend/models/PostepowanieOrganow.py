from pydantic import BaseModel, Field, field_validator
from typing import Optional, List
from datetime import date, datetime, time
import re

class PostepowanieOrganow(BaseModel):
    """Informacje o postępowaniu prowadzonym przez organy kontroli"""
    nazwa_organu: str = Field(..., description="Nazwa organu (np. policja, prokuratura, inspekcja pracy)")
    adres_organu: str = Field(..., description="Adres organu")
    numer_sprawy: Optional[str] = Field(None, description="Numer sprawy/decyzji")
    status_sprawy: str = Field(..., description="Status: zakończona/w trakcie/umorzona")