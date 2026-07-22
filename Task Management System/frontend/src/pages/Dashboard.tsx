import axios from 'axios'
import { useEffect, useMemo, useState, type MouseEvent } from 'react'
import { ConfirmModal } from '../components/ConfirmModal'
import { Pagination } from '../components/Pagination'
import { TaskFilters, type SortOption } from '../components/TaskFilters'
import { TaskFormModal } from '../components/TaskFormModal'
import { TaskTable } from '../components/TaskTable'
import { TaskViewModal } from '../components/TaskViewModal'
import { useAuth } from '../hooks/useAuth'
import { useTheme } from '../hooks/useTheme'
import { useToast } from '../hooks/useToast'
import { filterAndSortTasks } from '../lib/taskFilters'
import { createTask, deleteTask, fetchTasks, updateTask } from '../lib/tasksApi'
import type { Task, TaskInput, TaskPriority, TaskStatus } from '../types/task'
import './Dashboard.css'

const PAGE_SIZE = 8

function getErrorMessage(err: unknown, fallback: string) {
  return axios.isAxiosError(err) ? (err.response?.data?.message ?? fallback) : fallback
}

const MAX_TILT_DEG = 10

function handleCardTilt(e: MouseEvent<HTMLDivElement>) {
  const card = e.currentTarget
  const rect = card.getBoundingClientRect()
  const px = (e.clientX - rect.left) / rect.width
  const py = (e.clientY - rect.top) / rect.height
  const rotateY = (px - 0.5) * MAX_TILT_DEG * 2
  const rotateX = (0.5 - py) * MAX_TILT_DEG * 2

  card.style.transform = `perspective(700px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.03)`
  card.style.setProperty('--glare-x', `${px * 100}%`)
  card.style.setProperty('--glare-y', `${py * 100}%`)
}

function handleCardTiltReset(e: MouseEvent<HTMLDivElement>) {
  e.currentTarget.style.transform = ''
}

type ModalState =
  | { mode: 'create' }
  | { mode: 'edit'; task: Task }
  | { mode: 'view'; task: Task }
  | { mode: 'delete'; task: Task }
  | null

export function Dashboard() {
  const { user, logout } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const { showToast } = useToast()
  const [isLoggingOut, setIsLoggingOut] = useState(false)
  const [tasks, setTasks] = useState<Task[]>([])
  const [isLoadingTasks, setIsLoadingTasks] = useState(true)
  const [modal, setModal] = useState<ModalState>(null)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<TaskStatus | 'All'>('All')
  const [priorityFilter, setPriorityFilter] = useState<TaskPriority | 'All'>('All')
  const [sort, setSort] = useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = useState(1)

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
    showToast('Task created successfully', 'success')
    await loadTasks()
  }

  async function handleUpdate(id: number, input: TaskInput) {
    await updateTask(id, input)
    setModal(null)
    showToast('Task updated successfully', 'success')
    await loadTasks()
  }

  async function handleDelete(id: number) {
    try {
      await deleteTask(id)
      setModal(null)
      showToast('Task deleted successfully', 'success')
      await loadTasks()
    } catch (err) {
      showToast(getErrorMessage(err, 'Unable to delete task'), 'error')
    }
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

  const visibleTasks = useMemo(
    () => filterAndSortTasks(tasks, { search, statusFilter, priorityFilter, sort }),
    [tasks, search, statusFilter, priorityFilter, sort],
  )

  const filterKey = `${search}|${statusFilter}|${priorityFilter}|${sort}`
  const [prevFilterKey, setPrevFilterKey] = useState(filterKey)
  if (filterKey !== prevFilterKey) {
    setPrevFilterKey(filterKey)
    setCurrentPage(1)
  }

  const totalPages = Math.max(1, Math.ceil(visibleTasks.length / PAGE_SIZE))
  const safePage = Math.min(currentPage, totalPages)
  const paginatedTasks = visibleTasks.slice((safePage - 1) * PAGE_SIZE, safePage * PAGE_SIZE)

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
    <div className={`dashboard-page theme-${theme}`}>
      <header className="dashboard-header">
        <h1>Task Manager</h1>
        <div className="dashboard-user">
          <button
            type="button"
            className="theme-toggle"
            onClick={toggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {theme === 'dark' ? (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <circle cx="12" cy="12" r="4.5" stroke="currentColor" strokeWidth="1.8" />
                <path
                  d="M12 2.5v2M12 19.5v2M4.2 4.2l1.4 1.4M18.4 18.4l1.4 1.4M2.5 12h2M19.5 12h2M4.2 19.8l1.4-1.4M18.4 5.6l1.4-1.4"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            ) : (
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M20.5 14.5A8.5 8.5 0 1 1 9.5 3.5a7 7 0 0 0 11 11Z"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            )}
          </button>
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
              onMouseMove={handleCardTilt}
              onMouseLeave={handleCardTiltReset}
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

          <TaskFilters
            search={search}
            onSearchChange={setSearch}
            status={statusFilter}
            onStatusChange={setStatusFilter}
            priority={priorityFilter}
            onPriorityChange={setPriorityFilter}
            sort={sort}
            onSortChange={setSort}
          />

          {isLoadingTasks ? (
            <p className="task-table-empty">
              <span className="inline-spinner" aria-hidden="true" />
              Loading tasks…
            </p>
          ) : (
            <>
              <TaskTable
                tasks={paginatedTasks}
                emptyMessage={
                  tasks.length === 0
                    ? 'No tasks yet. Create your first task to get started.'
                    : 'No tasks match your search or filters.'
                }
                onView={(task) => setModal({ mode: 'view', task })}
                onEdit={(task) => setModal({ mode: 'edit', task })}
                onDelete={(task) => setModal({ mode: 'delete', task })}
              />
              <Pagination
                currentPage={safePage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </>
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
