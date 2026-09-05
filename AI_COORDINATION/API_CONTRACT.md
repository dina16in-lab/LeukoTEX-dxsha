# API CONTRACT — Frontend ↔ Backend

Last Updated: 2026-09-05T17:05:00+05:30
Base URL: `http://127.0.0.1:8000`
API Prefix: `/api` (`settings.API_V1_STR`)
OpenAPI: `/api/openapi.json` | Docs: `/docs` (Swagger) | `/redoc`

> Antigravity MUST use this contract — never guess endpoint shapes. All request/response examples below are authoritative.

---

## GLOBAL BEHAVIORS

### Headers
| Header | Direction | Values |
|--------|-----------|--------|
| `Authorization` | Request (auth routes) | `Bearer <JWT>` |
| `Content-Type` | Request | `application/json` (POST/PUT/PATCH) |
| `X-Request-ID` | Both | Auto-generated `uuid` slice if not sent; echoed on every response |
| `Retry-After` | Response (429 only) | Seconds until rate limit resets |

### Security Headers (all responses)
`X-Content-Type-Options: nosniff`, `X-Frame-Options: DENY`, `Referrer-Policy: strict-origin-when-cross-origin`, `Permissions-Policy: camera=(), microphone=(), geolocation=(), payment=()`, `Content-Security-Policy: default-src 'none'; frame-ancestors 'none'` (not on `/docs`), `X-Powered-By: LEUKOTEX`, HSTS on HTTPS.

### CORS
Allowed origins: `http://localhost:5173`, `http://127.0.0.1:5173`, `http://localhost:3000` (configured via `CORS_ORIGINS`). Wildcard `*` is rejected. Credentials allowed. Preflight: `GET, POST, PUT, PATCH, DELETE, OPTIONS`.

### GZip
Responses >1KB are gzip-compressed (`Content-Encoding: gzip`).

### Error Envelope
| Status | Body |
|--------|------|
| 400, 401, 403, 404, 429, 500 | `{ detail: string, status_code: number, path: string }` (plus `Retry-After` header for 429) |
| 422 Validation | `{ detail: "Validation failed", errors: [{ field: "body.email", message: "...", type: "value_error" }], status_code: 422 }` |
| 500 Unhandled | `{ detail: "Internal server error. Our team has been notified.", status_code: 500 }` (no stack trace) |

### Rate Limiting (new — 2026-09-05)
| Endpoint | Limit | Exceeded |
|----------|-------|----------|
| `POST /api/contact` | 5 req/min + 20 req/hr per IP | `429 Too Many Requests` `{ detail: "Rate limit exceeded. ... Retry after 60 seconds.", status_code: 429 }` + `Retry-After: 60` |
| `POST /api/auth/login` | 10 req/min + 30 req/5min per IP | Same 429 |
| `POST /api/auth/token` | Same as login | Same |

Frontend: show "You're sending messages too quickly. Please wait ~60 seconds." when 429 is received (see `REQUEST TO ANTIGRAVITY` in `OPENCODE_STATUS.md`).

---

## SYSTEM

### GET / — Root
```json
// Response 200
{ "studio": "LEUKOTEX Creative Development Studio", "system": "FastAPI + PostgreSQL + SQLAlchemy", "docs": "/docs", "redoc": "/redoc", "api_v1": "/api", "health": "/api/health" }
```

### GET /health — Liveness (no auth, no prefix)
```json
// Response 200
{ "status": "ok" }
```

### GET /api/health — Health with DB probe
```json
// Response 200
{ "status": "healthy" | "degraded", "service": "LEUKOTEX Studio API", "version": "1.0.0", "database": "connected" | "disconnected", "dialect": "postgresql" }
```
`status` is `healthy` only if `SELECT 1` succeeds.

### GET /api/openapi.json — OpenAPI schema
Use for codegen. Authenticated via `Bearer` scheme.

---

## PUBLIC ENDPOINTS (Used by Frontend Today)

### GET /api/projects — List projects
```http
GET /api/projects?category=3d-websites&featured=true&search=Nexus&skip=0&limit=50
```
Query (all optional):
- `category` string (max 100) — filters `Project.category` ILIKE OR `category_slug` ILIKE; `"all"` (case-insensitive) is ignored; `%`/`_` are escaped.
- `featured` boolean — `true`/`false`
- `search` string (max 100) — ILIKE across `title`, `client`, `description`; `%`/`_` escaped.
- `skip` int ≥0 default 0
- `limit` int 1–100 default 50
```json
// Response 200 — Project[]
[{ "id": "proj-1", "slug": "nexus-protocol", "title": "Nexus Protocol", "year": "2024", "category": "3D Website", "categorySlug": "3d-websites", "description": "...", "fullDescription": "...", "tags": ["WebGL"], "thumbnail": "https://...", "liveUrl": "https://...", "client": "Nexus Global Alpha", "featured": true, "createdAt": "2026-09-05T...", "updatedAt": "2026-09-05T..." }]
```
Frontend fallback: `frontend/src/data/projects.ts` → `INITIAL_PROJECTS`. Frontend sorts by `created_at DESC` server-side; client-side fallback filters by exact `category` or `tags.includes`.

### GET /api/projects/{slug} — Project detail
Path param: `slug` (or UUID `id` — both accepted).
```json
// Success 200 — Project (same shape as above)
// Failure 404 — { detail: "Project with slug or ID '...' not found", status_code: 404, path: "/api/projects/..." }
```
Frontend fallback: `INITIAL_PROJECTS.find(p.slug === slug)`.

### GET /api/services — List services
```json
// Response 200 — ServiceResponse[]
[{ "id": "serv-1", "number": "01", "title": "3D Web Experiences", "shortDesc": "...", "fullDesc": "...", "tags": ["WebGL"], "image": "https://...", "altText": "..." }]
```
Ordered by `number ASC`. Frontend fallback: `frontend/src/data/services.ts` → `SERVICES_DATA`.

### GET /api/services/{service_id_or_number} — Service detail
Path param: `id` OR `number` (e.g., `"01"` or `"serv-1"`).
```json
// Success 200 — ServiceResponse
// Failure 404 — { detail: "Service '...' not found", status_code: 404 }
```
Frontend fallback: `SERVICES_DATA.find(s.id === id || s.number === number)`.

### POST /api/contact — Submit inquiry (ContactForm)
Rate limited: 5/min + 20/hr → `429` see Global Behaviors.
```json
// Request
{
  "name": "Astrid Lindgren",          // string min 2 max 150
  "email": "astrid@example.com",      // EmailStr
  "projectType": "Interactive Web Design", // alias for project_type, string min 2 max 100
  "description": "We are creating...",     // string min 10 max 5000
  "budget": "50k+"                  // string max 50 (e.g., "10k-25k", "25k-50k", "50k+")
}
// Note: send exactly "projectType" (camelCase). Backend accepts both via populate_by_name but frontend sends projectType.
```
```json
// Success 201 — inquiry IS saved even if email notification fails (email is side-effect)
{ "success": true, "message": "Your inquiry has been received. Our studio will connect with you within 24 hours.", "inquiry_id": "uuid" }
// Validation Failure 422
{ "detail": "Validation failed", "errors": [{ "field": "body.email", "message": "value is not a valid email address: ...", "type": "value_error" }, { "field": "body.description", "message": "String should have at least 10 characters", "type": "string_too_short" }], "status_code": 422 }
// Rate Limited 429
{ "detail": "Rate limit exceeded. Too many requests. Retry after 60 seconds.", "status_code": 429, "path": "/api/contact" } + header Retry-After: 60
```
Frontend usage (existing): `frontend/src/services/api.ts:api.submitContact(data)` → `POST http://127.0.0.1:8000/api/contact`. Handles 422 via `errorData.detail` and shows confetti on success. **New**: should handle 429 with friendly wait message.
No fallback — this endpoint must be live.

---

## AUTHENTICATED ENDPOINTS (Admin — Not Yet Used by Frontend)

### POST /api/auth/login — JSON login (primary)
Rate limited: 10/min + 30/5min → `429`.
```json
// Request
{ "email": "admin@leukotex.com", "password": "YourSecurePassword!" }
// Success 200
{ "access_token": "eyJ...", "token_type": "bearer", "expires_in": 86400 }
// Failures
// 401 { detail: "Incorrect email or password", status_code: 401, path: "/api/auth/login" } (+ header WWW-Authenticate: Bearer)
// 400 { detail: "User account is inactive", status_code: 400 }
// 429 { detail: "Rate limit exceeded...", status_code: 429 } + Retry-After
```

### POST /api/auth/token — OAuth2 form login (Swagger UI)
Rate limited same as login. For `tokenUrl` discovery — do not use from frontend code.
```http
POST /api/auth/token
Content-Type: application/x-www-form-urlencoded
username=admin@leukotex.com&password=...
// username may be email OR username
// Success 200 — same Token shape as /auth/login
```

### GET /api/auth/me — Current user profile
```http
GET /api/auth/me
Authorization: Bearer <token>
```
```json
// Success 200
{ "id": "uuid", "email": "admin@leukotex.com", "username": "admin", "is_admin": true, "is_active": true, "created_at": "2026-...", "updated_at": "2026-..." }
// Failures
// 401 { detail: "Authentication token missing" | "Invalid or expired authentication credentials", status_code: 401 } + WWW-Authenticate: Bearer
// 404 { detail: "User not found", status_code: 404 }
// 400 { detail: "Inactive user account", status_code: 400 }
```

### POST /api/auth/change-password — Change own password
```http
POST /api/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json
{ "current_password": "old...", "new_password": "new...min6chars" }
```
```json
// Success 200
{ "success": true, "message": "Password changed successfully" }
// Failures: 401 (auth), 400 { detail: "Incorrect current password" }, 422 (new_password min 6)
```

### POST /api/admin/users — Create secondary admin (Admin only)
```http
POST /api/admin/users
Authorization: Bearer <admin_token>
Content-Type: application/json
{ "email": "new@leukotex.com", "username": "new_admin", "password": "min6chars", "is_admin": true, "is_active": true }
```
```json
// Success 201 — UserResponse (same as /auth/me)
// Failures
// 401/403 (not admin), 400 { detail: "User with this email already exists" }, 400 { detail: "User with this username already exists" }, 422 validation
```

---

## ADMIN ENDPOINTS (Require `Authorization: Bearer <admin_token>` + `is_admin: true` → else 403)

### GET /api/admin/overview — Telemetry dashboard
```json
// Success 200
{
  "system": { "database_dialect": "postgresql", "status": "operational", "environment": "active" },
  "metrics": {
    "projects": { "total": 4, "featured": 2, "categories": { "3D Website": 2, "Portfolio": 1, "Interactive": 1 } },
    "inquiries": { "total": 12, "new": 3, "in_review": 2, "contacted": 5, "recent": [{ "id": "...", "name": "...", "email": "...", "projectType": "...", "status": "new", "createdAt": "2026-..." }] },
    "services": { "total": 4 }
  }
}
// Failure 401 { detail: "Authentication token missing" / "Invalid or expired..." }  403 { detail: "Administrator privileges required" }
```

### Projects — Admin CRUD
```http
POST   /api/admin/projects         → Create
PUT    /api/admin/projects/{id}   → Update (id OR slug)
DELETE /api/admin/projects/{id}   → Delete (id OR slug)
```
- Create: `POST /api/admin/projects` + `Authorization` + `ProjectCreate` body
  ```json
  // ProjectCreate (example)
  { "slug": "synthetic-horizon", "title": "Synthetic Horizon", "year": "2025", "category": "Interactive", "categorySlug": "interactive", "description": "...", "fullDescription": "...", "tags": ["Three.js"], "thumbnail": "https://...", "liveUrl": "https://...", "client": "Aura", "featured": false }
  // Success 201 — ProjectResponse
  // Failure 400 { detail: "Project with slug '...' already exists." }, 401/403, 422
  ```
- Update: `PUT /api/admin/projects/{project_id}` + `ProjectUpdate` (all optional fields)
  ```json
  // ProjectUpdate
  { "title": "Updated", "description": "New desc", "featured": true }
  // Success 200 — ProjectResponse  // Failure 404 { detail: "Project not found" }, 401/403
  ```
- Delete: `DELETE /api/admin/projects/{project_id}`
  ```json
  // Success 200 { "success": true, "message": "Project '...' deleted successfully" }
  // Failure 404
  ```

### Services — Admin CRUD
```http
POST   /api/admin/services         → Create (check number unique)
PUT    /api/admin/services/{id}   → Update by UUID id only
DELETE /api/admin/services/{id}   → Delete by UUID id only
```
- Create: `{ "number": "05", "title": "...", "shortDesc": "...", "fullDesc": "...", "tags": ["..."], "image": "https://...", "altText": "..." }` → 201 or 400 `Service with number '05' already exists`
- Update: `PUT /api/admin/services/{id}` + `ServiceUpdate` (optional fields) → 200 or 404
- Delete: `DELETE /api/admin/services/{id}` → 200 `{ success, message }` or 404
- All require `Authorization: Bearer <admin_token>`; unauthenticated → 401

### Inquiries — Admin Management
```http
GET    /api/admin/inquiries/stats               → Aggregated counts
GET    /api/admin/inquiries?status=&search=&skip=&limit= → List with filters
GET    /api/admin/inquiries/{inquiry_id}       → Single detail
PATCH  /api/admin/inquiries/{inquiry_id}/status → Update status + notes
DELETE /api/admin/inquiries/{inquiry_id}       → Delete
```
- `GET /api/admin/inquiries/stats` — `InquiryStatsResponse` `{ total, new, in_review, contacted, archived }` — static route (registered before dynamic `{inquiry_id}` to avoid collision; tests verify ordering)
- `GET /api/admin/inquiries?status=new&search=Astrid&skip=0&limit=50` — query: `status` enum (`new|in_review|contacted|archived`), `search` ILIKE across `name|email|project_type` (escaped), `skip` ≥0, `limit` 1–100; ordered `created_at DESC`; → `InquiryResponse[]`
- `GET /api/admin/inquiries/{inquiry_id}` — `InquiryResponse` or 404 `{ detail: "Inquiry not found" }`
- `PATCH /api/admin/inquiries/{inquiry_id}/status` — body `{ status: "new|in_review|contacted|archived", notes?: string }` → 200 `InquiryResponse` or 404/422
- `DELETE /api/admin/inquiries/{inquiry_id}` → 200 `{ success: true, message: "Inquiry deleted successfully" }` or 404

**InquiryResponse shape:**
```json
{ "id": "uuid", "name": "Astrid Lindgren", "email": "astrid@example.com", "projectType": "Interactive Web Design", "description": "...", "budget": "25k-50k", "status": "new", "notes": "..." | null, "created_at": "2026-...", "updated_at": "2026-..." }
```

---

## FRONTEND TYPES (Authoritative)

```typescript
type ProjectCategory = 'All' | '3D Websites' | 'Portfolio' | 'Interactive';
interface Project {
  id: string; slug: string; title: string; year: string;
  category: string;
  categorySlug: '3d-websites' | 'portfolio' | 'interactive';
  description: string; fullDescription?: string; tags: string[];
  thumbnail: string; liveUrl?: string; client?: string; featured?: boolean;
  // server also returns: createdAt, updatedAt (ISO strings)
}
interface ServiceItemData {
  id: string; number: string; title: string;
  shortDesc: string; fullDesc: string; tags: string[]; image: string; altText: string;
}
interface TimelinePhase { phase: string; title: string; subtitle: string; description: string; }
interface ArsenalItem { name: string; icon: string; category: 'tech' | 'discipline'; }
interface ContactFormData {
  name: string; email: string; projectType: string; description: string; budget: '10k-25k' | '25k-50k' | '50k+' | string;
}
type FormStatus = 'idle' | 'loading' | 'success' | 'error';
// Backend auth
interface Token { access_token: string; token_type: "bearer"; expires_in: number; }
interface UserResponse { id: string; email: string; username: string; is_admin: boolean; is_active: boolean; created_at: string; updated_at: string; }
```

---

## ENV & CONFIG

```env
# backend/.env — never commit (gitignored)
DATABASE_URL="postgresql://postgres:***@localhost:5432/leukotex_db"
SECRET_KEY="openssl rand -hex 32"  # ≥32 chars
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440
CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"
RESEND_API_KEY="re_..."            # server-side only
EMAIL_FROM="LEUKOTEX Inquiries <onboarding@resend.dev>"
EMAIL_TO="dina16in@gmail.com"
VITE_API_URL="http://127.0.0.1:8000/api"  # frontend/.env
```

---

## CHANGE HISTORY (Contract-Relevant)
- **2026-09-05 17:05** — Added rate limiting (429 + Retry-After), structured 422 errors, security headers, GZip, health DB probe, LIKE escaping, redacted DB logs. `POST /api/contact` now always 201 even when email fails (inquiry is primary resource). Fixed `oauth2_scheme` tokenUrl to `/api/auth/token`.
- **2026-09-05 11:25** — Initial contract from frontend inspection.
