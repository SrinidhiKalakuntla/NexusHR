import { cn } from '@/lib/utils'
import type { AttendanceStatus } from '@/types/attendance'

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; className: string }> = {
  present: {
    label: 'Present',
    className: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400',
  },
  absent: {
    label: 'Absent',
    className: 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400',
  },
  late: {
    label: 'Late',
    className: 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400',
  },
  half_day: {
    label: 'Half Day',
    className: 'bg-blue-50 text-blue-700 dark:bg-blue-500/10 dark:text-blue-400',
  },
  work_from_home: {
    label: 'Work From Home',
    className: 'bg-violet-50 text-violet-700 dark:bg-violet-500/10 dark:text-violet-400',
  },
}

interface AttendanceStatusBadgeProps {
  status: AttendanceStatus
  className?: string
}

export function AttendanceStatusBadge({ status, className }: AttendanceStatusBadgeProps) {
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
