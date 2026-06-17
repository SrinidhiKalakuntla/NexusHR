import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  change: string
  icon: LucideIcon
}

export function StatCard({ title, value, change, icon: Icon }: StatCardProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-muted-foreground">{title}</p>
        <div className="rounded-lg bg-accent p-2 text-accent-foreground">
          <Icon className="h-4 w-4" />
        </div>
      </div>
      <p className="mt-3 text-2xl font-bold text-card-foreground">{value}</p>
      <p className="mt-1 text-xs text-muted-foreground">{change}</p>
    </div>
  )
}
