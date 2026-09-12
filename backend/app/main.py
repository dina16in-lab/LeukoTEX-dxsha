import logging
import time
import uuid
from contextlib import asynccontextmanager
from fastapi import FastAPI, Request, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from starlette.exceptions import HTTPException as StarletteHTTPException
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.api.router import api_router
from app.middleware.security_headers import SecurityHeadersMiddleware

# Configure Logging
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s [%(levelname)s] %(name)s: %(message)s"
)
logger = logging.getLogger("leukotex")


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Application lifespan context: initialize database schema & run seeders."""
    logger.info("Initializing database schema...")
    Base.metadata.create_all(bind=engine)

    # Run Seeding
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

    logger.info("LEUKOTEX Studio Backend is ready.")
    yield
    logger.info("Shutting down LEUKOTEX Studio Backend...")


app = FastAPI(
    title=settings.PROJECT_NAME,
    version="1.0.0",
    description="High-performance backend API for LEUKOTEX Immersive Creative Studio.",
    lifespan=lifespan,
    docs_url="/docs",
    redoc_url="/redoc",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
)

# ── Security Headers (outermost — applied last, executed first) ──
app.add_middleware(SecurityHeadersMiddleware)

# ── GZip compression for JSON responses > 1KB ──
app.add_middleware(GZipMiddleware, minimum_size=1000)

# ── CORS ──
# SECURITY: allow_credentials=True requires explicit origins, never wildcard.
# Validate at startup — fallback to explicit localhost if misconfigured.
_cors_origins = settings.CORS_ORIGINS
if "*" in _cors_origins and len(_cors_origins) == 1:
    logger.warning("CORS configured with wildcard '*' and credentials — restricting to localhost origins for safety.")
    _cors_origins = ["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=_cors_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allow_headers=["Authorization", "Content-Type", "Accept", "X-Request-ID"],
)


# ── Request ID + Structured Access Log Middleware ──
@app.middleware("http")
async def add_request_id_and_log(request: Request, call_next):
    request_id = request.headers.get("x-request-id", str(uuid.uuid4())[:8])
    start = time.monotonic()
    response = await call_next(request)
    duration_ms = int((time.monotonic() - start) * 1000)
    response.headers["X-Request-ID"] = request_id
    # Structured access log (avoid logging auth headers)
    logger.info(
        "%s %s -> %d (%dms) [req:%s]",
        request.method,
        request.url.path,
        response.status_code,
        duration_ms,
        request_id,
    )
    return response


# ── Global Exception Handlers ──
@app.exception_handler(StarletteHTTPException)
async def http_exception_handler(request: Request, exc: StarletteHTTPException):
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "detail": exc.detail,
            "status_code": exc.status_code,
            "path": str(request.url.path),
        },
        headers=getattr(exc, "headers", None),
    )


@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Normalize Pydantic validation errors for frontend consumption
    errors = exc.errors()
    # Log validation failures at INFO (client error, not server error)
    logger.info("Validation failed for %s %s: %s", request.method, request.url.path, errors)
    return JSONResponse(
        status_code=status.HTTP_422_UNPROCESSABLE_CONTENT if hasattr(status, "HTTP_422_UNPROCESSABLE_CONTENT") else 422,
        content={
            "detail": "Validation failed",
            "errors": [
                {"field": ".".join(str(x) for x in e["loc"]), "message": e["msg"], "type": e["type"]}
                for e in errors
            ],
            "status_code": 422,
        },
    )


@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    logger.exception("Unhandled exception for %s %s: %s", request.method, request.url.path, exc)
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={
            "detail": "Internal server error. Our team has been notified.",
            "status_code": 500,
        },
    )


# Include Main API Router
app.include_router(api_router, prefix=settings.API_V1_STR)


@app.get("/", tags=["System"])
def root():
    return {
        "studio": "LEUKOTEX Creative Development Studio",
        "system": "FastAPI + PostgreSQL + SQLAlchemy",
        "docs": "/docs",
        "redoc": "/redoc",
        "api_v1": settings.API_V1_STR,
        "health": f"{settings.API_V1_STR}/health",
    }


@app.get("/health", tags=["System"], include_in_schema=False)
def root_health():
    """Simple liveness probe (no DB check) — for load balancer."""
    return {"status": "ok"}
