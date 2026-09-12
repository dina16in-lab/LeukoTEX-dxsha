from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.api.endpoints.public_contact import router as public_contact_router


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="Public LEUKOTEX contact API.",
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)


_cors_origins = settings.CORS_ORIGINS

if "*" in _cors_origins and len(_cors_origins) == 1:
    _cors_origins = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ]


app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Request-ID"],
)


app.include_router(
    public_contact_router,
    prefix=settings.API_V1_STR,
)


@app.get("/", tags=["System"])
def root():
    return {
        "studio": "LEUKOTEX Creative Development Studio",
        "service": "Public Contact API",
        "docs": "/docs",
        "health": "/health",
    }


@app.get("/health", tags=["System"])
def health():
    return {
        "status": "ok",
        "service": "LEUKOTEX Public Contact API",
    }