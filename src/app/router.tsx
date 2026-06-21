import { Navigate, Route, Routes } from 'react-router-dom'
import { AppShell } from '@/components/layout/AppShell'
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage'
import { LoginPage } from '@/features/auth/pages/LoginPage'
import { EmployeeDetailPage } from '@/features/employees/pages/EmployeeDetailPage'
import { EmployeeListPage } from '@/features/employees/pages/EmployeeListPage'
import { ProtectedRoute, PublicRoute } from '@/routes/ProtectedRoute'
import { ROUTES } from '@/routes/route-config'

function PlaceholderPage({ title }: { title: string }) {
  return (
    <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
      <h1 className="text-xl font-semibold text-card-foreground">{title}</h1>
      <p className="mt-2 text-sm text-muted-foreground">
        This module will be implemented in a future phase.
      </p>
    </div>
  )
}

export function AppRouter() {
  return (
    <Routes>
      <Route element={<PublicRoute />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AppShell />}>
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          <Route path={ROUTES.EMPLOYEES} element={<EmployeeListPage />} />
          <Route path={ROUTES.EMPLOYEE_DETAIL} element={<EmployeeDetailPage />} />
          <Route
            path={ROUTES.ATTENDANCE}
            element={<PlaceholderPage title="Attendance Management" />}
          />
          <Route
            path={ROUTES.LEAVE}
            element={<PlaceholderPage title="Leave Management" />}
          />
          <Route
            path={ROUTES.PAYROLL}
            element={<PlaceholderPage title="Payroll" />}
          />
          <Route
            path={ROUTES.PERFORMANCE}
            element={<PlaceholderPage title="Performance Management" />}
          />
          <Route
            path={ROUTES.RECRUITMENT}
            element={<PlaceholderPage title="Recruitment" />}
          />
          <Route
            path={ROUTES.AI_INSIGHTS}
            element={<PlaceholderPage title="AI Insights" />}
          />
          <Route
            path={ROUTES.REPORTS}
            element={<PlaceholderPage title="Reporting" />}
          />
          <Route
            path={ROUTES.NOTIFICATIONS}
            element={<PlaceholderPage title="Notifications" />}
          />
          <Route
            path={ROUTES.SETTINGS}
            element={<PlaceholderPage title="Settings" />}
          />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
      <Route path="*" element={<Navigate to={ROUTES.DASHBOARD} replace />} />
    </Routes>
  )
}
