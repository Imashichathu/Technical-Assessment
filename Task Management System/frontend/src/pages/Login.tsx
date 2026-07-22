import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

export function Login() {
  const { user, login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (user) {
    const redirectTo = (location.state as { from?: string } | null)?.from ?? '/'
    return <Navigate to={redirectTo} replace />
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)

    try {
      await login(email, password)
      navigate('/', { replace: true })
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? 'Unable to sign in')
        : 'Unable to sign in'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-blob login-blob--a" />
      <div className="login-blob login-blob--b" />
      <div className="login-blob login-blob--c" />
      <div className="login-blob login-blob--d" />
      <div className="login-ring login-ring--a" />
      <div className="login-ring login-ring--b" />
      <div className="login-ring login-ring--c" />

      <svg
        className="login-lines"
        viewBox="0 0 1440 900"
        preserveAspectRatio="xMidYMid slice"
        aria-hidden="true"
      >
        <defs>
          <linearGradient id="lineGradA" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#2e4dc3" />
            <stop offset="100%" stopColor="#7c5cff" />
          </linearGradient>
          <linearGradient id="lineGradB" x1="1" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#22d3ee" />
            <stop offset="100%" stopColor="#5b3fd6" />
          </linearGradient>
          <linearGradient id="lineGradC" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%" stopColor="#0c2ca4" />
            <stop offset="100%" stopColor="#22d3ee" />
          </linearGradient>
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          className="login-line login-line--a"
          d="M -80 180 C 120 60, 260 320, 460 260 C 660 200, 720 420, 940 380 C 1120 350, 1180 120, 1480 140"
          stroke="url(#lineGradA)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#lineGlow)"
        />
        <path
          className="login-line login-line--b"
          d="M 1500 700 C 1260 780, 1180 560, 980 600 C 780 640, 720 460, 500 500 C 300 540, 220 740, -60 700"
          stroke="url(#lineGradB)"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#lineGlow)"
        />
        <path
          className="login-line login-line--c"
          d="M -60 520 C 160 460, 220 620, 420 560 C 620 500, 660 340, 880 360"
          stroke="url(#lineGradC)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
          filter="url(#lineGlow)"
        />
      </svg>

      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <div className="login-brand">
          <span className="login-logo">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M20 6.5 9.5 17 4 11.5"
                stroke="currentColor"
                strokeWidth="2.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <h1>Task Manager</h1>
          <p className="subtitle">Sign in to manage your daily tasks</p>
        </div>

        <div className="field">
          <span className="field-icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <path
                d="M3 6.5A2.5 2.5 0 0 1 5.5 4h13A2.5 2.5 0 0 1 21 6.5v11a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5v-11Z"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="m4 6.5 8 6 8-6"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <input
            id="email"
            type="email"
            placeholder=" "
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            autoComplete="email"
            required
          />
          <label htmlFor="email">Email address</label>
        </div>

        <div className="field">
          <span className="field-icon">
            <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
              <rect
                x="5"
                y="10.5"
                width="14"
                height="9.5"
                rx="2.2"
                stroke="currentColor"
                strokeWidth="1.6"
              />
              <path
                d="M8 10.5V8a4 4 0 1 1 8 0v2.5"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </span>
          <input
            id="password"
            type={showPassword ? 'text' : 'password'}
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          <label htmlFor="password">Password</label>
          <button
            type="button"
            className="field-toggle"
            onClick={() => setShowPassword((v) => !v)}
            aria-label={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M3 3l18 18M10.6 10.7a2.5 2.5 0 0 0 3.5 3.5M6.6 6.9C4.5 8.3 3 10.4 2 12c1.8 3 5.3 6.5 10 6.5 1.6 0 3-.4 4.2-1.1M9.6 4.8C10.4 4.6 11.2 4.5 12 4.5c4.7 0 8.2 3.5 10 6.5-.5.9-1.2 1.9-2.1 2.8"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M2 12c1.8-3 5.3-6.5 10-6.5S20.2 9 22 12c-1.8 3-5.3 6.5-10 6.5S3.8 15 2 12Z"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinejoin="round"
                />
                <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
              </svg>
            )}
          </button>
        </div>

        {error && (
          <p className="error" key={error}>
            {error}
          </p>
        )}

        <button type="submit" className="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <span className="spinner" aria-hidden="true" />
              Signing in…
            </>
          ) : (
            'Sign in'
          )}
        </button>

        <p className="hint">Demo credentials: admin@test.com / 123456</p>
      </form>
    </div>
  )
}
