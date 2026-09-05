import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime
from app.database import Base


class Inquiry(Base):
    __tablename__ = "inquiries"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    name = Column(String(150), nullable=False)
    email = Column(String(255), nullable=False, index=True)
    project_type = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    budget = Column(String(50), nullable=False)
    status = Column(String(50), default="new", nullable=False, index=True)  # new, in_review, contacted, archived
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
