import axios from 'axios'

// ── Types mirroring backend DTOs (PascalCase — no AddJsonOptions configured) ──

export interface ApiResponse<T> {
  success: boolean
  data: T | null
  message: string | null
  errors: unknown
  warnings: string[] | null
}

export interface AuthResponseDTO {
  token: string
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
})

// Attach Bearer token from localStorage on every request
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('pt_token')
  if (token) config.headers.Authorization = `Bearer ${token}`
  return config
})

// On 401/403 — dispatch custom events so AuthContext can react without a circular dep
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err.response?.status
    const message: string | null = err.response?.data?.message ?? null

    if (status === 401) {
      localStorage.removeItem('pt_token')
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
    api.post<ApiResponse<AuthResponseDTO>>('/api/auth/login', payload),

  me: () =>
    api.get<ApiResponse<UserProfileDTO>>('/api/auth/me'),

  logout: () =>
    api.post<ApiResponse<null>>('/api/auth/logout'),
}

export default api
