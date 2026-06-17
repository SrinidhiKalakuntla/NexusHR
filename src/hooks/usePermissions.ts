import { useAuth } from './useAuth'
import type { Role } from '@/lib/constants'

export function usePermissions() {
  const { user } = useAuth()

  const hasRole = (roles: Role[]) => {
    if (!user) return false
    return roles.includes(user.role)
  }

  const isAdmin = user?.role === 'admin'
  const isHRManager = user?.role === 'hr_manager'
  const isManager = user?.role === 'manager'
  const isEmployee = user?.role === 'employee'

  return { user, hasRole, isAdmin, isHRManager, isManager, isEmployee }
}
