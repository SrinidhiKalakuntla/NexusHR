export function LoadingSkeleton() {
  return (
    <div className="animate-pulse space-y-3">
      <div className="h-4 w-1/3 rounded bg-muted" />
      <div className="h-10 rounded bg-muted" />
      <div className="h-10 rounded bg-muted" />
      <div className="h-10 rounded bg-muted" />
    </div>
  )
}
