from pydantic_settings import BaseSettings
from pathlib import Path


class Settings(BaseSettings):
    app_name: str = "System ZUS"
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

    # LLM Configuration
    groq_api_key: str = ""

    model_config = {
        "env_file": str(Path(__file__).parent / ".env"),
        "env_file_encoding": "utf-8",
        "extra": "ignore",
    }


settings = Settings()

# Debug - sprawdzenie czy klucz API został załadowany
if settings.groq_api_key:
    print(f"✅ Klucz API GROQ załadowany: {settings.groq_api_key[:10]}...")
else:
    print("⚠️ Brak klucza API GROQ w konfiguracji")

