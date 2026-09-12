import os
from typing import List, Union

from pydantic import field_validator
from pydantic_settings import BaseSettings, SettingsConfigDict


# backend/.env is located next to this config file's parent directory.
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
ENV_FILE = os.path.join(BASE_DIR, ".env")


class Settings(BaseSettings):
    PROJECT_NAME: str = "LEUKOTEX Studio API"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True
    API_V1_STR: str = "/api"

    # PostgreSQL Database Configuration
    DATABASE_URL: str = "postgresql://postgres:postgres@localhost:5432/leukotex_db"

    # Security & JWT Token
    SECRET_KEY: str = (
        "leukotex-super-secret-jwt-signing-key-for-development-change-in-production"
    )
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24

    # CORS
    CORS_ORIGINS: Union[List[str], str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

    # Resend Email Notification Settings
    RESEND_API_KEY: str = ""
    EMAIL_FROM: str = "LEUKOTEX Inquiries <onboarding@resend.dev>"
    EMAIL_TO: str = "dina16in@gmail.com"

    # Rate limiting
    RATE_LIMIT_CONTACT_PER_MINUTE: int = 5
    RATE_LIMIT_CONTACT_PER_HOUR: int = 20
    RATE_LIMIT_AUTH_PER_MINUTE: int = 10

    @field_validator("CORS_ORIGINS", mode="before")
    @classmethod
    def assemble_cors_origins(
        cls,
        v: Union[str, List[str]],
    ) -> List[str]:
        if isinstance(v, str) and not v.startswith("["):
            parsed = [i.strip() for i in v.split(",") if i.strip()]

            # Never allow wildcard with credentials.
            if "*" in parsed:
                return [
                    o for o in parsed if o != "*"
                ] or ["http://localhost:5173"]

            return parsed

        elif isinstance(v, list):
            # Filter wildcard from list as well.
            if "*" in v:
                filtered = [o for o in v if o != "*"]
                return filtered or ["http://localhost:5173"]

            return v

        return ["http://localhost:5173"]

    @field_validator("SECRET_KEY")
    @classmethod
    def validate_secret_key(cls, v: str) -> str:
        if len(v) < 32:
            import warnings

            warnings.warn(
                "SECRET_KEY is shorter than 32 characters — insecure for production."
            )

        return v

    model_config = SettingsConfigDict(
        env_file=ENV_FILE,
        env_file_encoding="utf-8",
        extra="ignore",
    )


settings = Settings()