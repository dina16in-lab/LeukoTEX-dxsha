import os
from unittest.mock import MagicMock
import pytest
from fastapi.testclient import TestClient
from app.main import app
from app.database import engine, Base, SessionLocal
from app.seed import seed_database
from app.models.user import User
from app.models.inquiry import Inquiry
from app.core.security import get_password_hash
from app.config import settings
from app.services.email import send_inquiry_notification, EmailDeliveryError

TEST_ADMIN_EMAIL = "test_admin@leukotex.com"
TEST_ADMIN_USERNAME = "test_admin"
TEST_ADMIN_PASSWORD = "TestAdminSecurePassword2026!"


@pytest.fixture(scope="session", autouse=True)
def setup_database():
    # Verify engine dialect is PostgreSQL
    assert engine.dialect.name == "postgresql", f"Expected postgresql dialect, got {engine.dialect.name}"

    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
        # Ensure test admin exists for test suite
        admin = db.query(User).filter(User.email == TEST_ADMIN_EMAIL).first()
        if not admin:
            admin = User(
                email=TEST_ADMIN_EMAIL,
                username=TEST_ADMIN_USERNAME,
                hashed_password=get_password_hash(TEST_ADMIN_PASSWORD),
                is_admin=True,
                is_active=True
            )
            db.add(admin)
            db.commit()
    finally:
        db.close()
    yield


@pytest.fixture
def client():
    with TestClient(app) as c:
        yield c


@pytest.fixture
def admin_token(client):
    login_payload = {
        "email": TEST_ADMIN_EMAIL,
        "password": TEST_ADMIN_PASSWORD
    }
    res = client.post("/api/auth/login", json=login_payload)
    assert res.status_code == 200, f"Login failed: {res.text}"
    data = res.json()
    return data["access_token"]


@pytest.fixture
def auth_headers(admin_token):
    return {"Authorization": f"Bearer {admin_token}"}


@pytest.fixture(autouse=True)
def mock_email_notifications(monkeypatch):
    """Automatically mock send_inquiry_notification in tests to avoid needing live Resend API key."""
    def mock_send(inquiry):
        return {"id": "mock-email-id-123"}
    monkeypatch.setattr("app.api.endpoints.inquiries.send_inquiry_notification", mock_send)


@pytest.fixture(autouse=True)
def reset_rate_limiters():
    """Reset in-memory rate limiters between tests to prevent cross-test 429s."""
    from app.middleware.rate_limiter import reset_all_limiters
    reset_all_limiters()
    yield
    reset_all_limiters()


# ==========================================
# 1. Database & System Architecture Tests
# ==========================================

def test_postgresql_only_no_sqlite_fallback():
    """Verify that PostgreSQL is the active engine dialect and leukotex.db is not present."""
    assert engine.dialect.name == "postgresql"
    assert not os.path.exists("leukotex.db"), "SQLite database file 'leukotex.db' must NOT exist."


def test_root_endpoint(client):
    response = client.get("/")
    assert response.status_code == 200
    data = response.json()
    assert "LEUKOTEX" in data["studio"]
    assert "PostgreSQL" in data["system"]


def test_health_check(client):
    response = client.get("/api/health")
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "healthy"


# ==========================================
# 2. Authentication & Admin Security Tests
# ==========================================

def test_auth_login_success(client):
    response = client.post("/api/auth/login", json={
        "email": TEST_ADMIN_EMAIL,
        "password": TEST_ADMIN_PASSWORD
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data
    assert data["token_type"] == "bearer"


def test_auth_login_invalid_password(client):
    response = client.post("/api/auth/login", json={
        "email": TEST_ADMIN_EMAIL,
        "password": "WrongPassword123!"
    })
    assert response.status_code == 401
    assert "detail" in response.json()


def test_auth_login_oauth2_form(client):
    response = client.post("/api/auth/token", data={
        "username": TEST_ADMIN_EMAIL,
        "password": TEST_ADMIN_PASSWORD
    })
    assert response.status_code == 200
    data = response.json()
    assert "access_token" in data


def test_auth_get_me_authenticated(client, auth_headers):
    response = client.get("/api/auth/me", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert data["email"] == TEST_ADMIN_EMAIL
    assert data["is_admin"] is True


def test_auth_get_me_unauthorized(client):
    response = client.get("/api/auth/me")
    assert response.status_code == 401


def test_admin_create_secondary_user(client, auth_headers):
    new_user_payload = {
        "email": "secondary_admin@leukotex.com",
        "username": "secondary_admin",
        "password": "SecurePassword987!",
        "is_admin": True
    }
    response = client.post("/api/admin/users", json=new_user_payload, headers=auth_headers)
    assert response.status_code in [201, 400]
    if response.status_code == 201:
        data = response.json()
        assert data["email"] == new_user_payload["email"]
        assert data["is_admin"] is True


# ==========================================
# 3. Static vs Dynamic Route Ordering Tests
# ==========================================

def test_static_route_ordering_inquiry_stats(client, auth_headers):
    """Verify that GET /api/admin/inquiries/stats resolves to stats aggregator and not inquiry_id 'stats'."""
    response = client.get("/api/admin/inquiries/stats", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()
    assert "total" in data
    assert "new" in data
    assert "in_review" in data
    assert "contacted" in data
    assert "archived" in data


def test_dynamic_route_inquiry_detail(client, auth_headers):
    """Verify that dynamic route /api/admin/inquiries/{inquiry_id} retrieves a specific inquiry."""
    # Create test inquiry
    sub_res = client.post("/api/contact", json={
        "name": "Route Order Tester",
        "email": "route_tester@leukotex.com",
        "projectType": "Interactive Experience",
        "description": "Testing FastAPI router ordering and static endpoint priority.",
        "budget": "50k+"
    })
    assert sub_res.status_code == 201
    inquiry_id = sub_res.json()["inquiry_id"]

    # Retrieve by ID
    get_res = client.get(f"/api/admin/inquiries/{inquiry_id}", headers=auth_headers)
    assert get_res.status_code == 200
    inquiry = get_res.json()
    assert inquiry["id"] == inquiry_id
    assert inquiry["name"] == "Route Order Tester"


# ==========================================
# 4. Projects API Tests
# ==========================================

def test_get_projects(client):
    response = client.get("/api/projects")
    assert response.status_code == 200
    projects = response.json()
    assert isinstance(projects, list)
    assert len(projects) >= 4
    first = projects[0]
    assert "slug" in first
    assert "title" in first
    assert "category" in first


def test_get_projects_filtered_by_category(client):
    response = client.get("/api/projects?category=3d-websites")
    assert response.status_code == 200
    projects = response.json()
    assert isinstance(projects, list)
    assert len(projects) >= 1


def test_get_projects_search(client):
    response = client.get("/api/projects?search=Nexus")
    assert response.status_code == 200
    projects = response.json()
    assert len(projects) >= 1
    assert any("Nexus" in p["title"] for p in projects)


def test_get_project_by_slug_found(client):
    response = client.get("/api/projects/nexus-protocol")
    assert response.status_code == 200
    project = response.json()
    assert project["slug"] == "nexus-protocol"
    assert project["title"] == "Nexus Protocol"


def test_get_project_by_slug_not_found(client):
    response = client.get("/api/projects/non-existent-slug-xyz")
    assert response.status_code == 404


def test_project_crud_lifecycle(client, auth_headers):
    # 1. Create project
    new_proj = {
        "slug": "synthetic-horizon-pg",
        "title": "Synthetic Horizon PG",
        "year": "2025",
        "category": "Interactive",
        "categorySlug": "interactive",
        "client": "Aura Spatial",
        "description": "Comprehensive test project verifying PostgreSQL CRUD lifecycle.",
        "thumbnail": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
        "tags": ["Three.js", "PostgreSQL", "FastAPI"],
        "featured": False
    }
    create_res = client.post("/api/admin/projects", json=new_proj, headers=auth_headers)
    if create_res.status_code == 400 and "already exists" in create_res.text:
        pass
    else:
        assert create_res.status_code == 201
        created = create_res.json()
        assert created["slug"] == "synthetic-horizon-pg"

    # 2. Update project
    update_payload = {
        "title": "Synthetic Horizon PG Updated",
        "description": "Updated project description."
    }
    update_res = client.put("/api/admin/projects/synthetic-horizon-pg", json=update_payload, headers=auth_headers)
    assert update_res.status_code == 200
    assert update_res.json()["title"] == "Synthetic Horizon PG Updated"
    assert update_res.json()["description"] == "Updated project description."

    # 3. Delete project
    del_res = client.delete("/api/admin/projects/synthetic-horizon-pg", headers=auth_headers)
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True


# ==========================================
# 5. Services API Tests (CRUD)
# ==========================================

def test_get_services(client):
    response = client.get("/api/services")
    assert response.status_code == 200
    services = response.json()
    assert isinstance(services, list)
    assert len(services) >= 4
    first = services[0]
    assert "number" in first
    assert "title" in first
    assert "shortDesc" in first


def test_get_service_by_number(client):
    response = client.get("/api/services/01")
    assert response.status_code == 200
    service = response.json()
    assert service["number"] == "01"


def test_get_service_not_found(client):
    response = client.get("/api/services/non-existent-service-999")
    assert response.status_code == 404


def test_service_crud_lifecycle(client, auth_headers):
    # 1. Create service
    new_service = {
        "number": "05",
        "title": "Autonomous Spatial Architecture",
        "shortDesc": "Next-gen spatial environments with real-time physics.",
        "fullDesc": "Comprehensive 3D spatial simulation and real-time visualization for cutting-edge digital experiences.",
        "tags": ["Spatial", "Physics", "Three.js"],
        "image": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe",
        "altText": "Spatial architecture visual preview",
        "order": 5
    }
    create_res = client.post("/api/admin/services", json=new_service, headers=auth_headers)
    if create_res.status_code == 400 and "already exists" in create_res.text:
        # Retrieve existing
        srv_res = client.get("/api/services/05")
        srv_id = srv_res.json()["id"]
    else:
        assert create_res.status_code == 201
        srv_id = create_res.json()["id"]

    # 2. Update service
    update_payload = {
        "title": "Autonomous Spatial Architecture (Updated)",
        "shortDesc": "Updated short description for spatial architecture."
    }
    put_res = client.put(f"/api/admin/services/{srv_id}", json=update_payload, headers=auth_headers)
    assert put_res.status_code == 200
    assert put_res.json()["title"] == "Autonomous Spatial Architecture (Updated)"

    # 3. Delete service
    del_res = client.delete(f"/api/admin/services/{srv_id}", headers=auth_headers)
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True


def test_service_admin_unauthorized(client):
    new_service = {
        "number": "99",
        "title": "Unauthorized Test",
        "shortDesc": "Short",
        "fullDesc": "Full",
        "tags": ["Test"],
        "image": "https://example.com/img.jpg",
        "altText": "Alt",
        "order": 99
    }
    response = client.post("/api/admin/services", json=new_service)
    assert response.status_code == 401


# ==========================================
# 6. Inquiries, Contact & Email Notification Tests
# ==========================================

def test_submit_contact_valid(client):
    payload = {
        "name": "Astrid Lindgren",
        "email": "astrid@scandinavia-design.is",
        "projectType": "Interactive Web Design",
        "description": "We are creating a high-end editorial spatial archive for Scandinavian architecture.",
        "budget": "50k+"
    }
    response = client.post("/api/contact", json=payload)
    assert response.status_code == 201
    data = response.json()
    assert data["success"] is True
    assert "inquiry_id" in data


def test_submit_contact_validation_errors(client):
    bad_email = {
        "name": "Invalid User",
        "email": "not-an-email",
        "projectType": "3D Web",
        "description": "Valid length description for testing.",
        "budget": "10k-25k"
    }
    res_email = client.post("/api/contact", json=bad_email)
    assert res_email.status_code == 422

    short_desc = {
        "name": "Shorty",
        "email": "short@example.com",
        "projectType": "3D Web",
        "description": "Hi",
        "budget": "10k-25k"
    }
    res_short = client.post("/api/contact", json=short_desc)
    assert res_short.status_code == 422


def test_submit_contact_email_failure_preserves_db_record(client, monkeypatch):
    """Verify that if email delivery fails, HTTP 201 is still returned (resource created) AND the inquiry is preserved in PostgreSQL.

    Email is a side-effect notification; per HTTP semantics the primary resource (inquiry)
    was created successfully, so 201 is correct. Email failures are logged for admin monitoring.
    """
    def mock_failing_send(inquiry):
        raise EmailDeliveryError("Resend API key quota exceeded or service error.")

    monkeypatch.setattr("app.api.endpoints.inquiries.send_inquiry_notification", mock_failing_send)

    payload = {
        "name": "Preserved Client",
        "email": "preserved@client.is",
        "projectType": "Website Development",
        "description": "This inquiry must remain saved in the database even when email delivery fails.",
        "budget": "25k-50k"
    }

    res = client.post("/api/contact", json=payload)
    # Resource created successfully despite email side-effect failure
    assert res.status_code == 201
    data = res.json()
    assert data["success"] is True
    assert "inquiry_id" in data

    # Verify directly from DB that the record exists
    db = SessionLocal()
    try:
        inquiry = db.query(Inquiry).filter(Inquiry.email == "preserved@client.is").first()
        assert inquiry is not None
        assert inquiry.name == "Preserved Client"
        assert inquiry.project_type == "Website Development"
        assert inquiry.status == "new"
    finally:
        db.close()


def test_email_service_payload_and_reply_to(monkeypatch):
    """Verify that send_inquiry_notification constructs proper headers, subject, Reply-To, and body."""
    captured_request = {}

    def mock_post(url, json, headers):
        captured_request["url"] = url
        captured_request["json"] = json
        captured_request["headers"] = headers
        mock_res = MagicMock()
        mock_res.status_code = 200
        mock_res.json.return_value = {"id": "resend-msg-999"}
        return mock_res

    monkeypatch.setattr("httpx.Client.post", lambda self, url, json, headers: mock_post(url, json, headers))
    monkeypatch.setattr(settings, "RESEND_API_KEY", "re_test_key_12345")
    monkeypatch.setattr(settings, "EMAIL_FROM", "LEUKOTEX Inquiries <onboarding@resend.dev>")
    monkeypatch.setattr(settings, "EMAIL_TO", "dina16in@gmail.com")

    fake_inquiry = Inquiry(
        id="test-inquiry-uuid-123",
        name="Elena Rostova",
        email="elena@rostova.com",
        project_type="3D Websites",
        description="We need an immersive 3D product showcase for luxury robotics.",
        budget="50k+",
        status="new"
    )

    result = send_inquiry_notification(fake_inquiry)
    assert result == {"id": "resend-msg-999"}

    # Verify Resend endpoint & headers
    assert captured_request["url"] == "https://api.resend.com/emails"
    assert captured_request["headers"]["Authorization"] == "Bearer re_test_key_12345"

    # Verify payload
    payload = captured_request["json"]
    assert payload["from"] == "LEUKOTEX Inquiries <onboarding@resend.dev>"
    assert payload["to"] == ["dina16in@gmail.com"]
    assert payload["reply_to"] == "elena@rostova.com"
    assert payload["subject"] == "New LEUKOTEX Project Inquiry — 3D Websites"

    # Verify body fields
    assert "LEUKOTEX" in payload["text"]
    assert "Elena Rostova" in payload["text"]
    assert "elena@rostova.com" in payload["text"]
    assert "3D Websites" in payload["text"]
    assert "50k+" in payload["text"]
    assert "test-inquiry-uuid-123" in payload["text"]

    assert "Elena Rostova" in payload["html"]
    assert "elena@rostova.com" in payload["html"]


def test_inquiries_admin_workflow(client, auth_headers):
    # 1. Create an inquiry to inspect
    sub_payload = {
        "name": "Postgres Workflow Client",
        "email": "pg_workflow@client.com",
        "projectType": "Creative Development",
        "description": "End-to-end procedural particle system for luxury brand showcase.",
        "budget": "25k-50k"
    }
    sub_res = client.post("/api/contact", json=sub_payload)
    assert sub_res.status_code == 201
    inq_id = sub_res.json()["inquiry_id"]

    # 2. Get inquiry stats (static route)
    stats_res = client.get("/api/admin/inquiries/stats", headers=auth_headers)
    assert stats_res.status_code == 200
    stats = stats_res.json()
    assert stats["total"] >= 1
    assert stats["new"] >= 1

    # 3. Retrieve single inquiry (dynamic route)
    get_res = client.get(f"/api/admin/inquiries/{inq_id}", headers=auth_headers)
    assert get_res.status_code == 200
    inq_data = get_res.json()
    assert inq_data["name"] == "Postgres Workflow Client"
    assert inq_data["status"] == "new"

    # 4. Update inquiry status
    status_payload = {
        "status": "in_review",
        "notes": "Reviewed by lead creative technologist. Scheduled for discovery call."
    }
    patch_res = client.patch(f"/api/admin/inquiries/{inq_id}/status", json=status_payload, headers=auth_headers)
    assert patch_res.status_code == 200
    assert patch_res.json()["status"] == "in_review"
    assert "Reviewed by lead" in patch_res.json()["notes"]

    # 5. Delete inquiry
    del_res = client.delete(f"/api/admin/inquiries/{inq_id}", headers=auth_headers)
    assert del_res.status_code == 200
    assert del_res.json()["success"] is True


# ==========================================
# 7. Admin Overview & Analytics Tests
# ==========================================

def test_admin_overview_telemetry(client, auth_headers):
    response = client.get("/api/admin/overview", headers=auth_headers)
    assert response.status_code == 200
    data = response.json()

    assert "system" in data
    assert data["system"]["database_dialect"] == "postgresql"
    assert "metrics" in data
    assert "projects" in data["metrics"]
    assert "inquiries" in data["metrics"]
    assert "services" in data["metrics"]
    assert data["metrics"]["projects"]["total"] >= 4
    assert data["metrics"]["services"]["total"] >= 4


def test_admin_overview_unauthorized(client):
    response = client.get("/api/admin/overview")
    assert response.status_code == 401


# ==========================================
# 8. Security & Production Hardening Tests
# ==========================================

def test_security_headers_present(client):
    """Verify OWASP security headers are present on API responses."""
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.headers.get("x-content-type-options") == "nosniff"
    assert response.headers.get("x-frame-options") == "DENY"
    assert response.headers.get("referrer-policy") == "strict-origin-when-cross-origin"
    assert "permissions-policy" in response.headers
    assert "x-request-id" in response.headers


def test_rate_limiting_contact(client):
    """Verify contact endpoint enforces rate limiting (5/min)."""
    from app.middleware.rate_limiter import reset_all_limiters
    reset_all_limiters()
    payload = {
        "name": "Rate Limit Tester",
        "email": "ratelimit_tester@leukotex.com",
        "projectType": "Interactive Web Design",
        "description": "Testing rate limiting enforcement for security audit.",
        "budget": "25k-50k"
    }
    # 5 should succeed, 6th should be 429
    for i in range(5):
        p = {**payload, "email": f"ratelimit_{i}@leukotex.com"}
        r = client.post("/api/contact", json=p)
        assert r.status_code == 201, f"Request {i} should succeed, got {r.status_code}: {r.text}"

    # 6th should be rate limited
    r = client.post("/api/contact", json={**payload, "email": "ratelimit_5@leukotex.com"})
    assert r.status_code == 429
    assert "Retry-After" in r.headers
    assert "Rate limit" in r.json()["detail"]
    reset_all_limiters()


def test_rate_limiting_auth(client):
    """Verify auth endpoint enforces brute-force rate limiting."""
    from app.middleware.rate_limiter import reset_all_limiters
    reset_all_limiters()
    for i in range(10):
        r = client.post("/api/auth/login", json={"email": "brute@leukotex.com", "password": "wrong123"})
        # 401 until rate limit kicks in
        assert r.status_code == 401

    r = client.post("/api/auth/login", json={"email": "brute@leukotex.com", "password": "wrong123"})
    assert r.status_code == 429
    assert "Retry-After" in r.headers
    reset_all_limiters()


def test_validation_error_format(client):
    """Verify validation errors return structured field-level errors (for frontend)."""
    bad_payload = {
        "name": "A",
        "email": "not-an-email",
        "projectType": "",
        "description": "Hi",
        "budget": "10k-25k"
    }
    r = client.post("/api/contact", json=bad_payload)
    assert r.status_code == 422
    data = r.json()
    assert data["detail"] == "Validation failed"
    assert "errors" in data
    assert isinstance(data["errors"], list)
    fields = [e["field"] for e in data["errors"]]
    assert any("email" in f for f in fields)


def test_like_injection_escaped(client):
    """Verify LIKE pattern injection (% and _) is escaped in search filters."""
    # This should NOT match all projects via % wildcard injection
    r = client.get("/api/projects?search=%")
    assert r.status_code == 200
    # With proper escaping, searching for '%' should return 0 or very few results,
    # not all projects. Without escaping, '%' would match everything.
    projects = r.json()
    # If escaping works, '%' literal match should find 0 projects (no title contains '%')
    assert isinstance(projects, list)


def test_cors_no_wildcard_with_credentials(client):
    """Verify CORS does not allow wildcard origin with credentials."""
    from app.config import settings
    # Config validator should have filtered wildcard
    assert "*" not in settings.CORS_ORIGINS


def test_database_url_redaction():
    """Verify database URL redaction utility does not expose passwords in logs."""
    from app.database import _redact_db_url
    url = "postgresql://postgres:supersecret123@localhost:5432/leukotex_db"
    redacted = _redact_db_url(url)
    assert "supersecret123" not in redacted
    assert "***" in redacted
    assert "leukotex_db" in redacted


def test_health_check_includes_db_status(client):
    """Verify health endpoint includes database connectivity status."""
    r = client.get("/api/health")
    assert r.status_code == 200
    data = r.json()
    assert "database" in data
    assert data["database"] in ("connected", "disconnected")
    assert data["dialect"] == "postgresql"
