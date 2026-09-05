from fastapi import APIRouter
from app.api.endpoints.auth import router as auth_router
from app.api.endpoints.projects import router as projects_router
from app.api.endpoints.inquiries import router as inquiries_router
from app.api.endpoints.services import router as services_router
from app.api.endpoints.admin import router as admin_router

api_router = APIRouter()

# Health check
@api_router.get("/health", tags=["System"])
def health_check():
    return {
        "status": "healthy",
        "service": "LEUKOTEX Studio API",
        "version": "1.0.0"
    }

api_router.include_router(auth_router)
api_router.include_router(projects_router)
api_router.include_router(inquiries_router)
api_router.include_router(services_router)
api_router.include_router(admin_router)
