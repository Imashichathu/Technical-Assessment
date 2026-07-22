import type { TaskPriority, TaskStatus } from '../types/task'
import './TaskFilters.css'

export type SortOption = 'newest' | 'oldest' | 'dueDate'

interface TaskFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  status: TaskStatus | 'All'
  onStatusChange: (value: TaskStatus | 'All') => void
  priority: TaskPriority | 'All'
  onPriorityChange: (value: TaskPriority | 'All') => void
  sort: SortOption
  onSortChange: (value: SortOption) => void
}

export function TaskFilters({
  search,
  onSearchChange,
  status,
  onStatusChange,
  priority,
  onPriorityChange,
  sort,
  onSortChange,
}: TaskFiltersProps) {
  return (
    <div className="task-filters">
      <div className="task-search">
        <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle cx="11" cy="11" r="7" stroke="currentColor" strokeWidth="1.8" />
          <path
            d="m20 20-3.5-3.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
          />
        </svg>
        <input
          type="search"
          placeholder="Search by task title…"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          aria-label="Search by task title"
        />
      </div>

      <select
        value={status}
        onChange={(e) => onStatusChange(e.target.value as TaskStatus | 'All')}
        aria-label="Filter by status"
      >
        <option value="All">All Statuses</option>
        <option value="Pending">Pending</option>
        <option value="In Progress">In Progress</option>
        <option value="Completed">Completed</option>
      </select>

      <select
        value={priority}
        onChange={(e) => onPriorityChange(e.target.value as TaskPriority | 'All')}
        aria-label="Filter by priority"
      >
        <option value="All">All Priorities</option>
        <option value="Low">Low</option>
        <option value="Medium">Medium</option>
        <option value="High">High</option>
      </select>

      <select
        value={sort}
        onChange={(e) => onSortChange(e.target.value as SortOption)}
        aria-label="Sort tasks"
      >
        <option value="newest">Newest Created</option>
        <option value="oldest">Oldest Created</option>
        <option value="dueDate">Due Date</option>
      </select>
    </div>
  )
}
