import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { login } from '../api/auth.js'
import toast from 'react-hot-toast'
import { FiMail, FiLock, FiZap, FiArrowRight } from 'react-icons/fi'

function getErrorMessage(err, fallback) {
  const data = err?.response?.data
  if (data?.error) return data.error
  if (data?.message) return data.message
  return fallback
}

export function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading, login: setAuth } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  if (user && !authLoading) {
    const to = user.role === 'client' ? '/dashboard' : '/jobs'
    return <Navigate to={to} replace />
  }

  const getRedirectPath = (userData) => {
    const from = location.state?.from?.pathname
    if (from && from !== '/login' && from !== '/register') return from
    return userData?.role === 'client' ? '/dashboard' : '/jobs'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await login({ email, password })
      await setAuth(data.token)
      toast.success('Welcome back!')
      const path = getRedirectPath({ role: data.role })
      navigate(path, { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Login failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-[calc(100vh-56px)] flex items-center justify-center py-8 px-4">
      <div className="w-full max-w-md animate-slide-up">
        {/* Logo */}
        <div className="flex items-center justify-center mb-8">
          <Link to="/" className="logo-container group">
            <div className="w-10 h-10 logo-icon-glow rounded-xl flex items-center justify-center animate-logo-pulse transition-transform group-hover:scale-110">
              <FiZap className="w-6 h-6 text-white" />
            </div>
            <span className="font-black text-white text-2xl tracking-tighter uppercase italic">QuickSkillr</span>
          </Link>
        </div>

        <div className="bg-zinc-900 rounded-2xl shadow-xl shadow-black/40 border border-zinc-800 p-8">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-white mb-1.5">Welcome back</h1>
            <p className="text-zinc-500 text-sm">Sign in to your account to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Email address</label>
              <div className="relative">
                <FiMail className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="you@example.com"
                  className="w-full pl-10 pr-4 py-3 border border-zinc-800 rounded-xl bg-zinc-950 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Password</label>
              <div className="relative">
                <FiLock className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-3 border border-zinc-800 rounded-xl bg-zinc-950 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-rose-600/25 hover:shadow-lg hover:shadow-rose-600/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </>
              ) : (
                <>Sign In <FiArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-zinc-500">
            Don&apos;t have an account?{' '}
            <Link to="/register" className="text-rose-500 font-semibold hover:text-rose-600 transition-colors">
              Create one free
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}
