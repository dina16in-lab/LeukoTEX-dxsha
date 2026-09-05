# LEUKOTEX Studio Backend API

High-performance, production-ready backend API for LEUKOTEX Immersive Creative Studio.

---

## 1. Architecture

```
React (TypeScript + Vite)
  ↓
FastAPI (Python REST API)
  ↓
SQLAlchemy (ORM & Connection Pooling)
  ↓
PostgreSQL 18 (Relational Database)
  ↓
pgAdmin 4 (Database Management)
```

- **PostgreSQL 18 Only**: Strictly connects to PostgreSQL. SQLite fallback has been completely removed.
- **JWT Authentication**: Role-based access control with Bcrypt password hashing.
- **Static Route Ordering**: Specific endpoints (e.g., `/admin/inquiries/stats`) are registered ahead of dynamic parameter endpoints (e.g., `/admin/inquiries/{inquiry_id}`).

---

## 2. Configuration (`.env`)

Configure your PostgreSQL 18 connection and security parameters in `backend/.env`:

```env
# Application Settings
PROJECT_NAME="LEUKOTEX Studio API"
ENVIRONMENT="development"
DEBUG=True
API_V1_STR="/api"

# PostgreSQL 18 Database URL
DATABASE_URL="postgresql://postgres:your_password@localhost:5432/leukotex_db"

# Security & JWT Token
SECRET_KEY="your-secret-key"
ALGORITHM="HS256"
ACCESS_TOKEN_EXPIRE_MINUTES=1440

# Allowed CORS Origins
CORS_ORIGINS="http://localhost:5173,http://127.0.0.1:5173,http://localhost:3000"

# Resend Email Configuration (Server-side only)
RESEND_API_KEY="re_your_api_key"
EMAIL_FROM="LEUKOTEX Inquiries <onboarding@resend.dev>"
EMAIL_TO="dina16in@gmail.com"
```

---

## 3. Secure Admin Account Creation

Admin accounts are created securely via the CLI. Default or hardcoded admin passwords are not allowed.

```powershell
# Interactive mode (prompts for name, email, and masked password)
python -m app.create_admin

# Or with CLI flags:
python -m app.create_admin --name "admin" --email "admin@leukotex.com" --password "YourSecurePassword!"
```

---

## 4. Running the Application

```powershell
# Activate virtual environment
.venv\Scripts\activate

# Run FastAPI development server (port 8000)
python run.py
```

- **API Documentation (Swagger UI)**: http://localhost:8000/docs
- **API Documentation (ReDoc)**: http://localhost:8000/redoc
- **Health Check**: http://localhost:8000/api/health

---

## 5. Running Automated Tests

Run the full pytest suite:

```powershell
.venv\Scripts\python -m pytest -v
```

---

## 6. Endpoints Overview

| Module | Method | Path | Description | Access |
| :--- | :--- | :--- | :--- | :--- |
| **System** | `GET` | `/` | Root info | Public |
| **System** | `GET` | `/api/health` | Health check | Public |
| **Auth** | `POST` | `/api/auth/login` | JSON login returning JWT | Public |
| **Auth** | `POST` | `/api/auth/token` | OAuth2 form login for Swagger | Public |
| **Auth** | `GET` | `/api/auth/me` | Current user profile | Authenticated |
| **Auth** | `POST` | `/api/auth/change-password` | Update user password | Authenticated |
| **Admin** | `POST` | `/api/admin/users` | Create secondary admin account | Admin |
| **Admin** | `GET` | `/api/admin/overview` | Studio telemetry & metrics | Admin |
| **Projects** | `GET` | `/api/projects` | List projects (with filters) | Public |
| **Projects** | `GET` | `/api/projects/{slug}` | Project detail by slug | Public |
| **Projects** | `POST` | `/api/admin/projects` | Create project | Admin |
| **Projects** | `PUT` | `/api/admin/projects/{id}` | Update project | Admin |
| **Projects** | `DELETE` | `/api/admin/projects/{id}`| Delete project | Admin |
| **Services** | `GET` | `/api/services` | List studio offerings | Public |
| **Services** | `GET` | `/api/services/{id_or_num}`| Single service by number or ID | Public |
| **Services** | `POST` | `/api/admin/services` | Create service | Admin |
| **Services** | `PUT` | `/api/admin/services/{id}` | Update service | Admin |
| **Services** | `DELETE` | `/api/admin/services/{id}` | Delete service | Admin |
| **Inquiries** | `POST` | `/api/contact` | Submit contact form | Public |
| **Inquiries** | `GET` | `/api/admin/inquiries/stats` | Inquiry statistics aggregation | Admin |
| **Inquiries** | `GET` | `/api/admin/inquiries` | List inquiries with filters | Admin |
| **Inquiries** | `GET` | `/api/admin/inquiries/{id}` | Single inquiry detail | Admin |
| **Inquiries** | `PATCH` | `/api/admin/inquiries/{id}/status` | Update inquiry status & notes | Admin |
| **Inquiries** | `DELETE` | `/api/admin/inquiries/{id}` | Delete inquiry | Admin |
