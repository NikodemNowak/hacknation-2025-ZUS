from .poszkodowany import router as poszkodowani_router
from .adres import router as adres_router  # Zmiana importu na 'router'

__all__ = ["poszkodowani_router", "adres_router"]