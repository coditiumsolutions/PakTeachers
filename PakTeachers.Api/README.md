# PakTeachers API

**Next-generation Virtual Educational Management System (VEMS) backend.** A production-ready ASP.NET Core 10 Web API powering student enrollment, course delivery, live sessions, assessments, payments, and adaptive configuration — all behind role-based JWT authentication.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Runtime | .NET 10 / ASP.NET Core 10 |
| ORM | Entity Framework Core 10 (SQL Server) |
| Auth | JWT Bearer (`Microsoft.AspNetCore.Authentication.JwtBearer`) |
| Caching | `IMemoryCache` (in-process, zero-latency config lookups) |
| Password Hashing | BCrypt.Net-Next |
| Object Mapping | AutoMapper 16 |
| API Docs | Scalar UI (`/scalar/v1` in Development) |
| Serialisation | `System.Text.Json` (default ASP.NET Core pipeline) |

---

## Core Architecture Highlights

### Configuration Engine

All controlled vocabularies (`grade_level`, `course_type`, `payment_method`, `assessment_status`, etc.) are stored in a single `Configurations` table using a **JSON-per-key schema**: each row holds a configuration key, a human-readable label, and a JSON array of `{ value, label, isActive }` objects.

- Cache is populated at startup via `RefreshCacheAsync()` and is automatically refreshed after every write operation.
- `IConfigurationService.IsValid(key, value)` reads exclusively from `IMemoryCache` — zero database I/O per request.
- Admins can add, remove, toggle, or relabel values at runtime without a deployment.

### Auto-Validation Pipeline

A **global `IAsyncActionFilter`** (`ConfigValidationFilter`) intercepts every controller action before it runs:

1. Reflects over all bound DTO arguments.
2. Finds properties decorated with `[ConfigValidation("config_key")]`.
3. Calls `IsValid()` for each decorated value (cache-only — no DB latency).
4. Aggregates **all** failures into a single `422 Unprocessable Entity` response showing every invalid field at once.

```json
{
  "success": false,
  "message": "Validation failed",
  "source": "ConfigValidationFilter",
  "errors": {
    "GradeLevel": "Invalid value 'grade13' for configuration key 'grade_level'.",
    "City": "Invalid value 'atlantis' for configuration key 'city'."
  }
}
```

The `AllowNull = true` flag on optional properties skips validation when the field is absent; non-null values are still validated. This replaces dozens of per-service `IsValid()` calls that previously returned one error at a time.

---

## API Documentation

Interactive docs are available at **`/scalar/v1`** when running in Development mode.

### Endpoint Groups

| Group | Base Path | Description |
|-------|-----------|-------------|
| Auth | `POST /api/auth/login` | JWT token issuance |
| Config | `GET /api/config` | Controlled-vocabulary management |
| Students | `/api/students` | Student accounts and sub-resources |
| Teachers | `/api/teachers` | Teacher profiles |
| Admins | `/api/admins` | Admin account management |
| Courses | `/api/courses` | Course catalogue |
| Modules | `/api/modules` | Course module structure |
| Lessons | `/api/lessons` | Lesson delivery |
| Enrollments | `/api/enrollments` | Student-to-course enrolments |
| Assessments | `/api/assessments` | Assessment creation and grading |
| Submissions | `/api/submissions` | Assessment submission workflow |
| Payments | `/api/payments` | Payment lifecycle and analytics |
| Live Sessions | `/api/live-sessions` | Scheduled live class management |
| Trial Classes | `/api/trial-classes` | Free trial bookings |
| Progress | `/api/progress` | Lesson watch-time and completion tracking |

### Standard Response Envelope

Every endpoint returns `ApiResponse<T>`:

```json
{
  "success": true,
  "message": "optional message",
  "data": { },
  "warnings": []
}
```

Errors follow the same shape with `"success": false` and a non-null `"message"`.

---

## Setup Guide

### Prerequisites

- .NET 10 SDK
- SQL Server (LocalDB or `TAZ\SQLEXPRESS` instance)

### 1. Configure Secrets

Connection string and JWT settings are stored in .NET User Secrets (never in `appsettings.json`):

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=TAZ\SQLEXPRESS;Database=PakTeachers;Trusted_Connection=True;TrustServerCertificate=True;"
dotnet user-secrets set "Jwt:Key"      "<your-256-bit-secret>"
dotnet user-secrets set "Jwt:Issuer"   "PakTeachersApi"
dotnet user-secrets set "Jwt:Audience" "PakTeachersClient"
```

Or run the included helper script (PowerShell):

```powershell
.\setup-secrets.ps1
```

### 2. Apply Migrations

```bash
dotnet ef database update
```

### 3. Run the API

```bash
dotnet run
```

The API starts on:
- HTTP: `http://localhost:5065`

Scalar UI: `https://localhost:5065/scalar/v1`

---

## Current Status

**Phase 1 Complete — Robust Backend Architecture**

- Full domain model (13 entities)
- JWT authentication with role-based and resource-based policies
- 15 controller groups with complete CRUD and sub-resource endpoints
- Configuration Engine with live cache and dynamic reference validation
- Auto-Validation Pipeline replacing all manual vocabulary checks
- Scalar API documentation with XML summary annotations

**Frontend Integration — In Progress**

- JWT auth system connected (login, profile hydration, logout)
- Role-based route protection on React side (`student`, `teacher`, `admin`/`super_admin`/`support`)
- Axios interceptor handles 401 (session expiry) and 403 (forbidden) with SweetAlert2 modals
- Remaining: course delivery UI, live session scheduling, student progress views

---

## Developed by

- **Rayder-23**
- **Coditium Solutions**

---