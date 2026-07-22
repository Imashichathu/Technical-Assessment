import 'dotenv/config'
import app from './app.js'
import { initDatabase } from './config/db.js'
import { seedAdmin } from './utils/seedAdmin.js'

const PORT = process.env.PORT || 5000

async function start() {
  await initDatabase()
  await seedAdmin()

  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`)
  })
}

start().catch((err) => {
  console.error('Failed to start server:', err)
  process.exit(1)
})
