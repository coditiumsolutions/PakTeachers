# PakTeachers - Virtual Education Management System

## Project Overview

**PakTeachers** is a virtual schooling platform connecting Pakistani students with certified, experienced teachers for live online classes. The website is a multi-page React app (not a single-page landing) covering academic schooling (Grades 1–12), Quran teaching, trial classes using an LMS.

## Technology Stack

| Category | Technology |
|----------|------------|
| Framework | React 19 |
| Language | TypeScript 5.9 |
| Build Tool | Vite 8 (uses OXC transformer — **ASCII-only in JSX strings**) |
| Styling | Tailwind CSS v4 (`@import "tailwindcss"` in `src/index.css`, `@tailwindcss/vite` plugin — no `tailwind.config.js`) |
| Routing | React Router v7 |
| HTTP Client | Axios 1.x (with request/response interceptors for auth) |
| Auth | JWT Bearer stored in `localStorage` (`pt_token`) |
| Alerts | SweetAlert2 11.x (centralized in `src/lib/alertService.ts`) |
| Linting | ESLint 9.x with TypeScript ESLint |

---

## Quickstart

### Access URLs
- **Frontend Website:** http://localhost:5173
- **Backend API Documentation:** http://localhost:5065/scalar/


### Frontend (Project Root)
```bash
npm run dev       # Start dev server (Vite HMR)
npm run build     # Type-check + production build (tsc -b && vite build)
npm run lint      # ESLint across all TS/TSX files
npm run preview   # Preview the production build locally
```

### Backend (PakTeacher.Api folder)
```bash
cd PakTeacher.Api && dotnet run   # Start the .NET API server
```

## Database

The database is SQL Server, managed by EF Core migrations in the backend project. See the [Backend README](PakTeachers.Api/README.md) for the full setup guide including migrations.

## Environment Variables

- See [.env.example](.env.example) for frontend env vars.

Copy `.env.example` to `.env.local` and fill in values before running the dev server:

```bash
cp .env.example .env.local
```

| Variable | Purpose |
|----------|---------|
| `VITE_API_BASE_URL` | Base URL for the backend API (default: `http://localhost:5065`) |

> Note: `.env.local` is git-ignored. Never commit real values.

#### Configure Secrets

Connection string and JWT settings are stored in .NET User Secrets (never in `appsettings.json`):

```bash
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Server=[COMPUTER]\SQLEXPRESS;Database=PakTeachers;Trusted_Connection=True;TrustServerCertificate=True;"
dotnet user-secrets set "Jwt:Key"      "<your-256-bit-secret>"
dotnet user-secrets set "Jwt:Issuer"   "PakTeachersApi"
dotnet user-secrets set "Jwt:Audience" "PakTeachersClient"
```

Or run the included helper script (PowerShell):

```powershell
.\setup-secrets.ps1
```

- See [Backend Readme](PakTeachers.Api\README.md) for Details.


---

## Developed by

- **Rayder-23**
- **Coditium Solutions**

---
