from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", extra="ignore")

    app_name: str = "Core AI Hub API"
    api_prefix: str = "/api"
    database_url: str = "sqlite:///./core_ai_hub.db"
    jwt_secret: str = "change-me-in-production"
    jwt_algorithm: str = "HS256"
    access_token_minutes: int = 30
    refresh_token_minutes: int = 60 * 24 * 7
    encryption_key: str = "dev-encryption-key"
    openai_api_key: str | None = None
    openai_model: str = "gpt-4o-mini"
    webhook_base_url: str = "http://localhost:8000"
    frontend_url: str = "https://app.seudominio.com"
    meta_app_secret: str = "change-me-meta-secret"


settings = Settings()
