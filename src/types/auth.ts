import type { Role } from '@/lib/constants'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface AuthResponse {
  user: User
  token: string
}
