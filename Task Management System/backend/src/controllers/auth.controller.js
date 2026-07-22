import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { pool } from '../config/db.js'

export async function login(req, res) {
  const { email, password } = req.body

  if (!email || !password) {
    return res.status(400).json({ message: 'Email and password are required' })
  }

  const [rows] = await pool.query('SELECT * FROM users WHERE email = ?', [email])
  const user = rows[0]

  if (!user) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const passwordMatches = await bcrypt.compare(password, user.password)
  if (!passwordMatches) {
    return res.status(401).json({ message: 'Invalid email or password' })
  }

  const token = jwt.sign({ id: user.id, email: user.email }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '1d',
  })

  res.json({
    token,
    user: { id: user.id, name: user.name, email: user.email },
  })
}

export async function me(req, res) {
  const [rows] = await pool.query('SELECT id, name, email FROM users WHERE id = ?', [req.user.id])
  const user = rows[0]

  if (!user) {
    return res.status(404).json({ message: 'User not found' })
  }

  res.json({ user })
}

export async function logout(_req, res) {
  res.json({ message: 'Logged out successfully' })
}
