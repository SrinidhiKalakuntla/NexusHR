import { Outlet } from 'react-router-dom'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { useUIStore } from '@/stores/ui-store'
import { cn } from '@/lib/utils'

export function AppShell() {
  const sidebarOpen = useUIStore((state) => state.sidebarOpen)

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />
      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300',
          sidebarOpen ? 'lg:pl-64' : 'lg:pl-[72px]',
        )}
      >
        <Header />
        <main className="flex-1 p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}
