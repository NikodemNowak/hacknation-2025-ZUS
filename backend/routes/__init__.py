from routes.poszkodowany import router as poszkodowani_router
from routes.adres import router as adres_router
from routes.event_description_routes import router as event_description_router

__all__ = ["poszkodowani_router", "adres_router", "event_description_router"]
