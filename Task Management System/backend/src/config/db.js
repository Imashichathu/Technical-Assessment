import mysql from 'mysql2/promise'
import 'dotenv/config'

const baseConfig = {
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
}

export const pool = mysql.createPool({
  ...baseConfig,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
})

export async function initDatabase() {
  const rootConnection = await mysql.createConnection(baseConfig)
  await rootConnection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``)
  await rootConnection.end()

  await pool.query(`
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(150) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `)
}
