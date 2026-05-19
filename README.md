# Smart Leads Dashboard

A full-stack MERN lead management dashboard built for the Full Stack Internship Assignment. It uses React, TypeScript, TailwindCSS, Express, TypeScript, MongoDB, Mongoose, JWT auth, RBAC, validation, backend pagination, debounced search, CSV export, Docker, and dark mode.

## Features

- JWT registration/login with bcrypt password hashing
- Protected routes and role-based access control
- Admin and Sales User roles
- Lead CRUD with typed Mongoose models
- Combined filters for status, source, search, and sort
- Backend pagination with `skip`, `limit`, and metadata
- Debounced frontend search
- CSV export using current filters
- Loading, empty, error, and form validation states
- Responsive dashboard UI with dark mode
- Docker setup for client, server, and MongoDB

## Tech Stack

- Frontend: React, TypeScript, Vite, TailwindCSS, React Router, lucide-react
- Backend: Node.js, Express, TypeScript, MongoDB, Mongoose, Zod, JWT, bcrypt
- DevOps: Docker Compose

## Local Setup

1. Install dependencies:

```bash
npm install
```

2. Create environment files:

```bash
cp .env.example server/.env
cp .env.example client/.env
```

For `client/.env`, only `VITE_API_URL=http://localhost:5000/api` is required.

3. Start MongoDB locally or use Docker:

```bash
docker compose up mongo
```

4. Run the app:

```bash
npm run dev
```

Client: `http://localhost:5173`

API: `http://localhost:5000/api`

## Seed Demo Data

After MongoDB is running:

```bash
npm run seed
```

Demo users:

- Admin: `admin@smartleads.dev` / `Password123`
- Sales: `sales@smartleads.dev` / `Password123`

## Docker Setup

Run the complete stack:

```bash
docker compose up --build
```

Client: `http://localhost:5173`

API: `http://localhost:5000/api`

## Scripts

- `npm run dev` - start client and server in development
- `npm run build` - build both workspaces
- `npm run lint` - run TypeScript checks
- `npm run seed` - create demo users and sample leads

## API Documentation

See [docs/API.md](docs/API.md).

## Assignment Coverage

- TypeScript on frontend and backend
- Clean folder structure
- Request validation and centralized errors
- REST API standards with proper status codes
- Reusable frontend components
- Loading, empty, and error UI states
- `.env.example`, Docker setup, API docs, and setup instructions
