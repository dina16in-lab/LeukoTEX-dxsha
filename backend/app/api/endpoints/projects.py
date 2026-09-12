from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models.project import Project
from app.schemas.project import ProjectCreate, ProjectUpdate, ProjectResponse
from app.core.deps import get_current_admin
from app.models.user import User

router = APIRouter(tags=["Projects"])


def _escape_like(value: str) -> str:
    """Escape LIKE wildcards to prevent pattern injection."""
    return value.replace("\\", "\\\\").replace("%", "\\%").replace("_", "\\_")


@router.get("/projects", response_model=List[ProjectResponse])
def get_projects(
    category: Optional[str] = Query(None, description="Filter by category or category slug", max_length=100),
    featured: Optional[bool] = Query(None, description="Filter by featured status"),
    search: Optional[str] = Query(None, description="Search across title, client, or description", max_length=100),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=100),
    db: Session = Depends(get_db)
):
    """Retrieve portfolio projects with filtering, searching, and pagination."""
    query = db.query(Project)

    if category and category.lower() != "all":
        safe_cat = _escape_like(category)
        query = query.filter(
            (Project.category.ilike(f"%{safe_cat}%", escape="\\")) |
            (Project.category_slug.ilike(f"%{safe_cat}%", escape="\\"))
        )

    if featured is not None:
        query = query.filter(Project.featured == featured)

    if search:
        safe_search = _escape_like(search)
        search_term = f"%{safe_search}%"
        query = query.filter(
            (Project.title.ilike(search_term, escape="\\")) |
            (Project.client.ilike(search_term, escape="\\")) |
            (Project.description.ilike(search_term, escape="\\"))
        )

    projects = query.order_by(Project.created_at.desc()).offset(skip).limit(limit).all()
    return projects


@router.get("/projects/{slug}", response_model=ProjectResponse)
def get_project_by_slug(
    slug: str,
    db: Session = Depends(get_db)
):
    """Retrieve single project by slug or ID."""
    project = db.query(Project).filter((Project.slug == slug) | (Project.id == slug)).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Project with slug or ID '{slug}' not found"
        )
    return project


# --- Admin Protected CRUD Endpoints ---

@router.post("/admin/projects", response_model=ProjectResponse, status_code=status.HTTP_201_CREATED)
def create_project(
    project_in: ProjectCreate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Create a new showcase project (Admin only)."""
    existing = db.query(Project).filter(Project.slug == project_in.slug).first()
    if existing:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Project with slug '{project_in.slug}' already exists."
        )

    project_data = project_in.model_dump(by_alias=False)
    project = Project(**project_data)
    db.add(project)
    db.commit()
    db.refresh(project)
    return project


@router.put("/admin/projects/{project_id}", response_model=ProjectResponse)
def update_project(
    project_id: str,
    project_in: ProjectUpdate,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Update an existing project by ID or slug (Admin only)."""
    project = db.query(Project).filter((Project.id == project_id) | (Project.slug == project_id)).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    update_data = project_in.model_dump(exclude_unset=True, by_alias=False)
    for field, value in update_data.items():
        setattr(project, field, value)

    db.commit()
    db.refresh(project)
    return project


@router.delete("/admin/projects/{project_id}", status_code=status.HTTP_200_OK)
def delete_project(
    project_id: str,
    db: Session = Depends(get_db),
    current_admin: User = Depends(get_current_admin)
):
    """Delete a project by ID or slug (Admin only)."""
    project = db.query(Project).filter((Project.id == project_id) | (Project.slug == project_id)).first()
    if not project:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Project not found"
        )

    db.delete(project)
    db.commit()
    return {"success": True, "message": f"Project '{project.title}' deleted successfully"}
