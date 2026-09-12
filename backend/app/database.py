import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
from app.config import settings

logger = logging.getLogger("leukotex.database")

DATABASE_URL = settings.DATABASE_URL

if not DATABASE_URL:
    raise RuntimeError(
        "DATABASE_URL is not configured. PostgreSQL 18 is required. "
        "Please provide a valid DATABASE_URL in backend/.env"
    )

if not DATABASE_URL.startswith("postgresql://") and not DATABASE_URL.startswith("postgresql+psycopg2://"):
    raise RuntimeError(
        f"Invalid database scheme in DATABASE_URL: '{DATABASE_URL}'. "
        "LEUKOTEX strictly requires PostgreSQL (postgresql://...). SQLite fallback has been disabled."
    )

def _redact_db_url(url: str) -> str:
    """Redact password from DB URL for safe logging."""
    try:
        from urllib.parse import urlparse, urlunparse
        parsed = urlparse(url)
        if parsed.password:
            netloc = parsed.netloc.replace(parsed.password, "***", 1)
            return urlunparse(parsed._replace(netloc=netloc))
        return url
    except Exception:
        return "***redacted***"


try:
    engine = create_engine(
        DATABASE_URL,
        pool_pre_ping=True,
        pool_size=10,
        max_overflow=20,
        connect_args={"connect_timeout": 5}
    )
    # Validate connection immediately
    with engine.connect() as conn:
        logger.info("Successfully established connection to PostgreSQL 18 database (%s).", engine.dialect.name)
except Exception as e:
    redacted = _redact_db_url(DATABASE_URL)
    logger.error(
        "CRITICAL: Failed to connect to PostgreSQL 18 database at '%s'. Error: %s. Fallback to SQLite is disabled.",
        redacted, e
    )
    raise RuntimeError(
        f"Failed to connect to PostgreSQL 18 database. Error: {e}. "
        "Please verify that the PostgreSQL 18 service is running and credentials in backend/.env are correct."
    ) from e

SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
