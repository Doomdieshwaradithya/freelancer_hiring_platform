import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { register } from '../api/auth.js'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiLock, FiBriefcase, FiUserCheck, FiZap, FiArrowRight, FiCheck } from 'react-icons/fi'

function getErrorMessage(err, fallback) {
  const data = err?.response?.data
  if (data?.error) return data.error
  if (data?.message) return data.message
  return fallback
}

export function Register() {
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState('freelancer')
  const [loading, setLoading] = useState(false)
  const { user, loading: authLoading, login: setAuth } = useAuth()
  const navigate = useNavigate()

  if (user && !authLoading) {
    const to = user.role === 'client' ? '/dashboard' : '/jobs'
    return <Navigate to={to} replace />
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const { data } = await register({ name, email, password, role })
      await setAuth(data.token)
      toast.success('Account created! Welcome to HirePro 🎉')
      navigate(role === 'client' ? '/post-job' : '/jobs', { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Registration failed'))
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

        <div className="bg-zinc-900 rounded-2xl shadow-xl shadow-black/40 border border-zinc-800 p-8 text-zinc-200">
          <div className="text-center mb-7">
            <h1 className="text-2xl font-bold text-white mb-1.5">Create your account</h1>
            <p className="text-zinc-500 text-sm">Join thousands of clients and freelancers</p>
          </div>

          {/* Role toggle */}
          <div className="grid grid-cols-2 gap-3 mb-6 p-1 bg-zinc-950 rounded-xl border border-zinc-800">
            {[
              { value: 'freelancer', label: 'Freelancer', icon: FiUserCheck },
              { value: 'client', label: 'Client', icon: FiBriefcase },
            ].map(({ value, label, icon: Icon }) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`flex items-center justify-center gap-2 py-2.5 rounded-lg text-sm font-semibold transition-all duration-200 ${role === value
                  ? 'bg-zinc-800 text-rose-500 shadow-sm'
                  : 'text-zinc-500 hover:text-zinc-300'
                  }`}
              >
                <Icon className="w-4 h-4" />
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-zinc-300">Full name</label>
              <div className="relative">
                <FiUser className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500 w-4 h-4" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                  placeholder="Your name"
                  className="w-full pl-10 pr-4 py-3 border border-zinc-800 rounded-xl bg-zinc-950 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

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
                  minLength={6}
                  placeholder="Min. 6 characters"
                  className="w-full pl-10 pr-4 py-3 border border-zinc-800 rounded-xl bg-zinc-950 text-white placeholder-zinc-600 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full flex items-center justify-center gap-2 bg-rose-600 hover:bg-rose-700 text-white font-semibold py-3 rounded-xl shadow-md shadow-rose-600/25 hover:shadow-lg hover:shadow-rose-600/30 hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200 mt-2"
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Creating account...
                </>
              ) : (
                <>Create Account <FiArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          {/* Trust badges */}
          <div className="mt-5 flex items-center justify-center gap-4 text-xs text-zinc-500">
            {['Free forever', 'No credit card', 'Cancel anytime'].map((t) => (
              <span key={t} className="flex items-center gap-1">
                <FiCheck className="w-3 h-3 text-emerald-500" /> {t}
              </span>
            ))}
          </div>

          <p className="mt-5 text-center text-sm text-zinc-500">
            Already have an account?{' '}
            <Link to="/login" className="text-rose-500 font-semibold hover:text-rose-600 transition-colors">
              Sign in
            </Link>
          </p>
        </div>
      </div>

    </div>
  )
}
