import type { SortOption } from '../components/TaskFilters'
import type { Task, TaskPriority, TaskStatus } from '../types/task'

export interface TaskFilterOptions {
  search: string
  statusFilter: TaskStatus | 'All'
  priorityFilter: TaskPriority | 'All'
  sort: SortOption
}

export function filterAndSortTasks(tasks: Task[], options: TaskFilterOptions): Task[] {
  const query = options.search.trim().toLowerCase()

  const filtered = tasks.filter((task) => {
    if (query && !task.title.toLowerCase().includes(query)) return false
    if (options.statusFilter !== 'All' && task.status !== options.statusFilter) return false
    if (options.priorityFilter !== 'All' && task.priority !== options.priorityFilter) return false
    return true
  })

  return filtered.sort((a, b) => {
    if (options.sort === 'newest') {
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    }
    if (options.sort === 'oldest') {
      return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
    }
    return a.dueDate.localeCompare(b.dueDate)
  })
}

export function isTaskOverdue(task: Task, today = new Date().toISOString().slice(0, 10)): boolean {
  if (task.status === 'Completed') return false
  return task.dueDate < today
}
