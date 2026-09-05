from typing import List, Optional
from pydantic import BaseModel, Field, ConfigDict


class ServiceBase(BaseModel):
    number: str = Field(..., max_length=10)
    title: str = Field(..., max_length=150)
    short_desc: str = Field(..., alias="shortDesc")
    full_desc: str = Field(..., alias="fullDesc")
    tags: List[str] = []
    image: str = Field(..., max_length=500)
    alt_text: str = Field(..., alias="altText", max_length=255)

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )


class ServiceCreate(ServiceBase):
    pass


class ServiceUpdate(BaseModel):
    number: Optional[str] = None
    title: Optional[str] = None
    short_desc: Optional[str] = Field(None, alias="shortDesc")
    full_desc: Optional[str] = Field(None, alias="fullDesc")
    tags: Optional[List[str]] = None
    image: Optional[str] = None
    alt_text: Optional[str] = Field(None, alias="altText")

    model_config = ConfigDict(populate_by_name=True)


class ServiceResponse(ServiceBase):
    id: str

    model_config = ConfigDict(
        populate_by_name=True,
        from_attributes=True
    )
