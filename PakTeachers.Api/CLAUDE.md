# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
dotnet build                          # Build the project
dotnet run                            # Run API (HTTP :5065, HTTPS :7084)
dotnet watch run                      # Run with hot reload

# Entity Framework migrations
dotnet ef migrations add <Name>       # Create a new migration
dotnet ef database update             # Apply pending migrations
dotnet ef database drop --force       # Drop the database

# First-time setup (PowerShell)
.\setup-secrets.ps1                   # Initializes user secrets with default connection string
```

API docs (Scalar UI) are available at `/scalar/v1` in Development mode.

No test project is configured yet.

## Tech Stack

- **ASP.NET Core 10** Minimal APIs (`Program.cs`) — no controller classes yet
- **Entity Framework Core 10** with SQL Server (`TAZ\SQLEXPRESS`, database `PakTeachers`)
- **Connection string** stored in .NET User Secrets (secret ID `b8e7d99f-baf4-4144-bc98-371fafa23560`); the fallback hardcoded string in `Data/PakTeachersDbContext.cs` is dev-only
- **JWT Bearer** authentication wired up but not yet applied to endpoints
- **BCrypt.Net-Next** for password hashing
- **AutoMapper** for DTO mapping
- **Scalar** for API documentation (replaces Swagger UI)

## Architecture

### Current State

The project is early-stage. `Program.cs` only has the template `/weatherforecast` endpoint. The real work is the domain model and DbContext — all endpoints, services, and DTOs are yet to be built.

### Response Shape

All endpoints must return `ApiResponse<T>` from `Wrappers/ApiResponse.cs`:

```csharp
// Success
new ApiResponse<T>(data, "optional message")

// Failure
new ApiResponse<T>("error message", errorsObject)
```

### Domain Model (`Models/`)

13 entities covering the full LMS domain:

| Entity | Key relationships |
|--------|------------------|
| `Admin` | standalone, role-based |
| `Teacher` | owns `Course`, `Assessment`, `LiveSession` |
| `Student` | has `Enrollment`, `AssessmentSubmission`, `StudentProgress`, `Payment`, `TrialClass` |
| `Course` | belongs to `Teacher`; has `Module` children |
| `Module` | belongs to `Course`; has `Lesson` and `Assessment` children |
| `Lesson` | belongs to `Module`; tracked via `StudentProgress` |
| `Enrollment` | links `Student` ↔ `Course`; unique per pair |
| `Assessment` | belongs to `Module`; has `AssessmentSubmission` children |
| `AssessmentSubmission` | links `Student` ↔ `Assessment` |
| `LiveSession` | belongs to `Course` + `Teacher` |
| `TrialClass` | belongs to `Student` + `Teacher` |
| `Payment` | belongs to `Student` + `Enrollment` |
| `StudentProgress` | links `Student` ↔ `Lesson`; tracks watch time and completion |

See `Data/PakTeachersDbContext.cs` for all FK constraints, unique indexes, and default values.

### Planned Folder Conventions

As features are added, follow this structure:
- `Controllers/` — HTTP endpoint groups by domain (StudentsController, CoursesController, etc.)
- `Services/` — business logic, injected into controllers
- `DTOs/` — request/response shapes mapped via AutoMapper
- `Middlewares/` — cross-cutting concerns (auth, error handling)
