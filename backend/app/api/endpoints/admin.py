from typing import Dict, Any, List
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db, engine
from app.models.project import Project
from app.models.inquiry import Inquiry
from app.models.service import Service
from app.models.user import User
from app.core.deps import get_current_admin

router = APIRouter(prefix="/admin", tags=["Admin Dashboard"])


@router.get("/overview", response_model=Dict[str, Any])
def get_admin_overview(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Retrieve aggregate telemetry and administrative overview for LEUKOTEX studio."""
    # Projects telemetry
    total_projects = db.query(Project).count()
    featured_projects = db.query(Project).filter(Project.featured == True).count()

    # Category breakdown
    categories_raw = (
        db.query(Project.category, func.count(Project.id))
        .group_by(Project.category)
        .all()
    )
    categories_breakdown = {cat: count for cat, count in categories_raw}

    # Inquiries telemetry
    total_inquiries = db.query(Inquiry).count()
    new_inquiries = db.query(Inquiry).filter(Inquiry.status == "new").count()
    in_review_inquiries = db.query(Inquiry).filter(Inquiry.status == "in_review").count()
    contacted_inquiries = db.query(Inquiry).filter(Inquiry.status == "contacted").count()

    recent_inquiries = (
        db.query(Inquiry)
        .order_by(Inquiry.created_at.desc())
        .limit(5)
        .all()
    )

    # Services telemetry
    total_services = db.query(Service).count()

    return {
        "system": {
            "database_dialect": engine.dialect.name,
            "status": "operational",
            "environment": "active"
        },
        "metrics": {
            "projects": {
                "total": total_projects,
                "featured": featured_projects,
                "categories": categories_breakdown
            },
            "inquiries": {
                "total": total_inquiries,
                "new": new_inquiries,
                "in_review": in_review_inquiries,
                "contacted": contacted_inquiries,
                "recent": [
                    {
                        "id": inq.id,
                        "name": inq.name,
                        "email": inq.email,
                        "projectType": inq.project_type,
                        "status": inq.status,
                        "createdAt": inq.created_at.isoformat() if inq.created_at else None
                    }
                    for inq in recent_inquiries
                ]
            },
            "services": {
                "total": total_services
            }
        }
    }
