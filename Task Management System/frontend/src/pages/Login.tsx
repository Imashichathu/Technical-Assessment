import axios from 'axios'
import { useState, type FormEvent } from 'react'
import { Navigate, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'
import './Login.css'

const PARTICLES = [
  { top: '8%', left: '6%', size: 5, color: '#22d3ee', delay: '0s' },
  { top: '14%', left: '22%', size: 3, color: '#8b5cf6', delay: '1.2s' },
  { top: '28%', left: '4%', size: 4, color: '#ffffff', delay: '2.4s' },
  { top: '6%', left: '70%', size: 4, color: '#22d3ee', delay: '0.6s' },
  { top: '2%', left: '88%', size: 3, color: '#8b5cf6', delay: '1.8s' },
  { top: '20%', left: '93%', size: 5, color: '#22d3ee', delay: '3s' },
  { top: '55%', left: '2%', size: 3, color: '#8b5cf6', delay: '2s' },
  { top: '70%', left: '10%', size: 4, color: '#ffffff', delay: '0.9s' },
  { top: '85%', left: '20%', size: 3, color: '#22d3ee', delay: '2.7s' },
  { top: '62%', left: '87%', size: 4, color: '#8b5cf6', delay: '1.5s' },
  { top: '78%', left: '95%', size: 3, color: '#22d3ee', delay: '0.3s' },
  { top: '40%', left: '97%', size: 3, color: '#8b5cf6', delay: '1s' },
  { top: '46%', left: '1%', size: 3, color: '#22d3ee', delay: '2.9s' },
] as const

const COMET_PATH = 'M 1080 640 C 1220 700, 1300 760, 1440 750'

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
      <div className="login-dotgrid login-dotgrid--tl" />
      <div className="login-dotgrid login-dotgrid--br" />

      {PARTICLES.map((p, i) => (
        <span
          key={i}
          className="login-particle"
          style={{
            top: p.top,
            left: p.left,
            width: p.size,
            height: p.size,
            background: p.color,
            boxShadow: `0 0 8px 2px ${p.color}`,
            animationDelay: p.delay,
          }}
        />
      ))}

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
          <linearGradient id="goldFade" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#fbbf24" stopOpacity="0" />
            <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
          </linearGradient>
          <filter id="lineGlow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path
          className="login-line login-line--a"
          d="M -100 400 C 150 320, 260 480, 480 430 C 680 390, 640 260, 920 280 C 1080 292, 1140 220, 1300 240"
          stroke="#22d3ee"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#lineGlow)"
        />
        <path
          className="login-line login-line--b"
          d="M 1540 200 C 1300 160, 1250 340, 1020 320 C 800 300, 780 480, 560 520 C 380 552, 300 700, 60 680"
          stroke="#8b5cf6"
          strokeWidth="2.5"
          strokeLinecap="round"
          fill="none"
          filter="url(#lineGlow)"
        />
        <path
          className="login-line login-line--gold"
          d={COMET_PATH}
          stroke="url(#goldFade)"
          strokeWidth="2"
          strokeLinecap="round"
          fill="none"
        />
        <circle r="4" fill="#fbbf24" filter="url(#lineGlow)">
          <animateMotion dur="7s" repeatCount="indefinite" path={COMET_PATH} />
        </circle>
      </svg>

      <form className="login-card" onSubmit={handleSubmit} noValidate>
        <div className="login-brand">
          <svg className="login-logo-hex" viewBox="0 0 100 100" aria-hidden="true">
            <defs>
              <linearGradient id="hexGrad" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#8b5cf6" />
              </linearGradient>
            </defs>
            <polygon
              points="92,50 71,86.37 29,86.37 8,50 29,13.63 71,13.63"
              fill="rgba(5,7,15,0.6)"
              stroke="url(#hexGrad)"
              strokeWidth="4"
            />
            <path
              d="M35 52 L45 62 L68 38"
              stroke="#fff"
              strokeWidth="6"
              strokeLinecap="round"
              strokeLinejoin="round"
              fill="none"
            />
          </svg>
          <h1>
            <span className="brand-white">Task</span>{' '}
            <span className="brand-grad">Manager</span>
          </h1>
          <p className="subtitle">Sign in to manage your daily tasks</p>
        </div>

        <div className="field field--cyan">
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

        <div className="field field--violet">
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
            <>
              Sign in
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="submit-arrow">
                <path
                  d="M5 12h14M13 6l6 6-6 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </>
          )}
        </button>

        <div className="login-divider">
          <span>OR</span>
        </div>

        <p className="hint">
          Demo credentials: <span className="hint-email">admin@test.com</span> / 123456
        </p>
      </form>
    </div>
  )
}
