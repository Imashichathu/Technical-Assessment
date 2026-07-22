import { useEffect, useState, type ReactNode } from 'react'
import { api } from '../lib/api'
import { AuthContext, type User } from './auth-context'

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(() => Boolean(localStorage.getItem('token')))

  useEffect(() => {
    if (!localStorage.getItem('token')) return

    api
      .get('/auth/me')
      .then((res) => setUser(res.data.user))
      .catch(() => localStorage.removeItem('token'))
      .finally(() => setIsLoading(false))
  }, [])

  async function login(email: string, password: string) {
    const res = await api.post('/auth/login', { email, password })
    localStorage.setItem('token', res.data.token)
    setUser(res.data.user)
  }

  async function logout() {
    try {
      await api.post('/auth/logout')
    } finally {
      localStorage.removeItem('token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
