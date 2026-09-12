"""
In-memory sliding-window rate limiter for LEUKOTEX Studio API.

Uses per-IP tracking with automatic cleanup. No external dependencies (Redis).
For production horizontal scaling, replace with Redis-backed limiter.

Usage:
    from app.middleware.rate_limiter import RateLimiter, rate_limit

    limiter = RateLimiter(max_requests=5, window_seconds=60)

    @router.post("/contact")
    def contact(request: Request, ...):
        rate_limit(request, limiter)
"""
import time
import logging
from collections import defaultdict, deque
from typing import Dict, Deque
from fastapi import Request, HTTPException, status

logger = logging.getLogger("leukotex.rate_limiter")


class RateLimiter:
    """
    Sliding window rate limiter.
    Tracks request timestamps per client IP.
    """

    def __init__(self, max_requests: int, window_seconds: int, prefix: str = ""):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.prefix = prefix
        # client_key -> deque of timestamps
        self._store: Dict[str, Deque[float]] = defaultdict(deque)
        self._last_cleanup: float = time.monotonic()

    def _cleanup(self) -> None:
        """Periodic cleanup of stale entries to prevent memory leak."""
        now = time.monotonic()
        # Cleanup every 5 minutes at most
        if now - self._last_cleanup < 300:
            return
        self._last_cleanup = now
        cutoff = now - self.window_seconds
        stale_keys = []
        for key, timestamps in self._store.items():
            # Remove expired timestamps
            while timestamps and timestamps[0] < cutoff:
                timestamps.popleft()
            if not timestamps:
                stale_keys.append(key)
        for key in stale_keys:
            del self._store[key]
        if stale_keys:
            logger.debug("Rate limiter cleanup: removed %d stale keys [%s]", len(stale_keys), self.prefix)

    def is_allowed(self, client_key: str) -> bool:
        now = time.monotonic()
        window_start = now - self.window_seconds
        timestamps = self._store[client_key]

        # Evict expired entries for this key
        while timestamps and timestamps[0] < window_start:
            timestamps.popleft()

        if len(timestamps) >= self.max_requests:
            return False

        timestamps.append(now)
        self._cleanup()
        return True

    def remaining(self, client_key: str) -> int:
        now = time.monotonic()
        window_start = now - self.window_seconds
        timestamps = self._store[client_key]
        while timestamps and timestamps[0] < window_start:
            timestamps.popleft()
        return max(0, self.max_requests - len(timestamps))

    def retry_after(self, client_key: str) -> int:
        timestamps = self._store[client_key]
        if not timestamps:
            return 0
        oldest = timestamps[0]
        retry = int((oldest + self.window_seconds) - time.monotonic()) + 1
        return max(1, retry)

    def reset(self) -> None:
        """Clear all tracked requests — useful for testing."""
        self._store.clear()
        self._last_cleanup = time.monotonic()


def get_client_ip(request: Request) -> str:
    """Extract client IP, respecting X-Forwarded-For when behind proxy."""
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        # Use first IP in chain (original client)
        return forwarded.split(",")[0].strip()
    if request.client:
        return request.client.host
    return "unknown"


def rate_limit(request: Request, limiter: RateLimiter) -> None:
    """
    Enforce rate limiting for the given request.
    Raises HTTP 429 if limit exceeded.
    """
    client_ip = get_client_ip(request)
    # Include route prefix in key to isolate limits per endpoint group
    key = f"{limiter.prefix}:{client_ip}" if limiter.prefix else client_ip

    if not limiter.is_allowed(key):
        retry_after = limiter.retry_after(key)
        logger.warning(
            "Rate limit exceeded for %s on %s (%s) — retry after %ds",
            client_ip, request.url.path, limiter.prefix or "global", retry_after
        )
        raise HTTPException(
            status_code=status.HTTP_429_TOO_MANY_REQUESTS,
            detail=f"Rate limit exceeded. Too many requests. Retry after {retry_after} seconds.",
            headers={"Retry-After": str(retry_after)},
        )


# Pre-configured limiters for common use cases
# Contact form: 5 submissions per minute per IP, 20 per hour
contact_limiter = RateLimiter(max_requests=5, window_seconds=60, prefix="contact")
contact_hourly_limiter = RateLimiter(max_requests=20, window_seconds=3600, prefix="contact_hourly")

# Auth: 10 login attempts per minute per IP, 30 per 5 minutes
auth_limiter = RateLimiter(max_requests=10, window_seconds=60, prefix="auth")
auth_strict_limiter = RateLimiter(max_requests=30, window_seconds=300, prefix="auth_strict")


def reset_all_limiters() -> None:
    """Reset all global limiters — call in tests to isolate rate limiting."""
    for limiter in (contact_limiter, contact_hourly_limiter, auth_limiter, auth_strict_limiter):
        limiter.reset()
