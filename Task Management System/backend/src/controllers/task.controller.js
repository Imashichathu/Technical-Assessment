import { pool } from '../config/db.js'

const PRIORITIES = ['Low', 'Medium', 'High']
const STATUSES = ['Pending', 'In Progress', 'Completed']

function validateTaskInput(body, { partial = false, enforceFutureDueDate = false } = {}) {
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

function serializeTask(row) {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    priority: row.priority,
    status: row.status,
    dueDate: row.due_date,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

export async function listTasks(req, res) {
  const [rows] = await pool.query(
    'SELECT * FROM tasks WHERE user_id = ? ORDER BY due_date ASC, created_at DESC',
    [req.user.id],
  )
  res.json({ tasks: rows.map(serializeTask) })
}

export async function getTask(req, res) {
  const { id } = req.params

  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [
    id,
    req.user.id,
  ])

  if (!rows[0]) {
    return res.status(404).json({ message: 'Task not found' })
  }

  res.json({ task: serializeTask(rows[0]) })
}

export async function createTask(req, res) {
  const errors = validateTaskInput(req.body, { enforceFutureDueDate: true })
  if (errors.length) {
    return res.status(400).json({ message: errors[0], errors })
  }

  const { title, description, priority, status, dueDate } = req.body

  const [result] = await pool.query(
    'INSERT INTO tasks (user_id, title, description, priority, status, due_date) VALUES (?, ?, ?, ?, ?, ?)',
    [req.user.id, title.trim(), description?.trim() || null, priority, status || 'Pending', dueDate],
  )

  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [result.insertId])
  res.status(201).json({ task: serializeTask(rows[0]) })
}

export async function updateTask(req, res) {
  const { id } = req.params

  const [existingRows] = await pool.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [
    id,
    req.user.id,
  ])
  const existing = existingRows[0]
  if (!existing) {
    return res.status(404).json({ message: 'Task not found' })
  }

  const errors = validateTaskInput(req.body, { partial: true })
  if (errors.length) {
    return res.status(400).json({ message: errors[0], errors })
  }

  const title = req.body.title !== undefined ? req.body.title.trim() : existing.title
  const description =
    req.body.description !== undefined ? req.body.description?.trim() || null : existing.description
  const priority = req.body.priority !== undefined ? req.body.priority : existing.priority
  const status = req.body.status !== undefined ? req.body.status : existing.status
  const dueDate = req.body.dueDate !== undefined ? req.body.dueDate : existing.due_date

  await pool.query(
    'UPDATE tasks SET title = ?, description = ?, priority = ?, status = ?, due_date = ? WHERE id = ?',
    [title, description, priority, status, dueDate, id],
  )

  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id])
  res.json({ task: serializeTask(rows[0]) })
}

export async function deleteTask(req, res) {
  const { id } = req.params

  const [result] = await pool.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [
    id,
    req.user.id,
  ])

  if (result.affectedRows === 0) {
    return res.status(404).json({ message: 'Task not found' })
  }

  res.status(204).send()
}
