from pydantic import BaseModel, Field
from typing import Optional

from .Adres import Adres

class Swiadek(BaseModel):
    imie: str = Field(..., min_length=2, description="Imię świadka")
    nazwisko: str = Field(..., min_length=2, description="Nazwisko świadka")
    adres_zamieszkania: Adres = Field(..., description="Adres zamieszkania świadka")