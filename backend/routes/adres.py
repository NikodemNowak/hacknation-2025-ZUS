from fastapi import APIRouter
from backend.database.db import poszkodowani_db

router = APIRouter(
    prefix="/adresy",
    tags=["adresy"]
)


@router.get("/")
async def pobierz_adresy():
    """
    Pobiera listę wszystkich adresów przypisanych do poszkodowanych.
    """
    adresy = []
    for poszkodowany in poszkodowani_db:
        if "adres_zamieszkania" in poszkodowany:
            adresy.append({
                "poszkodowany_pesel": poszkodowany["pesel"],
                "adres": poszkodowany["adres_zamieszkania"]
            })

    return {
        "status": "success",
        "count": len(adresy),
        "data": adresy
    }