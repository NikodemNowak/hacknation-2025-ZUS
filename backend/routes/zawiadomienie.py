from fastapi import APIRouter, HTTPException, status
from backend.models.ZawiadomienieOWypadku import ZawiadomienieOWypadku
from backend.database.db import zawiadomienia_db

router = APIRouter(
    prefix="/zawiadomienia",
    tags=["zawiadomienia"]
)


def _convert_dates_to_strings(zawiadomienie_dict: dict) -> dict:
    """Pomocnicza funkcja do konwersji dat na stringi"""
    zawiadomienie_dict["data_utworzenia"] = str(zawiadomienie_dict["data_utworzenia"])
    zawiadomienie_dict["data_wypadku"] = str(zawiadomienie_dict["data_wypadku"])
    zawiadomienie_dict["godzina_wypadku"] = str(zawiadomienie_dict["godzina_wypadku"])
    zawiadomienie_dict["planowana_godzina_rozpoczecia"] = str(zawiadomienie_dict["planowana_godzina_rozpoczecia"])
    zawiadomienie_dict["planowana_godzina_zakonczenia"] = str(zawiadomienie_dict["planowana_godzina_zakonczenia"])
    zawiadomienie_dict["poszkodowany"]["data_urodzenia"] = str(zawiadomienie_dict["poszkodowany"]["data_urodzenia"])

    if zawiadomienie_dict.get("pelnomocnik"):
        zawiadomienie_dict["pelnomocnik"]["data_urodzenia"] = str(
            zawiadomienie_dict["pelnomocnik"]["data_urodzenia"])

    return zawiadomienie_dict


@router.post("/", status_code=status.HTTP_201_CREATED)
async def utworz_zawiadomienie(zawiadomienie: ZawiadomienieOWypadku):
    """
    Tworzy nowe Zawiadomienie o wypadku przy pracy.
    """
    try:
        zawiadomienie_dict = zawiadomienie.model_dump()
        zawiadomienie_dict = _convert_dates_to_strings(zawiadomienie_dict)

        # Dodaj ID (indeks w tablicy)
        zawiadomienie_dict["id"] = len(zawiadomienia_db)
        zawiadomienia_db.append(zawiadomienie_dict)

        return {
            "status": "success",
            "data": zawiadomienie_dict
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd serwera: {str(e)}")


@router.get("/")
async def pobierz_zawiadomienia():
    """
    Pobiera listę wszystkich zawiadomień.
    """
    return {
        "status": "success",
        "count": len(zawiadomienia_db),
        "data": zawiadomienia_db
    }


@router.get("/{id}")
async def pobierz_zawiadomienie(id: int):
    """
    Pobiera zawiadomienie po ID.
    """
    if 0 <= id < len(zawiadomienia_db):
        return {
            "status": "success",
            "data": zawiadomienia_db[id]
        }

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Zawiadomienie o ID {id} nie zostało znalezione"
    )


@router.get("/poszkodowany/{pesel}")
async def pobierz_zawiadomienia_poszkodowanego(pesel: str):
    """
    Pobiera zawiadomienia dotyczące konkretnego poszkodowanego (po PESEL).
    """
    wyniki = [
        z for z in zawiadomienia_db
        if z["poszkodowany"]["pesel"] == pesel
    ]

    return {
        "status": "success",
        "count": len(wyniki),
        "data": wyniki
    }


@router.put("/{id}")
async def aktualizuj_zawiadomienie(id: int, zawiadomienie: ZawiadomienieOWypadku):
    """
    Aktualizuje istniejące zawiadomienie o wypadku.
    """
    try:
        if 0 <= id < len(zawiadomienia_db):
            zawiadomienie_dict = zawiadomienie.model_dump()
            zawiadomienie_dict = _convert_dates_to_strings(zawiadomienie_dict)
            zawiadomienie_dict["id"] = id

            zawiadomienia_db[id] = zawiadomienie_dict

            return {
                "status": "success",
                "message": "Zawiadomienie zostało zaktualizowane",
                "data": zawiadomienie_dict
            }

        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Zawiadomienie o ID {id} nie zostało znalezione"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Błąd podczas aktualizacji zawiadomienia: {str(e)}"
        )


@router.delete("/{id}")
async def usun_zawiadomienie(id: int):
    """
    Usuwa zawiadomienie po ID.
    """
    if 0 <= id < len(zawiadomienia_db):
        usuniete = zawiadomienia_db.pop(id)

        for i in range(id, len(zawiadomienia_db)):
            zawiadomienia_db[i]["id"] = i

        return {
            "status": "success",
            "message": f"Zawiadomienie o ID {id} zostało usunięte",
            "data": usuniete
        }

    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Zawiadomienie o ID {id} nie zostało znalezione"
    )