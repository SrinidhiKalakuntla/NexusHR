# NexusHR

A modern Human Resources Management System built with React, TypeScript, and Vite.

## Tech Stack

- React 19
- TypeScript
- Vite
- TailwindCSS
- Zustand (client state)
- TanStack Query (server state)
- Axios
- React Router
- Sonner (toasts)
- Recharts
- React Flow
- React Hook Form + Zod

## Prerequisites

- Node.js 20+
- npm 10+

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Configure environment

Copy the example environment file:

```bash
cp .env.example .env
```

Available variables:

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Backend API base URL | `http://localhost:3000/api` |
| `VITE_USE_MOCK` | Enable mock data mode | `true` |

### 3. Start development server

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production

```bash
npm run build
```

### 5. Preview production build

```bash
npm run preview
```

## Demo Accounts

Use these credentials on the login page:

| Role | Email | Password |
|---|---|---|
| Admin | `admin@nexushr.com` | `admin123` |
| HR Manager | `hr@nexushr.com` | `hr123` |
| Manager | `manager@nexushr.com` | `manager123` |
| Employee | `employee@nexushr.com` | `employee123` |

## Project Structure

```
src/
├── app/           # App bootstrap, providers, router
├── assets/        # Static assets
├── components/    # Shared UI (layout, common, charts)
├── features/      # Feature modules (auth, employees, etc.)
├── hooks/         # Global React hooks
├── lib/           # Utilities, axios, query client
├── mocks/         # Mock data and MSW handlers
├── routes/        # Route guards and config
├── stores/        # Zustand stores
├── styles/        # Global CSS and themes
└── types/         # Shared TypeScript types
```

## Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Phase 0 Status

Phase 0 establishes the project foundation:

- Vite + React + TypeScript scaffold
- TailwindCSS with light/dark theme support
- App shell with sidebar, header, and theme toggle
- Protected routing with demo authentication
- Placeholder dashboard and module routes
- Folder structure for all planned HR modules

## Documentation

See the `docs/` folder and [PROJECT_REQUIREMENTS.md](./PROJECT_REQUIREMENTS.md) for full project specifications.

## License

Private — NexusHR internal project.
