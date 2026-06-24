import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { AttendanceStatusBadge } from './AttendanceStatusBadge'
import { usePermissions } from '@/hooks/usePermissions'
import { ROUTES } from '@/routes/route-config'
import { formatDate } from '@/lib/utils'
import type { AttendanceRecord } from '@/types/attendance'

type SortKey = 'date' | 'employeeName' | 'department' | 'status'

interface AttendanceTableProps {
  records: AttendanceRecord[]
  sortBy: SortKey
  sortOrder: 'asc' | 'desc'
  onSortChange: (key: SortKey) => void
  onEdit: (record: AttendanceRecord) => void
  onDelete: (record: AttendanceRecord) => void
}

const SORTABLE_COLUMNS: Array<{ key: SortKey; label: string }> = [
  { key: 'employeeName', label: 'Employee' },
  { key: 'department', label: 'Department' },
  { key: 'date', label: 'Date' },
  { key: 'status', label: 'Status' },
]

export function AttendanceTable({
  records,
  sortBy,
  sortOrder,
  onSortChange,
  onEdit,
  onDelete,
}: AttendanceTableProps) {
  const navigate = useNavigate()
  const { hasRole } = usePermissions()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const canManage = hasRole(['admin', 'hr_manager'])

  const renderSortIcon = (key: SortKey) => {
    if (sortBy !== key)
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
    return sortOrder === 'asc'
      ? <ArrowUp className="h-3.5 w-3.5 text-foreground" />
      : <ArrowDown className="h-3.5 w-3.5 text-foreground" />
  }

  function formatTime(time: string | null): string {
    if (!time) return '—'
    return time
  }

  function formatHours(hours: number | null): string {
    if (hours === null) return '—'
    return `${hours}h`
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            {SORTABLE_COLUMNS.map((col) => (
              <th key={col.key} className="px-4 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => onSortChange(col.key)}
                  className="inline-flex items-center gap-1.5 hover:text-foreground"
                >
                  {col.label}
                  {renderSortIcon(col.key)}
                </button>
              </th>
            ))}
            <th className="px-4 py-3 font-medium">Check-In</th>
            <th className="px-4 py-3 font-medium">Check-Out</th>
            <th className="px-4 py-3 font-medium">Hours</th>
            <th className="px-4 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {records.map((record) => (
            <tr
              key={record.id}
              className="cursor-pointer transition-colors hover:bg-muted/60"
              onClick={() => navigate(`${ROUTES.ATTENDANCE}/${record.id}`)}
            >
              <td className="px-4 py-3">
                <div>
                  <p className="font-medium text-foreground">{record.employeeName}</p>
                  <p className="text-xs text-muted-foreground">{record.employeeCode}</p>
                </div>
              </td>
              <td className="px-4 py-3 text-foreground">{record.department}</td>
              <td className="px-4 py-3 text-muted-foreground">{formatDate(record.date)}</td>
              <td className="px-4 py-3">
                <AttendanceStatusBadge status={record.status} />
              </td>
              <td className="px-4 py-3 text-foreground">{formatTime(record.checkIn)}</td>
              <td className="px-4 py-3 text-foreground">{formatTime(record.checkOut)}</td>
              <td className="px-4 py-3 text-foreground">{formatHours(record.totalHours)}</td>
              <td className="px-4 py-3 text-right">
                {canManage && (
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        setOpenMenuId(openMenuId === record.id ? null : record.id)
                      }}
                      aria-label={`Actions for ${record.employeeName}`}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenuId === record.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={(e) => {
                            e.stopPropagation()
                            setOpenMenuId(null)
                          }}
                        />
                        <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenMenuId(null)
                              onEdit(record)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation()
                              setOpenMenuId(null)
                              onDelete(record)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                            Delete
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
