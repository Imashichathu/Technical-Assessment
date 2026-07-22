import { describe, expect, it } from 'vitest'
import type { Task } from '../types/task'
import { filterAndSortTasks, isTaskOverdue } from './taskFilters'

function makeTask(overrides: Partial<Task>): Task {
  return {
    id: 1,
    title: 'Sample task',
    description: null,
    priority: 'Medium',
    status: 'Pending',
    dueDate: '2026-01-01',
    createdAt: '2026-01-01T00:00:00.000Z',
    updatedAt: '2026-01-01T00:00:00.000Z',
    ...overrides,
  }
}

const baseOptions = {
  search: '',
  statusFilter: 'All' as const,
  priorityFilter: 'All' as const,
  sort: 'newest' as const,
}

describe('filterAndSortTasks', () => {
  const tasks = [
    makeTask({ id: 1, title: 'Write report', priority: 'High', status: 'Pending', dueDate: '2026-03-01', createdAt: '2026-01-01T00:00:00.000Z' }),
    makeTask({ id: 2, title: 'Fix bug', priority: 'Low', status: 'In Progress', dueDate: '2026-01-15', createdAt: '2026-01-03T00:00:00.000Z' }),
    makeTask({ id: 3, title: 'Report review', priority: 'High', status: 'Completed', dueDate: '2026-02-01', createdAt: '2026-01-02T00:00:00.000Z' }),
  ]

  it('returns all tasks when no filters are applied', () => {
    expect(filterAndSortTasks(tasks, baseOptions)).toHaveLength(3)
  })

  it('filters by title search, case-insensitively', () => {
    const result = filterAndSortTasks(tasks, { ...baseOptions, search: 'report' })
    expect(result.map((t) => t.id).sort()).toEqual([1, 3])
  })

  it('filters by status', () => {
    const result = filterAndSortTasks(tasks, { ...baseOptions, statusFilter: 'Completed' })
    expect(result.map((t) => t.id)).toEqual([3])
  })

  it('filters by priority', () => {
    const result = filterAndSortTasks(tasks, { ...baseOptions, priorityFilter: 'Low' })
    expect(result.map((t) => t.id)).toEqual([2])
  })

  it('combines search, status, and priority filters with AND logic', () => {
    const result = filterAndSortTasks(tasks, {
      ...baseOptions,
      search: 'report',
      statusFilter: 'Completed',
      priorityFilter: 'High',
    })
    expect(result.map((t) => t.id)).toEqual([3])
  })

  it('returns nothing when filters exclude every task', () => {
    const result = filterAndSortTasks(tasks, { ...baseOptions, search: 'nonexistent' })
    expect(result).toEqual([])
  })

  it('sorts by newest created first', () => {
    const result = filterAndSortTasks(tasks, { ...baseOptions, sort: 'newest' })
    expect(result.map((t) => t.id)).toEqual([2, 3, 1])
  })

  it('sorts by oldest created first', () => {
    const result = filterAndSortTasks(tasks, { ...baseOptions, sort: 'oldest' })
    expect(result.map((t) => t.id)).toEqual([1, 3, 2])
  })

  it('sorts by due date ascending', () => {
    const result = filterAndSortTasks(tasks, { ...baseOptions, sort: 'dueDate' })
    expect(result.map((t) => t.id)).toEqual([2, 3, 1])
  })
})

describe('isTaskOverdue', () => {
  const today = '2026-07-22'

  it('is true for a past due date that is not completed', () => {
    const task = makeTask({ dueDate: '2026-01-01', status: 'Pending' })
    expect(isTaskOverdue(task, today)).toBe(true)
  })

  it('is false for a future due date', () => {
    const task = makeTask({ dueDate: '2099-01-01', status: 'Pending' })
    expect(isTaskOverdue(task, today)).toBe(false)
  })

  it('is false for a completed task even with a past due date', () => {
    const task = makeTask({ dueDate: '2026-01-01', status: 'Completed' })
    expect(isTaskOverdue(task, today)).toBe(false)
  })

  it('is false when the due date is exactly today', () => {
    const task = makeTask({ dueDate: today, status: 'Pending' })
    expect(isTaskOverdue(task, today)).toBe(false)
  })
})
