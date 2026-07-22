# Task Management System

A full-stack Task Management System. **Phase 1** implements user authentication (login/logout) with JWT.

## Stack

- **Frontend:** React + TypeScript + Vite, `react-router-dom`, `axios`
- **Backend:** Node.js + Express, JWT auth, `bcryptjs` for password hashing
- **Database:** MySQL (`mysql2`)

## Project structure

```
Task Management System/
├── frontend/       # React + Vite app
├── backend/        # Express API
└── database/       # SQL schema reference
```

## Default login

No registration is required. Use:

| Email             | Password |
| ----------------- | -------- |
| admin@test.com    | 123456   |

The backend automatically creates the `users` table and seeds this admin account (bcrypt-hashed) the first time it starts.

## Running locally

### 1. Database

Make sure a local MySQL server is running. The backend will create the `task_management_system` database and `users` table automatically — no manual SQL import is required (see `database/schema.sql` for reference).

### 2. Backend

```bash
cd backend
npm install
npm run dev       # http://localhost:5000
```

Configure `backend/.env` (copy from `backend/.env.example`) with your MySQL credentials, a `JWT_SECRET`, and `CLIENT_ORIGIN` (defaults to `http://localhost:5173`).

### 3. Frontend

```bash
cd frontend
npm install
npm run dev        # http://localhost:5173
```

Configure `frontend/.env` (copy from `frontend/.env.example`) with `VITE_API_URL` pointing at the backend.

## Auth API

| Method | Route             | Auth | Description                    |
| ------ | ----------------- | ---- | ------------------------------ |
| POST   | `/api/auth/login`  | No   | Returns a JWT + user profile   |
| GET    | `/api/auth/me`     | Yes  | Returns the current user       |
| POST   | `/api/auth/logout` | Yes  | Stateless logout acknowledgement |

The frontend stores the JWT in `localStorage` and attaches it as a `Bearer` token on every request.
