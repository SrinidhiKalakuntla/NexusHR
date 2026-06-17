# Architecture

NexusHR uses a feature-based frontend architecture.

## Layers

- **UI Layer**: React components, pages, and layouts
- **State Layer**: Zustand for client state, TanStack Query for server state
- **Data Layer**: Axios API client with mock data support
- **Routing**: React Router with protected and role-based routes

## Key Decisions

- Path alias `@/` maps to `src/`
- Theme stored in Zustand with `localStorage` persistence
- Auth token stored in `localStorage` and attached via Axios interceptor
- Mock data mode controlled by `VITE_USE_MOCK` environment variable
