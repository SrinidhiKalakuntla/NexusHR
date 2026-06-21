import { cn } from '@/lib/utils'
import type { EmploymentStatus } from '@/types/employee'

const STATUS_CONFIG: Record<EmploymentStatus, { label: string; className: string }> = {
  active: {
    label: 'Active',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
  on_leave: {
    label: 'On Leave',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  },
  inactive: {
    label: 'Inactive',
    className: 'bg-slate-100 text-slate-600 dark:bg-slate-500/10 dark:text-slate-400',
  },
  terminated: {
    label: 'Terminated',
    className: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  },
}

interface EmployeeStatusBadgeProps {
  status: EmploymentStatus
  className?: string
}

export function EmployeeStatusBadge({ status, className }: EmployeeStatusBadgeProps) {
  const config = STATUS_CONFIG[status]

  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium',
        config.className,
        className,
      )}
    >
      {config.label}
    </span>
  )
}
