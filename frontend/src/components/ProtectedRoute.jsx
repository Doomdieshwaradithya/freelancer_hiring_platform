import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'

export function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-zinc-950">
        <div className="text-center">
          <div className="w-10 h-10 border-2 border-rose-500/30 border-t-rose-500 rounded-full animate-spin mx-auto mb-3" />
          <p className="text-zinc-500 font-medium">Loading...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (role && user.role !== role) {
    return <Navigate to={user.role === 'client' ? '/dashboard' : '/jobs'} replace />
  }

  return <>{children}</>
}
