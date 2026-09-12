import logging
import uuid
from fastapi import APIRouter, HTTPException, Request, status

from app.schemas.inquiry import InquiryCreate, ContactSubmissionResponse
from app.services.email import send_inquiry_notification, EmailDeliveryError

logger = logging.getLogger("leukotex.public_contact")

router = APIRouter(tags=["Public Contact"])


@router.post(
    "/contact",
    response_model=ContactSubmissionResponse,
    status_code=status.HTTP_201_CREATED,
)
def submit_public_contact(
    request: Request,
    inquiry_in: InquiryCreate,
):
    """
    Public contact endpoint.

    Validates the submitted inquiry and sends it directly through
    Resend without requiring PostgreSQL.
    """

    inquiry_data = inquiry_in.model_dump(by_alias=False)

    # Lightweight object containing everything required by the
    # existing email service, without creating a database record.
    inquiry = type(
        "EmailInquiry",
        (),
        {
            "id": str(uuid.uuid4()),
            "name": inquiry_data["name"].strip(),
            "email": str(inquiry_data["email"]).strip().lower(),
            "project_type": inquiry_data["project_type"],
            "description": inquiry_data["description"].strip(),
            "budget": inquiry_data["budget"],
            "created_at": None,
        },
    )()

    try:
        send_inquiry_notification(inquiry)
    except EmailDeliveryError as exc:
        logger.error(
            "Contact email delivery failed for %s: %s",
            inquiry.email,
            str(exc),
        )
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="We could not send your inquiry right now. Please try again.",
        ) from exc
    except Exception as exc:
        logger.exception(
            "Unexpected contact email error for %s: %s",
            inquiry.email,
            str(exc),
        )
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="We could not process your inquiry right now. Please try again.",
        ) from exc

    return ContactSubmissionResponse(
        success=True,
        message="Your inquiry has been received. Our studio will connect with you within 24 hours.",
        inquiry_id=inquiry.id,
    )