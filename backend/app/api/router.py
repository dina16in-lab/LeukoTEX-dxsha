from fastapi import APIRouter
from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.projects import router as projects_router
from app.api.endpoints.inquiries import router as inquiries_router
from app.api.endpoints.services import router as services_router
from app.api.endpoints.admin import router as admin_router

api_router = APIRouter()

# Health check — includes lightweight DB probe
@api_router.get("/health", tags=["System"])
def health_check():
    from app.database import engine
    from sqlalchemy import text
    db_status = "unknown"
    try:
        with engine.connect() as conn:
            conn.execute(text("SELECT 1"))
        db_status = "connected"
    except Exception:
        db_status = "disconnected"
    return {
        "status": "healthy" if db_status == "connected" else "degraded",
        "service": "LEUKOTEX Studio API",
        "version": "1.0.0",
        "database": db_status,
        "dialect": engine.dialect.name,
    }

api_router.include_router(auth_router)
api_router.include_router(projects_router)
api_router.include_router(inquiries_router)
api_router.include_router(services_router)
api_router.include_router(admin_router)
