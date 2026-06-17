import { Users, Clock, CalendarDays, TrendingUp } from 'lucide-react'
import { PageHeader } from '@/components/common/PageHeader'
import { StatCard } from '@/components/common/StatCard'

const stats = [
  {
    title: 'Total Employees',
    value: '248',
    change: '+12 this month',
    icon: Users,
  },
  {
    title: 'Present Today',
    value: '231',
    change: '93% attendance',
    icon: Clock,
  },
  {
    title: 'Pending Leaves',
    value: '18',
    change: '5 need approval',
    icon: CalendarDays,
  },
  {
    title: 'Avg Performance',
    value: '4.2',
    change: '+0.3 vs last quarter',
    icon: TrendingUp,
  },
]

export function DashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Dashboard"
        description="Overview of your organization's HR metrics and activity."
      />

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">
            Recent Activity
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Employee onboarding, leave requests, and payroll updates will appear here.
          </p>
          <ul className="mt-4 space-y-3 text-sm text-foreground">
            <li className="rounded-lg bg-muted px-3 py-2">
              3 new employees onboarded this week
            </li>
            <li className="rounded-lg bg-muted px-3 py-2">
              12 leave requests pending approval
            </li>
            <li className="rounded-lg bg-muted px-3 py-2">
              Payroll run scheduled for end of month
            </li>
          </ul>
        </section>

        <section className="rounded-xl border border-border bg-card p-6">
          <h2 className="text-lg font-semibold text-card-foreground">
            Quick Actions
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Common HR tasks and shortcuts for your role.
          </p>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            {['Add Employee', 'Review Leaves', 'Run Report', 'View Payroll'].map(
              (action) => (
                <button
                  key={action}
                  type="button"
                  className="rounded-lg border border-border bg-background px-4 py-3 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted"
                >
                  {action}
                </button>
              ),
            )}
          </div>
        </section>
      </div>
    </div>
  )
}
