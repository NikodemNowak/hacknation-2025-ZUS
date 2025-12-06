from pydantic import BaseModel, Field
from typing import Optional
from uuid import uuid4

from .ZapisWyjasnienPoszkodowanego import ZapisWyjasnienPoszkodowanego
from .ZawiadomienieOWypadku import ZawiadomienieOWypadku
from .Poszkodowany import Poszkodowany


class Case(BaseModel):
    id: str = Field(default_factory=lambda: str(uuid4()), description="Unikalny identyfikator sprawy")

    wyjasnienia: Optional[ZapisWyjasnienPoszkodowanego] = Field(None, description="Wyjaśnienia poszkodowanego")
    zawiadomienie: Optional[ZawiadomienieOWypadku] = Field(None, description="Zawiadomienie o wypadku")
    poszkodowany: Optional[Poszkodowany] = Field(None, description="Dane poszkodowanego")

    status: str = Field(default="W trakcie", description="Status sprawy ('Wysłano'|'W trakcie'|'Zamknięto')")
    data_utworzenia: str = Field(..., description="Data utworzenia sprawy")