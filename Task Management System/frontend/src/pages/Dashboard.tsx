import { useState } from 'react'
import { useAuth } from '../hooks/useAuth'
import './Dashboard.css'

export function Dashboard() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)

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

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <h1>Task Manager</h1>
        <div className="dashboard-user">
          <span className="avatar">{initials}</span>
          <span className="user-name">{user?.name}</span>
          <button type="button" className="logout-btn" onClick={handleLogout} disabled={isLoggingOut}>
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
        <div className="welcome-card">
          <p>Welcome back, {user?.name}. Your task list will live here.</p>
        </div>
      </main>
    </div>
  )
}
