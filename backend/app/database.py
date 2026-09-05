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
        logger.info("Successfully established connection to PostgreSQL 18 database.")
except Exception as e:
    logger.error(
        f"CRITICAL: Failed to connect to PostgreSQL 18 database at '{DATABASE_URL}'. "
        f"Error details: {e}. Fallback to SQLite is disabled."
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
