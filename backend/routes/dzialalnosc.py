from fastapi import APIRouter, HTTPException, status
from database.db import dzialalnosci_db
from models.Dzialalnosc import Dzialalnosc
from typing import List

router = APIRouter(
    prefix="/dzialanosci",
    tags=["dzialalnosci"]
)


@router.get("/")
async def pobierz_dzialanosci():
    """
    Pobiera listę wszystkich działalności gospodarczych.
    """
    return {
        "status": "success",
        "count": len(dzialalnosci_db),
        "data": dzialalnosci_db
    }


@router.get("/{nip_regon}")
async def pobierz_dzialalnosc(nip_regon: str):
    """
    Pobiera szczegóły działalności gospodarczej po NIP lub REGON.
    """
    # Normalizacja NIP/REGON (usuń myślniki i spacje)
    nip_regon_clean = nip_regon.replace("-", "").replace(" ", "")

    for dzialalnosc in dzialalnosci_db:
        if dzialalnosc["nip_regon"] == nip_regon_clean:
            return {
                "status": "success",
                "data": dzialalnosc
            }

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Nie znaleziono działalności o NIP/REGON: {nip_regon}"
    )


@router.post("/", status_code=status.HTTP_201_CREATED)
async def utworz_dzialalnosc(dzialalnosc: Dzialalnosc):
    """
    Tworzy nową działalność gospodarczą.
    """
    # Sprawdź czy działalność o takim NIP/REGON już istnieje
    for existing in dzialalnosci_db:
        if existing["nip_regon"] == dzialalnosc.nip_regon:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail=f"Działalność o NIP/REGON {dzialalnosc.nip_regon} już istnieje"
            )

    # Dodaj do bazy
    dzialalnosc_dict = dzialalnosc.model_dump()
    dzialalnosci_db.append(dzialalnosc_dict)

    return {
        "status": "success",
        "message": "Działalność została utworzona",
        "data": dzialalnosc_dict
    }


@router.put("/{nip_regon}")
async def aktualizuj_dzialalnosc(nip_regon: str, dzialalnosc: Dzialalnosc):
    """
    Aktualizuje dane działalności gospodarczej.
    """
    nip_regon_clean = nip_regon.replace("-", "").replace(" ", "")

    for i, existing in enumerate(dzialalnosci_db):
        if existing["nip_regon"] == nip_regon_clean:
            # Aktualizuj dane
            dzialalnosc_dict = dzialalnosc.model_dump()
            dzialalnosci_db[i] = dzialalnosc_dict

            return {
                "status": "success",
                "message": "Działalność została zaktualizowana",
                "data": dzialalnosc_dict
            }

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Nie znaleziono działalności o NIP/REGON: {nip_regon}"
    )


@router.delete("/{nip_regon}")
async def usun_dzialalnosc(nip_regon: str):
    """
    Usuwa działalność gospodarczą.
    """
    nip_regon_clean = nip_regon.replace("-", "").replace(" ", "")

    for i, existing in enumerate(dzialalnosci_db):
        if existing["nip_regon"] == nip_regon_clean:
            usunięta = dzialalnosci_db.pop(i)

            return {
                "status": "success",
                "message": "Działalność została usunięta",
                "data": usunięta
            }

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Nie znaleziono działalności o NIP/REGON: {nip_regon}"
    )


@router.get("/kod-pkd/{kod_pkd}")
async def pobierz_dzialalnosci_po_pkd(kod_pkd: str):
    """
    Pobiera działalności o określonym kodzie PKD.
    """
    wyniki = [
        d for d in dzialalnosci_db
        if d.get("kod_pkd", "").startswith(kod_pkd)
    ]

    return {
        "status": "success",
        "count": len(wyniki),
        "data": wyniki
    }