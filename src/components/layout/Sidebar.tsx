import { NavLink } from 'react-router-dom'
import {
  BarChart3,
  Bell,
  Briefcase,
  CalendarDays,
  Clock,
  LayoutDashboard,
  Settings,
  Sparkles,
  TrendingUp,
  Users,
  Wallet,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react'
import { NAV_ITEMS } from '@/routes/route-config'
import { useAuthStore } from '@/stores/auth-store'
import { useUIStore } from '@/stores/ui-store'
import { APP_NAME } from '@/lib/constants'
import { cn } from '@/lib/utils'

const iconMap = {
  LayoutDashboard,
  Users,
  Clock,
  CalendarDays,
  Wallet,
  TrendingUp,
  Briefcase,
  Sparkles,
  BarChart3,
  Bell,
  Settings,
}

export function Sidebar() {
  const user = useAuthStore((state) => state.user)
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)
  const mobileNavOpen = useUIStore((state) => state.mobileNavOpen)
  const setMobileNavOpen = useUIStore((state) => state.setMobileNavOpen)
  const toggleSidebar = useUIStore((state) => state.toggleSidebar)

  const visibleItems = NAV_ITEMS.filter((item) =>
    user ? item.roles.includes(user.role) : true,
  )

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex h-16 items-center justify-between border-b border-border px-4">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            N
          </div>
          {sidebarOpen && (
            <span className="text-lg font-semibold text-foreground">{APP_NAME}</span>
          )}
        </div>
        <button
          type="button"
          onClick={() => setMobileNavOpen(false)}
          className="rounded-lg p-1 text-muted-foreground hover:bg-muted lg:hidden"
          aria-label="Close navigation"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      <nav className="flex-1 space-y-1 overflow-y-auto p-3">
        {visibleItems.map((item) => {
          const Icon = iconMap[item.icon as keyof typeof iconMap]
          return (
            <NavLink
              key={item.path}
              to={item.path}
              onClick={() => setMobileNavOpen(false)}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-accent text-accent-foreground'
                    : 'text-sidebar-foreground hover:bg-muted hover:text-foreground',
                )
              }
            >
              <Icon className="h-4 w-4 shrink-0" />
              {(sidebarOpen || mobileNavOpen) && <span>{item.label}</span>}
            </NavLink>
          )
        })}
      </nav>

      <div className="hidden border-t border-border p-3 lg:block">
        <button
          type="button"
          onClick={toggleSidebar}
          className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          aria-label={sidebarOpen ? 'Collapse sidebar' : 'Expand sidebar'}
        >
          {sidebarOpen ? (
            <>
              <ChevronLeft className="h-4 w-4" />
              <span>Collapse</span>
            </>
          ) : (
            <ChevronRight className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  )

  return (
    <>
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 hidden border-r border-border bg-sidebar transition-all duration-300 lg:block',
          sidebarOpen ? 'w-64' : 'w-[72px]',
        )}
      >
        {sidebarContent}
      </aside>

      {mobileNavOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileNavOpen(false)}
          aria-hidden="true"
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-40 w-64 border-r border-border bg-sidebar transition-transform duration-300 lg:hidden',
          mobileNavOpen ? 'translate-x-0' : '-translate-x-full',
        )}
      >
        {sidebarContent}
      </aside>
    </>
  )
}
