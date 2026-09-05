from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ProjectBase(BaseModel):
    slug: str
    title: str
    year: str
    category: str
    category_slug: str = Field(..., alias="categorySlug")
    description: str
    full_description: Optional[str] = Field(None, alias="fullDescription")
    tags: List[str] = []
    thumbnail: str
    live_url: Optional[str] = Field(None, alias="liveUrl")
    client: Optional[str] = None
    featured: bool = False

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(BaseModel):
    slug: Optional[str] = None
    title: Optional[str] = None
    year: Optional[str] = None
    category: Optional[str] = None
    category_slug: Optional[str] = Field(None, alias="categorySlug")
    description: Optional[str] = None
    full_description: Optional[str] = Field(None, alias="fullDescription")
    tags: Optional[List[str]] = None
    thumbnail: Optional[str] = None
    live_url: Optional[str] = Field(None, alias="liveUrl")
    client: Optional[str] = None
    featured: Optional[bool] = None

    model_config = ConfigDict(populate_by_name=True)


class ProjectResponse(ProjectBase):
    id: str
    created_at: Optional[datetime] = None
    updated_at: Optional[datetime] = None

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )
