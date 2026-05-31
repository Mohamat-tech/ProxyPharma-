from pydantic_settings import BaseSettings
from functools import lru_cache


class Settings(BaseSettings):
    # App
    app_name: str = "ProxyPharma API"
    app_version: str = "1.0.0"
    app_env: str = "development"
    frontend_url: str = "http://localhost:3000"

    # Database
    database_url: str

    # Security
    secret_key: str
    algorithm: str = "HS256"
    access_token_expire_minutes: int = 1440

    # Redis
    redis_url: str = "redis://localhost:6379"

    # Storage S3/R2
    s3_endpoint: str = ""
    s3_bucket: str = "proxypharma-ordonnances"
    s3_access_key_id: str = ""
    s3_secret_access_key: str = ""

    # Mobile Money
    orange_money_api_key: str = ""
    orange_money_client_id: str = ""
    orange_money_client_secret: str = ""
    mtn_momo_api_key: str = ""
    mtn_momo_client_id: str = ""
    mtn_momo_client_secret: str = ""

    # Notifications
    fcm_server_key: str = ""
    twilio_account_sid: str = ""
    twilio_auth_token: str = ""
    twilio_phone: str = ""

    class Config:
        env_file = ".env"


@lru_cache()
def get_settings() -> Settings:
    return Settings()


settings = get_settings()
