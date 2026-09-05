import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, Boolean, DateTime, JSON
from app.database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    slug = Column(String(150), unique=True, index=True, nullable=False)
    title = Column(String(200), nullable=False)
    year = Column(String(10), nullable=False)
    category = Column(String(100), nullable=False, index=True)
    category_slug = Column(String(100), nullable=False, index=True)
    description = Column(Text, nullable=False)
    full_description = Column(Text, nullable=True)
    tags = Column(JSON, default=list, nullable=False)  # List of tag strings
    thumbnail = Column(String(500), nullable=False)
    live_url = Column(String(500), nullable=True)
    client = Column(String(150), nullable=True)
    featured = Column(Boolean, default=False, nullable=False, index=True)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
    updated_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), onupdate=lambda: datetime.now(timezone.utc), nullable=False)
