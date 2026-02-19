import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { FiLogOut, FiBriefcase, FiUser } from 'react-icons/fi'

export function Layout({ children }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  const handleLogout = () => {
    logout()
    navigate('/')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-50 via-amber-50/30 to-teal-50/40">
      <header className="bg-white/80 backdrop-blur-md border-b border-stone-200 shadow-sm sticky top-0 z-40">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-xl font-bold bg-gradient-to-r from-teal-600 to-violet-600 bg-clip-text text-transparent hover:opacity-90 transition">
            HirePro
          </Link>
          <nav className="flex items-center gap-6">
            <Link to="/jobs" className="text-stone-600 hover:text-teal-600 transition-colors font-medium">
              Browse Jobs
            </Link>
            {user ? (
              <>
                {user.role === 'client' && (
                  <>
                    <Link to="/post-job" className="text-stone-600 hover:text-teal-600 transition-colors font-medium">
                      Post Job
                    </Link>
                    <Link to="/dashboard" className="text-stone-600 hover:text-teal-600 flex items-center gap-1 transition-colors font-medium">
                      <FiBriefcase /> My Jobs
                    </Link>
                  </>
                )}
                {user.role === 'freelancer' && (
                  <Link to="/my-applications" className="text-stone-600 hover:text-teal-600 flex items-center gap-1 transition-colors font-medium">
                    <FiUser /> My Applications
                  </Link>
                )}
                <div className="flex items-center gap-3 pl-4 border-l border-stone-200">
                  <span className="text-sm text-stone-600 font-medium">{user.name}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-1 text-stone-600 hover:text-rose-600 transition-colors text-sm font-medium"
                  >
                    <FiLogOut /> Logout
                  </button>
                </div>
              </>
            ) : (
              <>
                <Link to="/login" className="text-stone-600 hover:text-violet-600 transition-colors font-medium">
                  Login
                </Link>
                <Link
                  to="/register"
                  className="bg-gradient-to-r from-teal-500 to-teal-600 text-white px-5 py-2 rounded-xl hover:from-teal-600 hover:to-teal-700 shadow-lg shadow-teal-500/25 transition-all font-semibold"
                >
                  Sign Up
                </Link>
              </>
            )}
          </nav>
        </div>
      </header>
      <main className="max-w-6xl mx-auto px-4 py-8">{children}</main>
    </div>
  )
}
