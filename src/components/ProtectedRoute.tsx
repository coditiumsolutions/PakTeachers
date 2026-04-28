import { Navigate } from 'react-router-dom'
import { useAuth, type NormalizedRole, roleToRoute } from '../context/AuthContext'

interface Props {
  allowedRole: NormalizedRole
  children: React.ReactNode
}

export function ProtectedRoute({ allowedRole, children }: Props) {
  const { user, isLoading } = useAuth()

  if (isLoading) return null

  if (!user) return <Navigate to="/lms" replace />

  if (user.role !== allowedRole) return <Navigate to={roleToRoute(user.role)} replace />

  return <>{children}</>
}
