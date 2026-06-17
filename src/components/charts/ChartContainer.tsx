interface ChartContainerProps {
  title: string
  children: React.ReactNode
}

export function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <div className="rounded-xl border border-border bg-card p-6">
      <h3 className="mb-4 text-lg font-semibold text-card-foreground">{title}</h3>
      <div className="h-64">{children}</div>
    </div>
  )
}
