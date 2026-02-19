import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getMe } from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setTokenState] = useState(() => localStorage.getItem('token'))
  const [loading, setLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    const t = localStorage.getItem('token')
    if (!t) {
      setUser(null)
      setLoading(false)
      return
    }
    try {
      const { data } = await getMe()
      setUser(data)
      setTokenState(t)
    } catch {
      localStorage.removeItem('token')
      setUser(null)
      setTokenState(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    refreshUser()
  }, [refreshUser])

  const login = useCallback((t) => {
    localStorage.setItem('token', t)
    setTokenState(t)
    return refreshUser()
  }, [refreshUser])

  const logout = useCallback(() => {
    localStorage.removeItem('token')
    setTokenState(null)
    setUser(null)
  }, [])

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within AuthProvider')
  return ctx
}
