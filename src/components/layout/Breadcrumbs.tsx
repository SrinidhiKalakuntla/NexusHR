import { Link, useLocation } from 'react-router-dom'
import { ChevronRight } from 'lucide-react'

export function Breadcrumbs() {
  const location = useLocation()
  const segments = location.pathname.split('/').filter(Boolean)

  if (segments.length === 0) return null

  return (
    <nav aria-label="Breadcrumb" className="mb-4 flex items-center gap-1 text-sm text-muted-foreground">
      <Link to="/dashboard" className="hover:text-foreground">
        Home
      </Link>
      {segments.map((segment, index) => {
        const path = `/${segments.slice(0, index + 1).join('/')}`
        const label = segment.replace(/-/g, ' ')
        return (
          <span key={path} className="flex items-center gap-1 capitalize">
            <ChevronRight className="h-3 w-3" />
            <Link to={path} className="hover:text-foreground">
              {label}
            </Link>
          </span>
        )
      })}
    </nav>
  )
}
