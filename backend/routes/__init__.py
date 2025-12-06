# ========== routers/__init__.py ==========
from .poszkodowany import router as poszkodowani_router
from .adres import router as adres_router
from .dzialalnosc import router as dzialalnosc_router
from .wyjasnienia import router as wyjasnienia_router
from .zawiadomienie import router as zawiadomienie_router
from .event_description_routes import router as event_description_router

__all__ = [
    "poszkodowani_router",
    "adres_router",
    "dzialalnosc_router",
    "wyjasnienia_router",
    "zawiadomienie_router",
    "event_description_router"
]