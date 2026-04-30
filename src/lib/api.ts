import axios from 'axios'

// ── Types mirroring backend DTOs ───────────────────────────────────────────────

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  message: string | null
  errors: unknown
  warnings: string[] | null
}

// Login response — token is in the HttpOnly cookie, not in this body
export interface LoginResponseDTO {
  username: string
  role: string
}

export interface UserProfileDTO {
  id: number
  username: string
  fullName: string
  role: string
}

export interface LoginPayload {
  username: string
  password: string
}

// ── Axios instance ─────────────────────────────────────────────────────────────

const api = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' },
  // Critical: instructs the browser to include HttpOnly cookies on every request
  withCredentials: true,
})

// On 401/403 — dispatch custom events so AuthContext can react without a circular dep
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const message: string | null = err.response?.data?.message ?? null

    if (status === 401) {
      window.dispatchEvent(new CustomEvent('pt:unauthorized', { detail: { message } }))
    } else if (status === 403) {
      window.dispatchEvent(new CustomEvent('pt:forbidden', { detail: { message } }))
    }

    return Promise.reject(err)
  }
)

// ── Auth API calls ─────────────────────────────────────────────────────────────

export const authApi = {
  login: (payload: LoginPayload) =>
    api.post<ApiResponse<LoginResponseDTO>>('/api/auth/login', payload),

  me: () =>
    api.get<ApiResponse<UserProfileDTO>>('/api/auth/me'),

  logout: () =>
    api.post<ApiResponse<null>>('/api/auth/logout'),
}

export default api
