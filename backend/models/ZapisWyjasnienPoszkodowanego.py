from pydantic import BaseModel, Field, validator
from typing import Optional
from datetime import date
import re

from .Poszkodowany import Poszkodowany


class ZapisWyjasnienPoszkodowanego(BaseModel):
    poszkodowany: Poszkodowany = Field(..., description="Obiekt poszkodowanego")
    wyjasnienia: str = Field(..., description="Zapis wyjaśnień poszkodowanego")
