import axios from 'axios'
import { useState, type FormEvent } from 'react'
import type { Task, TaskInput } from '../types/task'
import { Modal } from './Modal'
import './TaskFormModal.css'

interface TaskFormModalProps {
  task?: Task
  onClose: () => void
  onSubmit: (input: TaskInput) => Promise<void>
}

const EMPTY_INPUT: TaskInput = {
  title: '',
  description: '',
  priority: 'Medium',
  status: 'Pending',
  dueDate: '',
}

export function TaskFormModal({ task, onClose, onSubmit }: TaskFormModalProps) {
  const [form, setForm] = useState<TaskInput>(
    task
      ? {
          title: task.title,
          description: task.description ?? '',
          priority: task.priority,
          status: task.status,
          dueDate: task.dueDate,
        }
      : EMPTY_INPUT,
  )
  const [error, setError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  function update<K extends keyof TaskInput>(key: K, value: TaskInput[K]) {
    setForm((f) => ({ ...f, [key]: value }))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setIsSubmitting(true)
    try {
      await onSubmit(form)
    } catch (err) {
      const message = axios.isAxiosError(err)
        ? (err.response?.data?.message ?? 'Unable to save task')
        : 'Unable to save task'
      setError(message)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal title={task ? 'Edit Task' : 'New Task'} onClose={onClose}>
      <form className="task-form" onSubmit={handleSubmit} noValidate>
        <label className="task-form-field">
          <span>Title</span>
          <input
            type="text"
            value={form.title}
            onChange={(e) => update('title', e.target.value)}
            maxLength={200}
            required
          />
        </label>

        <label className="task-form-field">
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(e) => update('description', e.target.value)}
            rows={3}
          />
        </label>

        <div className="task-form-row">
          <label className="task-form-field">
            <span>Priority</span>
            <select value={form.priority} onChange={(e) => update('priority', e.target.value as TaskInput['priority'])}>
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </label>

          <label className="task-form-field">
            <span>Status</span>
            <select value={form.status} onChange={(e) => update('status', e.target.value as TaskInput['status'])}>
              <option value="Pending">Pending</option>
              <option value="In Progress">In Progress</option>
              <option value="Completed">Completed</option>
            </select>
          </label>
        </div>

        <label className="task-form-field">
          <span>Due Date</span>
          <input
            type="date"
            value={form.dueDate}
            onChange={(e) => update('dueDate', e.target.value)}
            required
          />
        </label>

        {error && <p className="task-form-error">{error}</p>}

        <div className="task-form-actions">
          <button type="button" className="task-form-cancel" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="task-form-submit" disabled={isSubmitting}>
            {isSubmitting ? 'Saving…' : task ? 'Save Changes' : 'Create Task'}
          </button>
        </div>
      </form>
    </Modal>
  )
}
