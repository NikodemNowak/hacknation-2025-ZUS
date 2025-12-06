# ========== STRUKTURA PROJEKTU ==========
#
# backend/
# ├── main.py                 # Punkt wejścia aplikacji
# ├── config.py              # Konfiguracja aplikacji
# ├── models/
# │   ├── __init__.py
# │   └── poszkodowany.py    # Model Poszkodowany
# ├── routes/
# │   ├── __init__.py
# │   └── poszkodowani.py    # Endpointy dla poszkodowanych
# └── database/
#     ├── __init__.py
#     └── db.py              # Połączenie z bazą danych


# ========== config.py ==========
from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    app_name: str = "System Wyjaśnień Poszkodowanych"
    app_version: str = "1.0.0"
    api_prefix: str = "/api"
    host: str = "0.0.0.0"
    port: int = 8000

    # CORS
    cors_origins: list = [
        "http://localhost:3000",
        "http://localhost:5173",
        "http://127.0.0.1:3000",
        "http://127.0.0.1:5173"
    ]

    model_config = {
        "env_file": ".env",
        "extra": "ignore",
    }


settings = Settings()
