import { Menu, Bell, LogOut } from 'lucide-react'
import { ThemeToggle } from '@/components/common/ThemeToggle'
import { useAuthStore } from '@/stores/auth-store'
import { useUIStore } from '@/stores/ui-store'
import { queryClient } from '@/lib/query-client'

export function Header() {
  const user = useAuthStore((state) => state.user)
  const clearAuth = useAuthStore((state) => state.clearAuth)
  const toggleMobileNav = useUIStore((state) => state.toggleMobileNav)

  const handleLogout = () => {
    clearAuth()
    queryClient.clear()
  }

  return (
    <header className="sticky top-0 z-20 flex h-16 items-center justify-between border-b border-border bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/80 lg:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={toggleMobileNav}
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted lg:hidden"
          aria-label="Open navigation"
        >
          <Menu className="h-4 w-4" />
        </button>
        <div>
          <p className="text-sm text-muted-foreground">Welcome back</p>
          <p className="text-base font-semibold text-foreground">
            {user?.name ?? 'Guest'}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border text-foreground hover:bg-muted"
          aria-label="Notifications"
        >
          <Bell className="h-4 w-4" />
        </button>
        <ThemeToggle />
        <button
          type="button"
          onClick={handleLogout}
          className="inline-flex h-9 items-center gap-2 rounded-lg border border-border px-3 text-sm text-foreground hover:bg-muted"
        >
          <LogOut className="h-4 w-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </div>
    </header>
  )
}
