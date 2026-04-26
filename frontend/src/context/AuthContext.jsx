import { createContext, useContext, useEffect, useState, useCallback } from 'react'
import { authService } from '../services/authService'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser]       = useState(() => {
    try { return JSON.parse(localStorage.getItem('auth_user')) } catch { return null }
  })
  const [token, setToken]     = useState(() => localStorage.getItem('auth_token'))
  const [loading, setLoading] = useState(true)

  const saveSession = (token, user) => {
    localStorage.setItem('auth_token', token)
    localStorage.setItem('auth_user', JSON.stringify(user))
    setToken(token)
    setUser(user)
  }

  const clearSession = useCallback(() => {
    localStorage.removeItem('auth_token')
    localStorage.removeItem('auth_user')
    setToken(null)
    setUser(null)
  }, [])

  // Listen for 401 events fired by the Axios interceptor
  useEffect(() => {
    const handler = () => clearSession()
    window.addEventListener('auth:logout', handler)
    return () => window.removeEventListener('auth:logout', handler)
  }, [clearSession])

  // Validate token on mount
  useEffect(() => {
    const verify = async () => {
      if (!localStorage.getItem('auth_token')) { setLoading(false); return }
      try {
        const data = await authService.me()
        setUser(data)
        localStorage.setItem('auth_user', JSON.stringify(data))
      } catch {
        clearSession()
      } finally {
        setLoading(false)
      }
    }
    verify()
  }, [clearSession])

  const login = async (credentials) => {
    const data = await authService.login(credentials)
    saveSession(data.token, data.user)
    return data.user
  }

  const register = async (formData) => {
    const data = await authService.register(formData)
    saveSession(data.token, data.user)
    return data.user
  }

  const logout = async () => {
    try { await authService.logout() } catch {}
    clearSession()
  }

  const isAdmin    = user?.role === 'admin'
  const isProvider = user?.role === 'provider'
  const isCustomer = user?.role === 'customer'

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout, isAdmin, isProvider, isCustomer }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
