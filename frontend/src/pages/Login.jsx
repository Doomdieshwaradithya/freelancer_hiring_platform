import { useState } from 'react'
import { Link, useNavigate, useLocation, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { login } from '../api/auth.js'
import toast from 'react-hot-toast'
import { FiMail, FiLock } from 'react-icons/fi'

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
    <div className="max-w-md mx-auto animate-fade-in py-4">
      <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-teal-100 p-8 md:p-10 transition-all hover:shadow-2xl hover:shadow-teal-200/30">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Welcome back</h2>
          <p className="text-stone-500">Sign in to continue to HirePro</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-teal-500 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••"
                className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all duration-200"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-teal-500 to-teal-600 text-white py-3 rounded-xl font-semibold hover:from-teal-600 hover:to-teal-700 disabled:opacity-70 transition-all duration-200 shadow-lg shadow-teal-500/25 hover:shadow-xl active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </span>
            ) : (
              'Login'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-stone-500">
          Don&apos;t have an account?{' '}
          <Link to="/register" className="text-violet-600 font-semibold hover:text-violet-700 hover:underline transition-colors">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  )
}
