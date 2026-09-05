import logging
import re
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, Request, status
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models.inquiry import Inquiry
from app.schemas.inquiry import (
    InquiryCreate,
    InquiryStatusUpdate,
    InquiryResponse,
    InquiryStatsResponse,
    ContactSubmissionResponse,
)
from app.core.deps import get_current_admin
from app.models.user import User
from app.services.email import send_inquiry_notification, EmailDeliveryError
from app.middleware.rate_limiter import contact_limiter, contact_hourly_limiter, rate_limit

logger = logging.getLogger("leukotex.inquiries")
router = APIRouter(tags=["Inquiries & Contact"])


def _sanitize_like_pattern(value: str) -> str:
    """Escape SQL LIKE wildcards % and _ to prevent pattern injection."""
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


@router.post("/contact", response_model=ContactSubmissionResponse, status_code=status.HTTP_201_CREATED)
def submit_contact_form(
    request: Request,
    inquiry_in: InquiryCreate,
    db: Session = Depends(get_db)
):
    """Public endpoint: Ingest client inquiry from Contact Form with validation, database storage, and email notification."""
    # Rate limiting: 5/min and 20/hour per IP
    rate_limit(request, contact_limiter)
    rate_limit(request, contact_hourly_limiter)

    # Additional budget enum validation (defense in depth)
    allowed_budgets = {"10k-25k", "25k-50k", "50k+", "50k", "10k", "25k"}
    # Accept any budget string but normalize; log unusual values
    if inquiry_in.budget not in allowed_budgets and not re.match(r"^\d+k", inquiry_in.budget):
        logger.info("Unusual budget value received: %s from %s", inquiry_in.budget, inquiry_in.email)

    inquiry_data = inquiry_in.model_dump(by_alias=False)
    inquiry = Inquiry(
        name=inquiry_data["name"].strip(),
        email=inquiry_data["email"].strip().lower(),
        project_type=inquiry_data["project_type"],
        description=inquiry_data["description"].strip(),
        budget=inquiry_data["budget"],
        status="new"
    )
    db.add(inquiry)
    db.commit()
    db.refresh(inquiry)

    # Trigger real email notification via Resend (non-blocking: inquiry is already safely saved)
    # Per HTTP semantics: resource WAS created (201), email is side-effect.
    # We return 201 regardless, but log email failures for admin monitoring.
    try:
        send_inquiry_notification(inquiry)
    except EmailDeliveryError as e:
        # Known email configuration/delivery failure — log, but don't fail the request
        # Inquiry is the primary resource; email is secondary notification channel
        logger.error("Inquiry %s saved, but email notification delivery failed: %s", inquiry.id, str(e))
    except Exception as e:
        logger.exception("Inquiry %s saved, unexpected email error: %s", inquiry.id, str(e))

    return ContactSubmissionResponse(
        success=True,
        message="Your inquiry has been received. Our studio will connect with you within 24 hours.",
        inquiry_id=inquiry.id
    )


# --- Admin Protected Inquiry Management ---

@router.get("/admin/inquiries/stats", response_model=InquiryStatsResponse)
def get_inquiry_stats(
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Get aggregated inquiry statistics by status (Admin only)."""
    total = db.query(Inquiry).count()
    new_count = db.query(Inquiry).filter(Inquiry.status == "new").count()
    in_review_count = db.query(Inquiry).filter(Inquiry.status == "in_review").count()
    contacted_count = db.query(Inquiry).filter(Inquiry.status == "contacted").count()
    archived_count = db.query(Inquiry).filter(Inquiry.status == "archived").count()

    return InquiryStatsResponse(
        total=total,
        new=new_count,
        in_review=in_review_count,
        contacted=contacted_count,
        archived=archived_count
    )


@router.get("/admin/inquiries", response_model=List[InquiryResponse])
def get_inquiries(
    status_filter: Optional[str] = Query(None, alias="status", description="Filter by status ('new', 'in_review', 'contacted', 'archived')"),
    search: Optional[str] = Query(None, description="Search by name or email"),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """List submitted client inquiries with filters and pagination (Admin only)."""
    query = db.query(Inquiry)

    if status_filter:
        query = query.filter(Inquiry.status == status_filter)

    if search:
        safe_search = _sanitize_like_pattern(search)
        search_pattern = f"%{safe_search}%"
        query = query.filter(
            (Inquiry.name.ilike(search_pattern, escape="\\")) |
            (Inquiry.email.ilike(search_pattern, escape="\\")) |
            (Inquiry.project_type.ilike(search_pattern, escape="\\"))
        )

    inquiries = query.order_by(Inquiry.created_at.desc()).offset(skip).limit(limit).all()
    return inquiries


@router.get("/admin/inquiries/{inquiry_id}", response_model=InquiryResponse)
def get_inquiry_by_id(
    inquiry_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Retrieve single inquiry detail (Admin only)."""
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found"
        )
    return inquiry


@router.patch("/admin/inquiries/{inquiry_id}/status", response_model=InquiryResponse)
def update_inquiry_status(
    inquiry_id: str,
    status_in: InquiryStatusUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Update inquiry workflow status and notes (Admin only)."""
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found"
        )

    inquiry.status = status_in.status
    if status_in.notes is not None:
        inquiry.notes = status_in.notes

    db.commit()
    db.refresh(inquiry)
    return inquiry


@router.delete("/admin/inquiries/{inquiry_id}", status_code=status.HTTP_200_OK)
def delete_inquiry(
    inquiry_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Delete an inquiry (Admin only)."""
    inquiry = db.query(Inquiry).filter(Inquiry.id == inquiry_id).first()
    if not inquiry:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Inquiry not found"
        )

    db.delete(inquiry)
    db.commit()
    return {"success": True, "message": "Inquiry deleted successfully"}
