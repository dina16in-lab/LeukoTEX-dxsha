import logging
from datetime import datetime, timezone
from typing import Optional, Dict, Any
import httpx
from app.config import settings
from app.models.inquiry import Inquiry

logger = logging.getLogger("leukotex.email")

RESEND_API_URL = "https://api.resend.com/emails"


class EmailDeliveryError(Exception):
    """Raised when notification email sending fails."""
    pass


def send_inquiry_notification(inquiry: Inquiry) -> Dict[str, Any]:
    """
    Send an email notification to EMAIL_TO via Resend API when a new project inquiry is submitted.
    Configured with customer's email as the Reply-To header.
    Never exposes or logs secret API keys.
    """
    api_key = (settings.RESEND_API_KEY or "").strip()
    from_email = (settings.EMAIL_FROM or "").strip()
    to_email = (settings.EMAIL_TO or "").strip()

    if not api_key:
        raise EmailDeliveryError("RESEND_API_KEY is not configured on the server.")

    if not from_email:
        raise EmailDeliveryError("EMAIL_FROM is not configured on the server.")

    if not to_email:
        raise EmailDeliveryError("EMAIL_TO is not configured on the server.")

    subject = f"New LEUKOTEX Project Inquiry — {inquiry.project_type}"

    # Format submission timestamp
    created_str = (
        inquiry.created_at.strftime("%Y-%m-%d %H:%M:%S UTC")
        if getattr(inquiry, "created_at", None)
        else datetime.now(timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    )

    text_content = f"""LEUKOTEX — New Project Inquiry

Inquiry ID: {inquiry.id}
Submitted: {created_str}

Customer Details:
- Name: {inquiry.name}
- Email: {inquiry.email}

Project Scope:
- Project Type: {inquiry.project_type}
- Budget Tier: {inquiry.budget}

Project Description:
{inquiry.description}
"""

    html_content = f"""<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body {{ font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0b0f17; color: #e2e8f0; margin: 0; padding: 24px; }}
    .card {{ max-width: 600px; margin: 0 auto; background-color: #111827; border: 1px solid #1f293d; border-radius: 12px; padding: 32px; }}
    .header {{ border-bottom: 1px solid #1f293d; padding-bottom: 16px; margin-bottom: 24px; }}
    .brand {{ color: #18a0fb; font-size: 14px; letter-spacing: 2px; text-transform: uppercase; font-weight: bold; }}
    .title {{ color: #ffffff; font-size: 22px; font-weight: 600; margin-top: 6px; }}
    .field {{ margin-bottom: 16px; }}
    .label {{ color: #94a3b8; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 4px; }}
    .value {{ color: #ffffff; font-size: 15px; }}
    .desc-box {{ background-color: #0d131f; border: 1px solid #1e293b; border-radius: 8px; padding: 16px; margin-top: 8px; color: #e2e8f0; font-size: 14px; line-height: 1.6; white-space: pre-wrap; }}
    .meta {{ margin-top: 24px; padding-top: 16px; border-top: 1px solid #1f293d; font-size: 12px; color: #64748b; }}
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="brand">LEUKOTEX</div>
      <div class="title">New Project Inquiry</div>
    </div>

    <div class="field">
      <div class="label">Customer Name</div>
      <div class="value">{inquiry.name}</div>
    </div>

    <div class="field">
      <div class="label">Customer Email</div>
      <div class="value"><a href="mailto:{inquiry.email}" style="color: #18a0fb;">{inquiry.email}</a></div>
    </div>

    <div class="field">
      <div class="label">Project Type</div>
      <div class="value">{inquiry.project_type}</div>
    </div>

    <div class="field">
      <div class="label">Budget Tier</div>
      <div class="value">{inquiry.budget}</div>
    </div>

    <div class="field">
      <div class="label">Project Description</div>
      <div class="desc-box">{inquiry.description}</div>
    </div>

    <div class="meta">
      <div>Inquiry ID: {inquiry.id}</div>
      <div>Submitted: {created_str}</div>
    </div>
  </div>
</body>
</html>"""

    payload = {
        "from": from_email,
        "to": [to_email],
        "reply_to": inquiry.email,
        "subject": subject,
        "text": text_content,
        "html": html_content,
    }

    headers = {
        "Authorization": f"Bearer {api_key}",
        "Content-Type": "application/json",
    }

    try:
        with httpx.Client(timeout=15.0) as client:
            response = client.post(RESEND_API_URL, json=payload, headers=headers)
            if response.status_code >= 400:
                logger.error(
                    "Resend API returned error status %d: %s",
                    response.status_code,
                    response.text
                )
                raise EmailDeliveryError(
                    f"Resend email delivery failed with status {response.status_code}"
                )
            return response.json()
    except httpx.RequestError as exc:
        logger.error("Network exception while communicating with email service: %s", str(exc))
        raise EmailDeliveryError(f"Network error while connecting to email service: {exc}") from exc
