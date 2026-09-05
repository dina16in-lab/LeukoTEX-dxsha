import uuid
from datetime import datetime, timezone
from sqlalchemy import Column, String, Text, DateTime, JSON
from app.database import Base


class Service(Base):
    __tablename__ = "services"

    id = Column(String(36), primary_key=True, default=lambda: str(uuid.uuid4()), index=True)
    number = Column(String(10), nullable=False)
    title = Column(String(150), nullable=False)
    short_desc = Column(Text, nullable=False)
    full_desc = Column(Text, nullable=False)
    tags = Column(JSON, default=list, nullable=False)
    image = Column(String(500), nullable=False)
    alt_text = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc), nullable=False)
