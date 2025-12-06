from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from backend.config import settings
from backend.routes import poszkodowani_router, adres_router, wyjasnienia_router

app = FastAPI(
    title=settings.app_name,
    description="API do zarządzania danymi poszkodowanych",
    version=settings.app_version
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.cors_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(poszkodowani_router, prefix=settings.api_prefix)
app.include_router(adres_router, prefix=settings.api_prefix)
app.include_router(wyjasnienia_router, prefix=settings.api_prefix)


@app.get("/")
async def root():
    return {
        "message": "API działa poprawnie",
        "version": settings.app_version,
        "endpoints": {
            "docs": "/docs",
            "poszkodowani": f"{settings.api_prefix}/poszkodowani",
            "adresy": f"{settings.api_prefix}/adresy"
        }
    }

if __name__ == "__main__":
    print(f"Uruchamianie {settings.app_name}...")
    print(f"Dokumentacja: http://localhost:{settings.port}/docs")
    print(f"API endpoint: http://localhost:{settings.port}{settings.api_prefix}/poszkodowani/")

    uvicorn.run("backend.main:app", host=settings.host, port=settings.port, reload=True)