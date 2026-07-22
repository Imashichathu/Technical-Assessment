import cors from 'cors'
import express from 'express'
import authRoutes from './routes/auth.routes.js'
import taskRoutes from './routes/task.routes.js'

const app = express()

const LOCALHOST_ORIGIN = /^https?:\/\/(localhost|127\.0\.0\.1):\d+$/

app.use(
  cors({
    origin(origin, callback) {
      const allowed = process.env.CLIENT_ORIGIN || 'http://localhost:5173'
      if (!origin || origin === allowed || LOCALHOST_ORIGIN.test(origin)) {
        return callback(null, true)
      }
      callback(new Error('Not allowed by CORS'))
    },
  }),
)
app.use(express.json())

app.get('/api/health', (_req, res) => res.json({ status: 'ok' }))
app.use('/api/auth', authRoutes)
app.use('/api/tasks', taskRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, _req, res, _next) => {
  console.error(err)
  res.status(500).json({ message: 'Internal server error' })
})

export default app
