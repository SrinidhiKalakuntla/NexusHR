import { Search } from 'lucide-react'
import { DEPARTMENTS } from '@/types/employee'
import type { AttendanceStatus } from '@/types/attendance'

interface AttendanceFiltersProps {
  search: string
  onSearchChange: (value: string) => void
  department: string
  onDepartmentChange: (value: string) => void
  status: AttendanceStatus | 'all'
  onStatusChange: (value: AttendanceStatus | 'all') => void
  dateFrom: string
  onDateFromChange: (value: string) => void
  dateTo: string
  onDateToChange: (value: string) => void
}

const STATUS_OPTIONS: Array<{ value: AttendanceStatus | 'all'; label: string }> = [
  { value: 'all', label: 'All statuses' },
  { value: 'present', label: 'Present' },
  { value: 'absent', label: 'Absent' },
  { value: 'late', label: 'Late' },
  { value: 'half_day', label: 'Half Day' },
  { value: 'work_from_home', label: 'Work From Home' },
]

const inputClass =
  'rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-primary placeholder:text-muted-foreground focus:ring-2'

export function AttendanceFilters({
  search,
  onSearchChange,
  department,
  onDepartmentChange,
  status,
  onStatusChange,
  dateFrom,
  onDateFromChange,
  dateTo,
  onDateToChange,
}: AttendanceFiltersProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name or employee ID..."
            aria-label="Search attendance records"
            className={`w-full pl-9 pr-3 ${inputClass}`}
          />
        </div>

        <select
          value={department}
          onChange={(e) => onDepartmentChange(e.target.value)}
          aria-label="Filter by department"
          className={`sm:w-48 ${inputClass}`}
        >
          <option value="all">All departments</option>
          {DEPARTMENTS.map((dept) => (
            <option key={dept} value={dept}>
              {dept}
            </option>
          ))}
        </select>

        <select
          value={status}
          onChange={(e) => onStatusChange(e.target.value as AttendanceStatus | 'all')}
          aria-label="Filter by status"
          className={`sm:w-48 ${inputClass}`}
        >
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground" htmlFor="date-from">
            From
          </label>
          <input
            id="date-from"
            type="date"
            value={dateFrom}
            onChange={(e) => onDateFromChange(e.target.value)}
            className={inputClass}
          />
        </div>
        <div className="flex items-center gap-2">
          <label className="text-sm text-muted-foreground" htmlFor="date-to">
            To
          </label>
          <input
            id="date-to"
            type="date"
            value={dateTo}
            onChange={(e) => onDateToChange(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>
    </div>
  )
}
