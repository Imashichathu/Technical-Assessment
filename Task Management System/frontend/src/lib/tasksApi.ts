import { api } from './api'
import type { Task, TaskInput } from '../types/task'

export async function fetchTasks(): Promise<Task[]> {
  const res = await api.get('/tasks')
  return res.data.tasks
}

export async function createTask(input: TaskInput): Promise<Task> {
  const res = await api.post('/tasks', input)
  return res.data.task
}

export async function updateTask(id: number, input: Partial<TaskInput>): Promise<Task> {
  const res = await api.put(`/tasks/${id}`, input)
  return res.data.task
}

export async function deleteTask(id: number): Promise<void> {
  await api.delete(`/tasks/${id}`)
}
