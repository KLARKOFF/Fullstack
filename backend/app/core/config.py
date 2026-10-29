from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict

class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8")

    app_name: str = "Dryers & Washers API"
    database_url: str
    secret_key: str
    access_token_expire_minutes: int = 60
    cors_origins: list[str] = ["http://localhost:5173"]

    # должна совпадать с frontend/src/utils/time.ts)
    timezone: str = "Europe/Moscow"
    slot_minutes: int = 60
    first_slot_hour: int = 8
    last_slot_hour: int = 22
    booking_days_ahead: int = 6

@lru_cache
def get_settings() -> Settings:
    return Settings()

settings = get_settings()