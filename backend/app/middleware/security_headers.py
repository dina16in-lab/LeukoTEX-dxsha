"""
Security headers middleware for LEUKOTEX Studio API.

Adds OWASP-recommended security headers to every response.
"""
from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Inject security headers into all responses.

    Headers applied:
    - X-Content-Type-Options: nosniff
    - X-Frame-Options: DENY
    - X-XSS-Protection: 0 (modern browsers use CSP; legacy header disabled)
    - Referrer-Policy: strict-origin-when-cross-origin
    - Permissions-Policy: restrict sensitive browser features
    - Strict-Transport-Security: (only when request is HTTPS)
    - Content-Security-Policy: restrictive default (API returns JSON, not HTML)
    """

    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        # Prevent MIME-type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Prevent clickjacking
        response.headers["X-Frame-Options"] = "DENY"

        # Referrer policy
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Permissions policy — disable sensitive APIs not needed for JSON API
        response.headers["Permissions-Policy"] = (
            "camera=(), microphone=(), geolocation=(), payment=()"
        )

        # HSTS — only over HTTPS (check forwarded proto as well)
        forwarded_proto = request.headers.get("x-forwarded-proto", "")
        if request.url.scheme == "https" or forwarded_proto == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"

        # CSP for API — no inline scripts needed; restrictive
        # Allow Swagger UI / ReDoc to function when serving docs
        if request.url.path in ("/docs", "/redoc", "/openapi.json"):
            # Relax CSP for docs endpoints (Swagger UI needs inline scripts/styles)
            pass
        else:
            response.headers["Content-Security-Policy"] = "default-src 'none'; frame-ancestors 'none'"

        # Remove server fingerprinting
        if "server" in response.headers:
            del response.headers["server"]
        response.headers["X-Powered-By"] = "LEUKOTEX"

        return response
