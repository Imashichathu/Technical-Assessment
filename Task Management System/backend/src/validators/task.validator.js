export const PRIORITIES = ['Low', 'Medium', 'High']
export const STATUSES = ['Pending', 'In Progress', 'Completed']

export function validateTaskInput(body, { partial = false, enforceFutureDueDate = false } = {}) {
  const errors = []

  if (!partial || body.title !== undefined) {
    if (!body.title || typeof body.title !== 'string' || !body.title.trim()) {
      errors.push('Title is required')
    } else if (body.title.length > 200) {
      errors.push('Title must be 200 characters or fewer')
    }
  }

  if (!partial || body.priority !== undefined) {
    if (body.priority === undefined || body.priority === null || body.priority === '') {
      errors.push('Priority is required')
    } else if (!PRIORITIES.includes(body.priority)) {
      errors.push('Priority must be Low, Medium, or High')
    }
  }

  if (body.status !== undefined) {
    if (body.status === '') {
      errors.push('Status is required')
    } else if (!STATUSES.includes(body.status)) {
      errors.push('Status must be Pending, In Progress, or Completed')
    }
  }

  if (!partial || body.dueDate !== undefined) {
    if (!body.dueDate) {
      errors.push('Due date is required')
    } else if (Number.isNaN(Date.parse(body.dueDate))) {
      errors.push('Due date must be a valid date')
    } else if (enforceFutureDueDate) {
      const today = new Date().toISOString().slice(0, 10)
      if (body.dueDate < today) {
        errors.push('Due date cannot be earlier than today')
      }
    }
  }

  return errors
}
