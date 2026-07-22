import { useEffect, useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import { api } from '../lib/api'
import './Dashboard.css'

interface TaskStats {
  total: number
  pending: number
  inProgress: number
  completed: number
  overdue: number
}

const EMPTY_STATS: TaskStats = {
  total: 0,
  pending: 0,
  inProgress: 0,
  completed: 0,
  overdue: 0,
}

export function Dashboard() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [stats, setStats] = useState<TaskStats>(EMPTY_STATS)
  const [isLoadingStats, setIsLoadingStats] = useState(true)

  useEffect(() => {
    api
      .get('/tasks/stats')
      .then((res) => setStats(res.data))
      .finally(() => setIsLoadingStats(false))
  }, [])

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  const initials = user?.name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase()

  const cards = [
    {
      key: 'total',
      label: 'Total Tasks',
      value: stats.total,
      accent: 'periwinkle',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M4 6h16M4 12h16M4 18h10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
    {
      key: 'pending',
      label: 'Pending Tasks',
      value: stats.pending,
      accent: 'violet',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
          <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: 'inProgress',
      label: 'In Progress Tasks',
      value: stats.inProgress,
      accent: 'cyan',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M20 12a8 8 0 1 1-3-6.2"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M20 4v4h-4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
        </svg>
      ),
    },
    {
      key: 'completed',
      label: 'Completed Tasks',
      value: stats.completed,
      accent: 'success',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="2" />
          <path
            d="m8.5 12.5 2.3 2.3L16 10"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
    },
    {
      key: 'overdue',
      label: 'Overdue Tasks',
      value: stats.overdue,
      accent: 'danger',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <path
            d="M12 3 2 20h20L12 3Z"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M12 9.5v4M12 16.5h.01"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </svg>
      ),
    },
  ] as const

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Task Manager</h1>
        <div className="dashboard-user">
          <span className="avatar">{initials}</span>
          <span className="user-name">{user?.name}</span>
          <button
            type="button"
            className="logout-btn"
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <span className="spinner" aria-hidden="true" />
                Logging out…
              </>
            ) : (
              'Logout'
            )}
          </button>
        </div>
      </header>

      <main>
        <div className="stat-grid">
          {cards.map((card, i) => (
            <div
              key={card.key}
              className={`stat-card stat-card--${card.accent}`}
              style={{ animationDelay: `${i * 0.06}s` }}
            >
              <span className="stat-icon">{card.icon}</span>
              <span className="stat-value">{isLoadingStats ? '–' : card.value}</span>
              <span className="stat-label">{card.label}</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  )
}
