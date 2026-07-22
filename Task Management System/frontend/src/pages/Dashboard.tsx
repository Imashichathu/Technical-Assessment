import { useEffect, useMemo, useState } from 'react'
import { ConfirmModal } from '../components/ConfirmModal'
import { TaskFormModal } from '../components/TaskFormModal'
import { TaskTable } from '../components/TaskTable'
import { TaskViewModal } from '../components/TaskViewModal'
import { useAuth } from '../hooks/useAuth'
import { createTask, deleteTask, fetchTasks, updateTask } from '../lib/tasksApi'
import type { Task, TaskInput } from '../types/task'
import './Dashboard.css'

type ModalState =
  | { mode: 'create' }
  | { mode: 'edit'; task: Task }
  | { mode: 'view'; task: Task }
  | { mode: 'delete'; task: Task }
  | null

export function Dashboard() {
  const { user, logout } = useAuth()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [modal, setModal] = useState<ModalState>(null)

  useEffect(() => {
    loadTasks()
  }, [])

  async function loadTasks() {
    setIsLoadingTasks(true)
    try {
      setTasks(await fetchTasks())
    } finally {
      setIsLoadingTasks(false)
    }
  }

  async function handleLogout() {
    setIsLoggingOut(true)
    try {
      await logout()
    } finally {
      setIsLoggingOut(false)
    }
  }

  async function handleCreate(input: TaskInput) {
    await createTask(input)
    setModal(null)
    await loadTasks()
  }

  async function handleUpdate(id: number, input: TaskInput) {
    await updateTask(id, input)
    setModal(null)
    await loadTasks()
  }

  async function handleDelete(id: number) {
    await deleteTask(id)
    setModal(null)
    await loadTasks()
  }

  const stats = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10)
    return {
      total: tasks.length,
      pending: tasks.filter((t) => t.status === 'Pending').length,
      inProgress: tasks.filter((t) => t.status === 'In Progress').length,
      completed: tasks.filter((t) => t.status === 'Completed').length,
      overdue: tasks.filter((t) => t.status !== 'Completed' && t.dueDate < today).length,
    }
  }, [tasks])

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
              <span className="stat-value">{isLoadingTasks ? '–' : card.value}</span>
              <span className="stat-label">{card.label}</span>
            </div>
          ))}
        </div>

        <section className="task-section">
          <div className="task-section-header">
            <h2>Your Tasks</h2>
            <button type="button" className="new-task-btn" onClick={() => setModal({ mode: 'create' })}>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 5v14M5 12h14"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                />
              </svg>
              New Task
            </button>
          </div>

          {isLoadingTasks ? (
            <p className="task-table-empty">Loading tasks…</p>
          ) : (
            <TaskTable
              tasks={tasks}
              onView={(task) => setModal({ mode: 'view', task })}
              onEdit={(task) => setModal({ mode: 'edit', task })}
              onDelete={(task) => setModal({ mode: 'delete', task })}
            />
          )}
        </section>
      </main>

      {modal?.mode === 'create' && (
        <TaskFormModal onClose={() => setModal(null)} onSubmit={handleCreate} />
      )}

      {modal?.mode === 'edit' && (
        <TaskFormModal
          task={modal.task}
          onClose={() => setModal(null)}
          onSubmit={(input) => handleUpdate(modal.task.id, input)}
        />
      )}

      {modal?.mode === 'view' && (
        <TaskViewModal
          task={modal.task}
          onClose={() => setModal(null)}
          onEdit={() => setModal({ mode: 'edit', task: modal.task })}
        />
      )}

      {modal?.mode === 'delete' && (
        <ConfirmModal
          title="Delete Task"
          message={`Are you sure you want to delete "${modal.task.title}"? This cannot be undone.`}
          onCancel={() => setModal(null)}
          onConfirm={() => handleDelete(modal.task.id)}
        />
      )}
    </div>
  )
}
