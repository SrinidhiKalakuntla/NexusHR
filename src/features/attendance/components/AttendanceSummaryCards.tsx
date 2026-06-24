import { Users, UserCheck, UserX, Clock, Monitor } from 'lucide-react'
import { useAttendanceSummary } from '../hooks/useAttendances'

interface SummaryCardProps {
  title: string
  value: number | string
  icon: React.ReactNode
  description: string
  colorClass: string
}

function SummaryCard({ title, value, icon, description, colorClass }: SummaryCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted-foreground">{title}</p>
          <p className="mt-1 text-2xl font-bold text-card-foreground">{value}</p>
          <p className="mt-1 text-xs text-muted-foreground">{description}</p>
        </div>
        <div className={`rounded-lg p-2.5 ${colorClass}`}>{icon}</div>
      </div>
    </div>
  )
}

export function AttendanceSummaryCards() {
  const { data, isLoading } = useAttendanceSummary()

  if (isLoading || !data) {
    return (
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
        {Array.from({ length: 5 }).map((_, i) => (
          <div
            key={i}
            className="h-28 animate-pulse rounded-xl border border-border bg-muted"
          />
        ))}
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 gap-4 lg:grid-cols-5">
      <SummaryCard
        title="Total Employees"
        value={data.totalEmployees}
        description="Across all departments"
        colorClass="bg-blue-50 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400"
        icon={<Users className="h-5 w-5" />}
      />
      <SummaryCard
        title="Present Today"
        value={data.presentToday}
        description="On-site today"
        colorClass="bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400"
        icon={<UserCheck className="h-5 w-5" />}
      />
      <SummaryCard
        title="Absent Today"
        value={data.absentToday}
        description="Not checked in"
        colorClass="bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400"
        icon={<UserX className="h-5 w-5" />}
      />
      <SummaryCard
        title="Late Arrivals"
        value={data.lateArrivals}
        description="After 9:30 AM"
        colorClass="bg-amber-50 text-amber-600 dark:bg-amber-500/10 dark:text-amber-400"
        icon={<Clock className="h-5 w-5" />}
      />
      <SummaryCard
        title="Work From Home"
        value={data.workFromHome}
        description="Remote today"
        colorClass="bg-violet-50 text-violet-600 dark:bg-violet-500/10 dark:text-violet-400"
        icon={<Monitor className="h-5 w-5" />}
      />
    </div>
  )
}
