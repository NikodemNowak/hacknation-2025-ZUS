from fastapi import APIRouter, HTTPException
from backend.models.Poszkodowany import Poszkodowany
from backend.database.db import poszkodowani_db

router = APIRouter(
    prefix="/poszkodowani",
    tags=["poszkodowani"]
)


@router.post("/", status_code=201)
async def zapisz_poszkodowanego(poszkodowany: Poszkodowany):
    """Zapisuje dane nowego poszkodowanego"""
    try:
        for p in poszkodowani_db:
            if p["pesel"] == poszkodowany.pesel:
                raise HTTPException(
                    status_code=400,
                    detail="Poszkodowany z tym numerem PESEL już istnieje"
                )

        poszkodowany_dict = poszkodowany.model_dump()
        poszkodowany_dict["data_urodzenia"] = str(poszkodowany_dict["data_urodzenia"])
        poszkodowani_db.append(poszkodowany_dict)

        return {
            "status": "success",
            "message": "Dane poszkodowanego zostały zapisane",
            "data": poszkodowany_dict
        }
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd serwera: {str(e)}")


@router.get("/")
async def pobierz_wszystkich_poszkodowanych():
    """Pobiera listę wszystkich poszkodowanych"""
    return {
        "status": "success",
        "count": len(poszkodowani_db),
        "data": poszkodowani_db
    }


@router.get("/{pesel}")
async def pobierz_poszkodowanego(pesel: str):
    """Pobiera poszkodowanego po numerze PESEL"""
    for p in poszkodowani_db:
        if p["pesel"] == pesel:
            return {"status": "success", "data": p}

    raise HTTPException(status_code=404, detail="Nie znaleziono poszkodowanego")


@router.put("/{pesel}")
async def aktualizuj_poszkodowanego(pesel: str, poszkodowany: Poszkodowany):
    """Aktualizuje dane poszkodowanego po numerze PESEL"""
    try:
        for i, p in enumerate(poszkodowani_db):
            if p["pesel"] == pesel:
                # Sprawdź czy nowy PESEL nie koliduje z innym rekordem
                if poszkodowany.pesel != pesel:
                    for existing in poszkodowani_db:
                        if existing["pesel"] == poszkodowany.pesel:
                            raise HTTPException(
                                status_code=400,
                                detail=f"Poszkodowany z PESEL {poszkodowany.pesel} już istnieje"
                            )

                # Aktualizuj dane
                poszkodowany_dict = poszkodowany.model_dump()
                poszkodowany_dict["data_urodzenia"] = str(poszkodowany_dict["data_urodzenia"])
                poszkodowani_db[i] = poszkodowany_dict

                return {
                    "status": "success",
                    "message": "Dane poszkodowanego zostały zaktualizowane",
                    "data": poszkodowany_dict
                }

        raise HTTPException(
            status_code=404,
            detail=f"Poszkodowany z PESEL {pesel} nie został znaleziony"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Błąd serwera: {str(e)}")


@router.delete("/{pesel}")
async def usun_poszkodowanego(pesel: str):
    """Usuwa poszkodowanego po numerze PESEL"""
    for i, poszkodowany in enumerate(poszkodowani_db):
        if poszkodowany["pesel"] == pesel:
            poszkodowani_db.pop(i)
            return {
                "status": "success",
                "message": f"Poszkodowany z PESEL {pesel} został usunięty"
            }

    raise HTTPException(
        status_code=404,
        detail=f"Poszkodowany z PESEL {pesel} nie został znaleziony"
    )