import { useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth, type NormalizedRole, roleToRoute } from '../context/AuthContext'
import { alertAccessDenied } from '../lib/alertService'

interface Props {
  allowedRole: NormalizedRole
  children: React.ReactNode
}

export function ProtectedRoute({ allowedRole, children }: Props) {
  const { user, isLoading } = useAuth()
  const navigate = useNavigate()
  const alerted = useRef(false)

  useEffect(() => {
    if (isLoading || alerted.current) return

    if (!user) {
      navigate('/lms', { replace: true })
      return
    }

    if (user.role !== allowedRole) {
      alerted.current = true
      navigate(roleToRoute(user.role), { replace: true })
      void alertAccessDenied()
    }
  }, [isLoading, user, allowedRole, navigate])

  // Synchronous render — no state, no flicker on the happy path
  if (isLoading || !user || user.role !== allowedRole) return null
  return <>{children}</>
}
