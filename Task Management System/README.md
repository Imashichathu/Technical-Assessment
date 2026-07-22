# Task Management System

A full-stack task management application with JWT authentication, a live dashboard, and complete task CRUD — including search, filtering, sorting, and pagination.

## Table of Contents

- [Project Overview](#project-overview)
- [Technology Stack](#technology-stack)
- [Project Structure](#project-structure)
- [Installation Instructions](#installation-instructions)
- [Environment Variables](#environment-variables)
- [Database Setup](#database-setup)
- [Running the Backend](#running-the-backend)
- [Running the Frontend](#running-the-frontend)
- [Running Tests](#running-tests)
- [API Documentation](#api-documentation)
- [Assumptions Made](#assumptions-made)
- [Known Limitations](#known-limitations)
- [Bonus Features](#bonus-features)

## Project Overview

This app lets a signed-in user manage a personal task list:

- **Authentication** — email/password login against a seeded admin account, JWT-based sessions, logout.
- **Dashboard** — at-a-glance stat cards (Total, Pending, In Progress, Completed, Overdue).
- **Task management** — full create/read/update/delete for tasks (title, description, priority, status, due date), each tracked with created/updated timestamps.
- **Search, filtering, sorting & pagination** — search by title, filter by status/priority (combinable), sort by newest/oldest/due date, and a paginated list view.
- **Validation** — required fields and business rules (e.g. due date can't be in the past when creating a task) enforced on both the client and the server.
- **Responsive, themeable UI** — usable on desktop, tablet, and mobile, with a light/dark toggle on the dashboard.

## Technology Stack

**Frontend**
- React 19 + TypeScript, built with Vite
- `react-router-dom` for routing
- `axios` for HTTP requests
- Plain CSS (custom properties for theming), no UI framework
- Vitest for unit tests

**Backend**
- Node.js + Express (ESM)
- `mysql2` (promise API) for MySQL access
- `jsonwebtoken` for JWT auth, `bcryptjs` for password hashing
- `cors`, `dotenv`
- Vitest for unit tests

**Database**
- MySQL 8

## Project Structure

```
Task Management System/
├── frontend/               # React + Vite app
│   └── src/
│       ├── pages/           # Login, Dashboard
│       ├── components/      # Modal, TaskTable, TaskFormModal, TaskFilters, Pagination, etc.
│       ├── context/          # Auth, Theme-aware Toast provider
│       ├── hooks/            # useAuth, useTheme, useToast
│       ├── lib/               # api client, tasksApi, taskFilters (+ its unit tests)
│       └── types/             # shared TypeScript types
├── backend/                # Express API
│   └── src/
│       ├── config/            # MySQL pool + schema bootstrap
│       ├── controllers/        # auth.controller.js, task.controller.js
│       ├── routes/              # auth.routes.js, task.routes.js
│       ├── middleware/           # JWT auth guard
│       ├── validators/            # task.validator.js (+ its unit tests)
│       └── utils/                  # asyncHandler, admin seed
└── database/
    └── schema.sql            # Reference SQL (the backend also creates this automatically)
```

## Installation Instructions

Prerequisites: **Node.js 18+**, **npm**, and a local **MySQL 8** server.

```bash
git clone <this-repo-url>
cd "Task Management System"

cd backend && npm install
cd ../frontend && npm install
```

## Environment Variables

### `backend/.env` (copy from `backend/.env.example`)

| Variable          | Description                                      | Example                 |
| ----------------- | ------------------------------------------------- | ----------------------- |
| `PORT`            | Port the API listens on                           | `5000`                  |
| `NODE_ENV`        | Environment name                                  | `development`           |
| `CLIENT_ORIGIN`   | Allowed CORS origin (the frontend's URL)          | `http://localhost:5173` |
| `DB_HOST`         | MySQL host                                        | `localhost`              |
| `DB_PORT`         | MySQL port                                        | `3306`                   |
| `DB_USER`         | MySQL user                                        | `root`                   |
| `DB_PASSWORD`     | MySQL password                                    | *(your password)*        |
| `DB_NAME`         | Database name (created automatically if missing) | `task_management_system` |
| `JWT_SECRET`      | Secret used to sign JWTs                          | *(any long random string)* |
| `JWT_EXPIRES_IN`  | Token lifetime                                    | `1d`                      |

### `frontend/.env` (copy from `frontend/.env.example`)

| Variable        | Description                    | Example                      |
| --------------- | ------------------------------- | ----------------------------- |
| `VITE_API_URL`  | Base URL of the backend API     | `http://localhost:5000/api`   |

## Database Setup

No manual SQL import is required. On startup, the backend:

1. Connects to MySQL and runs `CREATE DATABASE IF NOT EXISTS <DB_NAME>`.
2. Creates the `users` and `tasks` tables if they don't already exist (and migrates in the `users.updated_at` column if it's missing from an older install).
3. Seeds the default admin user (bcrypt-hashed password) if it doesn't already exist.

`database/schema.sql` is provided as a reference if you'd rather set the schema up manually — it mirrors exactly what the backend creates automatically.

**Schema**

```
users                          tasks
├── id            PK           ├── id            PK
├── name                       ├── user_id        FK → users.id
├── email         UNIQUE       ├── title
├── password      (hashed)     ├── description
├── created_at                 ├── priority       ENUM(Low, Medium, High)
└── updated_at                 ├── status         ENUM(Pending, In Progress, Completed)
                                ├── due_date
                                ├── created_at
                                └── updated_at
```

## Running the Backend

```bash
cd backend
npm run dev       # nodemon, auto-restarts on changes — http://localhost:5000
# or: npm start    # plain node, no auto-restart
```

Health check: `GET http://localhost:5000/api/health` → `{ "status": "ok" }`

## Running the Frontend

```bash
cd frontend
npm run dev        # http://localhost:5173
```

### Default login

| Email             | Password |
| ----------------- | -------- |
| admin@test.com    | 123456   |

No registration screen exists — this account is seeded automatically by the backend.

## Running Tests

```bash
cd backend && npm test    # Vitest — task validation rules
cd frontend && npm test   # Vitest — task search/filter/sort/overdue logic
```

## API Documentation

All `/api/tasks/*` routes require `Authorization: Bearer <token>` and only ever operate on the authenticated user's own tasks.

### Auth

| Method | Route               | Auth | Body                       | Response                              |
| ------ | ------------------- | ---- | --------------------------- | -------------------------------------- |
| POST   | `/api/auth/login`   | No   | `{ email, password }`       | `{ token, user: { id, name, email } }` |
| GET    | `/api/auth/me`      | Yes  | —                            | `{ user }`                             |
| POST   | `/api/auth/logout`  | Yes  | —                            | `{ message }`                          |

### Tasks

| Method | Route              | Body                                                          | Response                    |
| ------ | ------------------ | --------------------------------------------------------------- | ----------------------------- |
| GET    | `/api/tasks`       | —                                                                | `{ tasks: Task[] }`           |
| GET    | `/api/tasks/:id`   | —                                                                | `{ task }` or `404`           |
| POST   | `/api/tasks`       | `{ title, description?, priority, status?, dueDate }`           | `201 { task }`                |
| PUT    | `/api/tasks/:id`   | Any subset of `{ title, description, priority, status, dueDate }` | `{ task }` or `404`         |
| DELETE | `/api/tasks/:id`   | —                                                                | `204` or `404`                |

**Task shape**

```jsonc
{
  "id": 1,
  "title": "Write report",
  "description": "Quarterly summary",
  "priority": "High",       // Low | Medium | High
  "status": "Pending",      // Pending | In Progress | Completed
  "dueDate": "2026-08-01",  // YYYY-MM-DD
  "createdAt": "2026-07-22T09:16:02.000Z",
  "updatedAt": "2026-07-22T09:16:02.000Z"
}
```

**Validation rules** (checked on both frontend and backend):

- `title` — required, ≤ 200 characters.
- `priority` — required, one of `Low` / `Medium` / `High`.
- `status` — one of `Pending` / `In Progress` / `Completed` (defaults to `Pending` on create).
- `dueDate` — required, valid date; **cannot be earlier than today when creating a task**. Editing an existing task does not re-check this, so an already-overdue task can still have its other fields updated.

Error responses use `{ message, errors? }` with `4xx` status codes.

## Assumptions Made

- Single hardcoded admin account per the spec — no registration flow, no multi-user management UI.
- Tasks are still scoped by `user_id` (a "may add additional fields" allowance) so the schema is ready for multi-user support later, even though only one user exists today.
- The "due date cannot be earlier than today" rule applies to **creating** tasks only. Enforcing it on every edit would make it impossible to update any field on a task that has already become overdue — which conflicts with the Overdue stat the dashboard is built to surface.
- Search, filtering, sorting, and pagination all run **client-side** over the full task list returned by `GET /api/tasks`, since the task counts expected here are small. See Known Limitations.
- JWT is stored in `localStorage` on the frontend for simplicity.
- The login screen keeps a fixed, deliberately-designed dark theme; the light/dark toggle applies to the dashboard only.

## Known Limitations

- **No registration / user management** — by design, per the spec.
- **Client-side data operations** — search/filter/sort/pagination operate on the full fetched task list rather than server-side query params. Fine at the scale this app targets; a production system with large task counts would want to move these to the API (e.g. `?page=&search=&status=`).
- **No refresh tokens** — JWTs simply expire (`JWT_EXPIRES_IN`) and require re-login; there's no silent refresh.
- **Test coverage is unit-level only** — Vitest covers the pure validation and filter/sort logic on both ends; there are no integration tests against a live database or end-to-end browser tests.
- **Local-dev secrets** — the committed `.env` is for local development only (a throwaway `JWT_SECRET` and local MySQL credentials); rotate both before any real deployment.

## Bonus Features

| Feature                | Status | Notes                                                                 |
| ----------------------- | ------ | ---------------------------------------------------------------------- |
| Dark Mode & Light Mode | ✅     | Toggle in the dashboard header, persisted in `localStorage`. Login page keeps its own fixed dark design intentionally. |
| Toast Notifications    | ✅     | Success/error toasts for task create/update/delete, stacked bottom-right, auto-dismiss. |
| Pagination             | ✅     | Client-side, 8 tasks per page, resets to page 1 whenever search/filters/sort change. |
| Loading Indicators     | ✅     | Spinners on login, logout, save, and delete actions; a loading state while the task list fetches. |
| Unit Tests             | ✅     | Backend: task validation rules. Frontend: search/filter/sort and overdue-detection logic. |
