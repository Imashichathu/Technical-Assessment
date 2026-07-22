import type { Task } from '../types/task'
import './TaskTable.css'

interface TaskTableProps {
  tasks: Task[]
  emptyMessage?: string
  onView: (task: Task) => void
  onEdit: (task: Task) => void
  onDelete: (task: Task) => void
}

function isOverdue(task: Task) {
  if (task.status === 'Completed') return false
  const today = new Date().toISOString().slice(0, 10)
  return task.dueDate < today
}

export function TaskTable({
  tasks,
  emptyMessage = 'No tasks yet. Create your first task to get started.',
  onView,
  onEdit,
  onDelete,
}: TaskTableProps) {
  if (tasks.length === 0) {
    return <p className="task-table-empty">{emptyMessage}</p>
  }

  return (
    <div className="task-table-wrap">
      <table className="task-table">
        <thead>
          <tr>
            <th>Title</th>
            <th>Priority</th>
            <th>Status</th>
            <th>Due Date</th>
            <th aria-label="Actions" />
          </tr>
        </thead>
        <tbody>
          {tasks.map((task) => (
            <tr key={task.id}>
              <td className="task-table-title">{task.title}</td>
              <td>
                <span className={`badge badge-priority--${task.priority.toLowerCase()}`}>
                  {task.priority}
                </span>
              </td>
              <td>
                <span className={`badge badge-status--${task.status.replace(' ', '-').toLowerCase()}`}>
                  {task.status}
                </span>
              </td>
              <td className={isOverdue(task) ? 'task-table-overdue' : undefined}>{task.dueDate}</td>
              <td className="task-table-actions">
                <button type="button" aria-label="View task" onClick={() => onView(task)}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M2 12c1.8-3 5.3-6.5 10-6.5S20.2 9 22 12c-1.8 3-5.3 6.5-10 6.5S3.8 15 2 12Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <circle cx="12" cy="12" r="2.6" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                <button type="button" aria-label="Edit task" onClick={() => onEdit(task)}>
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M4 20h4L19 9l-4-4L4 16v4Z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinejoin="round"
                    />
                    <path d="m14.5 6.5 4 4" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </button>
                <button
                  type="button"
                  aria-label="Delete task"
                  className="task-table-delete"
                  onClick={() => onDelete(task)}
                >
                  <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
                    <path
                      d="M5 7h14M9 7V5a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2v2m-9 0 1 12a2 2 0 0 0 2 2h4a2 2 0 0 0 2-2l1-12"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
