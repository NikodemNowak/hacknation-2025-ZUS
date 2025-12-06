from fastapi import APIRouter, HTTPException
from backend.models.ZapisWyjasnienPoszkodowanego import ZapisWyjasnienPoszkodowanego
from backend.database.db import wyjasnienia_db

router = APIRouter(
    prefix="/wyjasnienia",
    tags=["wyjasnienia"]
)


@router.post("/", status_code=201)
async def dodaj_wyjasnienie(wyjasnienie: ZapisWyjasnienPoszkodowanego):
    """
    Dodaje nowy zapis wyjaśnień poszkodowanego.
    """
    try:
        # Konwersja modelu do słownika
        wyjasnienie_dict = wyjasnienie.model_dump()

        # FastAPI/Pydantic automatycznie serializuje daty do ISO w odpowiedzi JSON,
        # ale jeśli potrzebujesz zapisać je jako stringi w swojej "bazie":

        wyjasnienie_dict["data_wypadku"] = str(wyjasnienie_dict["data_wypadku"])
        wyjasnienie_dict["godzina_wypadku"] = str(wyjasnienie_dict["godzina_wypadku"])

        wyjasnienie_dict["godzina_rozpoczecia_pracy"] = str(wyjasnienie_dict["godzina_rozpoczecia_pracy"])
        wyjasnienie_dict["godzina_zakonczenia_pracy"] = str(wyjasnienie_dict["godzina_zakonczenia_pracy"])

        # Obsługa zagnieżdżonych modeli
        wyjasnienie_dict["poszkodowany"]["data_urodzenia"] = str(wyjasnienie_dict["poszkodowany"]["data_urodzenia"])

        # Obsługa opcjonalnych pól dat w pod-modelach (np. informacje o maszynie)
        if wyjasnienie_dict.get("informacje_o_maszynie") and wyjasnienie_dict["informacje_o_maszynie"].get(
                "data_produkcji"):
            wyjasnienie_dict["informacje_o_maszynie"]["data_produkcji"] = str(
                wyjasnienie_dict["informacje_o_maszynie"]["data_produkcji"])

        if wyjasnienie_dict.get("pomoc_medyczna") and wyjasnienie_dict["pomoc_medyczna"].get("data_udzielenia"):
            wyjasnienie_dict["pomoc_medyczna"]["data_udzielenia"] = str(
                wyjasnienie_dict["pomoc_medyczna"]["data_udzielenia"])

        # Dodaj ID i zapisz w 'bazie'
        wyjasnienie_dict["id"] = len(wyjasnienia_db)
        wyjasnienia_db.append(wyjasnienie_dict)

        return {"status": "success", "data": wyjasnienie_dict}

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd serwera: {str(e)}")


@router.get("/{pesel}")
async def pobierz_wyjasnienia_poszkodowanego(pesel: str):
    """
    Pobiera wszystkie wyjaśnienia dla danego numeru PESEL.
    """
    wyniki = [
        w for w in wyjasnienia_db
        if w["poszkodowany"]["pesel"] == pesel
    ]

    return {
        "status": "success",
        "count": len(wyniki),
        "data": wyniki
    }