from datetime import datetime
from typing import Optional, Dict
from pydantic import BaseModel, EmailStr, Field, ConfigDict


class InquiryCreate(BaseModel):
    name: str = Field(..., min_length=2, max_length=150)
    email: EmailStr
    project_type: str = Field(..., alias="projectType", min_length=2, max_length=100)
    description: str = Field(..., min_length=10, max_length=5000)
    budget: str = Field(..., max_length=50)

    model_config = ConfigDict(populate_by_name=True)


class InquiryStatusUpdate(BaseModel):
    status: str = Field(..., pattern="^(new|in_review|contacted|archived)$")
    notes: Optional[str] = None


class InquiryResponse(BaseModel):
    id: str
    name: str
    email: str
    project_type: str = Field(..., alias="projectType")
    description: str
    budget: str
    status: str
    notes: Optional[str] = None
    created_at: datetime
    updated_at: datetime

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )


class ContactSubmissionResponse(BaseModel):
    success: bool = True
    message: str
    inquiry_id: Optional[str] = None


class InquiryStatsResponse(BaseModel):
    total: int
    new: int
    in_review: int
    contacted: int
    archived: int
