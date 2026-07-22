import { pool } from '../config/db.js'
import { validateTaskInput } from '../validators/task.validator.js'

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
