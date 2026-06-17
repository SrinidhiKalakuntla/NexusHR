import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { Role } from '@/lib/constants'

export interface User {
  id: string
  name: string
  email: string
  role: Role
  avatar?: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  setAuth: (user: User, token: string) => void
  clearAuth: () => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      setAuth: (user, token) => {
        localStorage.setItem('nexushr_token', token)
        set({ user, token, isAuthenticated: true })
      },
      clearAuth: () => {
        localStorage.removeItem('nexushr_token')
        set({ user: null, token: null, isAuthenticated: false })
      },
    }),
    {
      name: 'nexushr-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)
