import bcrypt from 'bcryptjs'
import { pool } from '../config/db.js'

const DEFAULT_ADMIN = {
  name: 'Admin',
  email: 'admin@test.com',
  password: '123456',
}

export async function seedAdmin() {
  const [rows] = await pool.query('SELECT id FROM users WHERE email = ?', [DEFAULT_ADMIN.email])
  if (rows.length > 0) return

  const hashed = await bcrypt.hash(DEFAULT_ADMIN.password, 10)
  await pool.query('INSERT INTO users (name, email, password) VALUES (?, ?, ?)', [
    DEFAULT_ADMIN.name,
    DEFAULT_ADMIN.email,
    hashed,
  ])
}
