import { useState } from 'react'
import { Link, useNavigate, Navigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext.jsx'
import { register } from '../api/auth.js'
import toast from 'react-hot-toast'
import { FiUser, FiMail, FiLock, FiBriefcase, FiUserCheck } from 'react-icons/fi'

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
      toast.success('Account created!')
      navigate(role === 'client' ? '/post-job' : '/jobs', { replace: true })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Registration failed'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto animate-fade-in py-4">
      <div className="bg-white rounded-2xl shadow-xl shadow-stone-200/50 border border-amber-100 p-8 md:p-10 transition-all hover:shadow-2xl hover:shadow-amber-200/30">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-stone-800 mb-2">Create account</h2>
          <p className="text-stone-500">Join HirePro and start connecting</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Name</label>
            <div className="relative">
              <FiUser className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5" />
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="Your name"
                className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Email</label>
            <div className="relative">
              <FiMail className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
                className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium text-stone-700">Password</label>
            <div className="relative">
              <FiLock className="absolute left-3 top-1/2 -translate-y-1/2 text-amber-500 w-5 h-5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={6}
                placeholder="Min 6 characters"
                className="w-full pl-11 pr-4 py-3 border border-stone-200 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all duration-200"
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="block text-sm font-medium text-stone-700">I am a</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setRole('freelancer')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'freelancer'
                    ? 'border-teal-500 bg-teal-50 text-teal-800'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <FiUserCheck className="w-5 h-5" />
                Freelancer
              </button>
              <button
                type="button"
                onClick={() => setRole('client')}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border-2 transition-all duration-200 ${
                  role === 'client'
                    ? 'border-amber-500 bg-amber-50 text-amber-800'
                    : 'border-stone-200 text-stone-600 hover:border-stone-300'
                }`}
              >
                <FiBriefcase className="w-5 h-5" />
                Client
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-amber-500 to-amber-600 text-stone-900 py-3 rounded-xl font-semibold hover:from-amber-400 hover:to-amber-500 disabled:opacity-70 transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-xl active:scale-[0.98]"
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-stone-400/30 border-t-stone-800 rounded-full animate-spin" />
                Creating account...
              </span>
            ) : (
              'Sign Up'
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-stone-500">
          Already have an account?{' '}
          <Link to="/login" className="text-violet-600 font-semibold hover:text-violet-700 hover:underline transition-colors">
            Login
          </Link>
        </p>
      </div>
    </div>
  )
}
