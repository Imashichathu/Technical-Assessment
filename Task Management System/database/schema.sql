-- Task Management System database schema
-- Note: the backend also creates this automatically on startup (see backend/src/config/db.js
-- and backend/src/utils/seedAdmin.js). This file is provided for manual/reference setup.

CREATE DATABASE IF NOT EXISTS task_management_system;
USE task_management_system;

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  password VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Default login (password is bcrypt-hashed automatically by the backend on first run):
--   email:    admin@test.com
--   password: 123456
