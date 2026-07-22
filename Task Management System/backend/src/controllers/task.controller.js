import { pool } from '../config/db.js'

export async function getStats(req, res) {
  const [rows] = await pool.query(
    `SELECT
      COUNT(*) AS total,
      SUM(status = 'Pending') AS pending,
      SUM(status = 'In Progress') AS inProgress,
      SUM(status = 'Completed') AS completed,
      SUM(status != 'Completed' AND due_date < CURDATE()) AS overdue
    FROM tasks
    WHERE user_id = ?`,
    [req.user.id],
  )

  const stats = rows[0]

  res.json({
    total: Number(stats.total),
    pending: Number(stats.pending),
    inProgress: Number(stats.inProgress),
    completed: Number(stats.completed),
    overdue: Number(stats.overdue),
  })
}
