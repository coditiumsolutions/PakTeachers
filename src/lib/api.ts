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

// On 401 — clear local auth state and redirect to /lms
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('pt_token')
      // Dispatch a custom event so AuthContext can react without a circular dep
      window.dispatchEvent(new CustomEvent('pt:unauthorized'))
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
