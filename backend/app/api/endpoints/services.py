from typing import List
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.service import Service
from app.schemas.service import ServiceCreate, ServiceUpdate, ServiceResponse
from app.core.deps import get_current_admin
from app.models.user import User

router = APIRouter(tags=["Services"])


@router.get("/services", response_model=List[ServiceResponse])
def get_services(
    db: Session = Depends(get_db)
):
    """Retrieve all studio capability offerings."""
    services = db.query(Service).order_by(Service.number.asc()).all()
    return services


@router.get("/services/{service_id_or_number}", response_model=ServiceResponse)
def get_service_by_id_or_number(
    service_id_or_number: str,
    db: Session = Depends(get_db)
):
    """Retrieve a single service offering by unique ID or number (e.g. '01', 'serv-1')."""
    service = db.query(Service).filter(
        (Service.id == service_id_or_number) | (Service.number == service_id_or_number)
    ).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Service '{service_id_or_number}' not found"
        )
    return service


# --- Admin Protected Service Endpoints ---

@router.post("/admin/services", response_model=ServiceResponse, status_code=status.HTTP_201_CREATED)
def create_service(
    service_in: ServiceCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Create a new service offering (Admin only)."""
    existing = db.query(Service).filter(Service.number == service_in.number).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Service with number '{service_in.number}' already exists"
        )

    service_data = service_in.model_dump(by_alias=False)
    service = Service(**service_data)
    db.add(service)
    db.commit()
    db.refresh(service)
    return service


@router.put("/admin/services/{service_id}", response_model=ServiceResponse)
def update_service(
    service_id: str,
    service_in: ServiceUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Update an existing service offering (Admin only)."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )

    update_data = service_in.model_dump(exclude_unset=True, by_alias=False)
    for field, value in update_data.items():
        setattr(service, field, value)

    db.commit()
    db.refresh(service)
    return service


@router.delete("/admin/services/{service_id}", status_code=status.HTTP_200_OK)
def delete_service(
    service_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Delete a service offering (Admin only)."""
    service = db.query(Service).filter(Service.id == service_id).first()
    if not service:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Service not found"
        )

    db.delete(service)
    db.commit()
    return {"success": True, "message": f"Service '{service.title}' deleted successfully"}
