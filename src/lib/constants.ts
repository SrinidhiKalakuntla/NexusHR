export const APP_NAME = 'NexusHR'

export const API_BASE_URL =
  import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api'

export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const ROLES = {
  ADMIN: 'admin',
  HR_MANAGER: 'hr_manager',
  MANAGER: 'manager',
  EMPLOYEE: 'employee',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
