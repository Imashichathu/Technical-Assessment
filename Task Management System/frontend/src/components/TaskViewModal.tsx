import type { Task } from '../types/task'
import { Modal } from './Modal'
import './TaskViewModal.css'

interface TaskViewModalProps {
  task: Task
  onClose: () => void
  onEdit: () => void
}

function formatDateTime(value: string) {
  return new Date(value).toLocaleString(undefined, {
    dateStyle: 'medium',
    timeStyle: 'short',
  })
}

export function TaskViewModal({ task, onClose, onEdit }: TaskViewModalProps) {
  return (
    <Modal title="Task Details" onClose={onClose}>
      <div className="task-view">
        <h3>{task.title}</h3>

        <div className="task-view-badges">
          <span className={`badge badge-priority--${task.priority.toLowerCase()}`}>
            {task.priority} Priority
          </span>
          <span className={`badge badge-status--${task.status.replace(' ', '-').toLowerCase()}`}>
            {task.status}
          </span>
        </div>

        {task.description && <p className="task-view-description">{task.description}</p>}

        <dl className="task-view-meta">
          <div>
            <dt>Due Date</dt>
            <dd>{task.dueDate}</dd>
          </div>
          <div>
            <dt>Created</dt>
            <dd>{formatDateTime(task.createdAt)}</dd>
          </div>
          <div>
            <dt>Last Updated</dt>
            <dd>{formatDateTime(task.updatedAt)}</dd>
          </div>
        </dl>

        <div className="task-view-actions">
          <button type="button" className="task-form-cancel" onClick={onClose}>
            Close
          </button>
          <button type="button" className="task-form-submit" onClick={onEdit}>
            Edit Task
          </button>
        </div>
      </div>
    </Modal>
  )
}
