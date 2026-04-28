import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { authApi, type UserProfileDTO } from '../lib/api'
import { alertSessionExpired, alertAccessDenied, alertLoggedOut } from '../lib/alertService'

// ── Role helpers ───────────────────────────────────────────────────────────────

export type NormalizedRole = 'student' | 'teacher' | 'admin' | null

function normalizeRole(raw: string): NormalizedRole {
  const r = raw.toLowerCase()
  if (r === 'student') return 'student'
  if (r === 'teacher') return 'teacher'
  if (r === 'super_admin' || r === 'support' || r === 'admin') return 'admin'
  return null
}

export function roleToRoute(role: NormalizedRole): string {
  if (role === 'student') return '/student-dashboard'
  if (role === 'teacher') return '/teacher-dashboard'
  return '/admin-dashboard'
}

// ── Context shape ──────────────────────────────────────────────────────────────

export interface AuthUser {
  id: number
  username: string
  fullName: string
  role: NormalizedRole
}

interface AuthContextValue {
  user: AuthUser | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (username: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

// ── Provider ───────────────────────────────────────────────────────────────────

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate()
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const unauthorizedBound = useRef(false)

  const clearAuth = useCallback(() => {
    localStorage.removeItem('pt_token')
    setUser(null)
  }, [])

  // Hydrate from token in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem('pt_token')
    if (!token) {
      setIsLoading(false)
      return
    }

    authApi.me()
      .then(({ data }) => {
        if (data.success && data.data) {
          const p: UserProfileDTO = data.data
          setUser({
            id: p.id,
            username: p.username,
            fullName: p.fullName,
            role: normalizeRole(p.role),
          })
        } else {
          clearAuth()
        }
      })
      .catch(() => clearAuth())
      .finally(() => setIsLoading(false))
  }, [clearAuth])

  // Handle 401/403 events from the Axios interceptor
  useEffect(() => {
    if (unauthorizedBound.current) return
    unauthorizedBound.current = true

    const handle401 = (e: Event) => {
      const message = (e as CustomEvent<{ message: string | null }>).detail?.message
      clearAuth()
      void alertSessionExpired(message).then(() => navigate('/lms', { replace: true }))
    }

    const handle403 = (e: Event) => {
      const message = (e as CustomEvent<{ message: string | null }>).detail?.message
      setUser((currentUser) => {
        const dest = currentUser ? roleToRoute(currentUser.role) : '/lms'
        navigate(dest, { replace: true })
        void alertAccessDenied(message)
        return currentUser
      })
    }

    window.addEventListener('pt:unauthorized', handle401)
    window.addEventListener('pt:forbidden', handle403)
    return () => {
      window.removeEventListener('pt:unauthorized', handle401)
      window.removeEventListener('pt:forbidden', handle403)
    }
  }, [clearAuth, navigate])

  const login = useCallback(async (username: string, password: string) => {
    const { data } = await authApi.login({ username, password })

    if (!data.success || !data.data) {
      throw new Error(data.message ?? 'Login failed')
    }

    const auth = data.data
    localStorage.setItem('pt_token', auth.token)

    // Fetch full profile to populate AuthUser
    const { data: profileRes } = await authApi.me()
    if (profileRes.success && profileRes.data) {
      const p: UserProfileDTO = profileRes.data
      const role = normalizeRole(p.role)
      setUser({ id: p.id, username: p.username, fullName: p.fullName, role })
      navigate(roleToRoute(role), { replace: true })
    }
  }, [navigate])

  const logout = useCallback(async () => {
    try {
      await authApi.logout()
    } catch {
      // best-effort — clear locally regardless
    }
    clearAuth()
    await alertLoggedOut()
    navigate('/lms', { replace: true })
  }, [clearAuth, navigate])

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

// ── Hook ───────────────────────────────────────────────────────────────────────

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside <AuthProvider>')
  return ctx
}
