import type { Role } from '@/lib/constants'

export interface NavItem {
  label: string
  path: string
  icon: string
  roles: Role[]
}

export const ROUTES = {
  LOGIN: '/login',
  DASHBOARD: '/dashboard',
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: '/employees/:id',
  ATTENDANCE: '/attendance',
  LEAVE: '/leave',
  PAYROLL: '/payroll',
  PERFORMANCE: '/performance',
  RECRUITMENT: '/recruitment',
  AI_INSIGHTS: '/ai-insights',
  REPORTS: '/reports',
  NOTIFICATIONS: '/notifications',
  SETTINGS: '/settings',
} as const

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: 'LayoutDashboard', roles: ['admin', 'hr_manager', 'manager', 'employee'] },
  { label: 'Employees', path: ROUTES.EMPLOYEES, icon: 'Users', roles: ['admin', 'hr_manager', 'manager'] },
  { label: 'Attendance', path: ROUTES.ATTENDANCE, icon: 'Clock', roles: ['admin', 'hr_manager', 'manager', 'employee'] },
  { label: 'Leave', path: ROUTES.LEAVE, icon: 'CalendarDays', roles: ['admin', 'hr_manager', 'manager', 'employee'] },
  { label: 'Payroll', path: ROUTES.PAYROLL, icon: 'Wallet', roles: ['admin', 'hr_manager'] },
  { label: 'Performance', path: ROUTES.PERFORMANCE, icon: 'TrendingUp', roles: ['admin', 'hr_manager', 'manager'] },
  { label: 'Recruitment', path: ROUTES.RECRUITMENT, icon: 'Briefcase', roles: ['admin', 'hr_manager'] },
  { label: 'AI Insights', path: ROUTES.AI_INSIGHTS, icon: 'Sparkles', roles: ['admin', 'hr_manager', 'manager'] },
  { label: 'Reports', path: ROUTES.REPORTS, icon: 'BarChart3', roles: ['admin', 'hr_manager', 'manager'] },
  { label: 'Notifications', path: ROUTES.NOTIFICATIONS, icon: 'Bell', roles: ['admin', 'hr_manager', 'manager', 'employee'] },
  { label: 'Settings', path: ROUTES.SETTINGS, icon: 'Settings', roles: ['admin', 'hr_manager', 'manager', 'employee'] },
]
