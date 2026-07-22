export type TaskPriority = 'Low' | 'Medium' | 'High'
export type TaskStatus = 'Pending' | 'In Progress' | 'Completed'

export interface Task {
  id: number
  title: string
  description: string | null
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
  createdAt: string
  updatedAt: string
}

export interface TaskInput {
  title: string
  description: string
  priority: TaskPriority
  status: TaskStatus
  dueDate: string
}
