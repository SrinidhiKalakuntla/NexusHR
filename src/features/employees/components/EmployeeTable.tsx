import { useNavigate } from 'react-router-dom'
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react'
import { useState } from 'react'
import { EmployeeAvatar } from './EmployeeAvatar'
import { EmployeeStatusBadge } from './EmployeeStatusBadge'
import { ROUTES } from '@/routes/route-config'
import { usePermissions } from '@/hooks/usePermissions'
import { formatDate } from '@/lib/utils'
import type { Employee } from '@/types/employee'

interface EmployeeTableProps {
  employees: Employee[]
  sortBy: 'name' | 'joinDate' | 'department'
  sortOrder: 'asc' | 'desc'
  onSortChange: (sortBy: 'name' | 'joinDate' | 'department') => void
  onEdit: (employee: Employee) => void
  onDelete: (employee: Employee) => void
}

const COLUMNS: Array<{ key: 'name' | 'joinDate' | 'department'; label: string }> = [
  { key: 'name', label: 'Employee' },
  { key: 'department', label: 'Department' },
  { key: 'joinDate', label: 'Join Date' },
]

export function EmployeeTable({
  employees,
  sortBy,
  sortOrder,
  onSortChange,
  onEdit,
  onDelete,
}: EmployeeTableProps) {
  const navigate = useNavigate()
  const { hasRole } = usePermissions()
  const [openMenuId, setOpenMenuId] = useState<string | null>(null)
  const canManage = hasRole(['admin', 'hr_manager'])

  const renderSortIcon = (column: 'name' | 'joinDate' | 'department') => {
    if (sortBy !== column) {
      return <ArrowUpDown className="h-3.5 w-3.5 text-muted-foreground" />
    }
    return sortOrder === 'asc' ? (
      <ArrowUp className="h-3.5 w-3.5 text-foreground" />
    ) : (
      <ArrowDown className="h-3.5 w-3.5 text-foreground" />
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
            {COLUMNS.map((column) => (
              <th key={column.key} className="px-4 py-3 font-medium">
                <button
                  type="button"
                  onClick={() => onSortChange(column.key)}
                  className="inline-flex items-center gap-1.5 hover:text-foreground"
                >
                  {column.label}
                  {renderSortIcon(column.key)}
                </button>
              </th>
            ))}
            <th className="px-4 py-3 font-medium">Designation</th>
            <th className="px-4 py-3 font-medium">Status</th>
            <th className="px-4 py-3 font-medium">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {employees.map((employee) => (
            <tr
              key={employee.id}
              className="cursor-pointer transition-colors hover:bg-muted/60"
              onClick={() => navigate(`${ROUTES.EMPLOYEES}/${employee.id}`)}
            >
              <td className="px-4 py-3">
                <div className="flex items-center gap-3">
                  <EmployeeAvatar
                    firstName={employee.firstName}
                    lastName={employee.lastName}
                    avatarUrl={employee.avatarUrl}
                    size="sm"
                  />
                  <div>
                    <p className="font-medium text-foreground">
                      {employee.firstName} {employee.lastName}
                    </p>
                    <p className="text-xs text-muted-foreground">{employee.email}</p>
                  </div>
                </div>
              </td>
              <td className="px-4 py-3 text-foreground">{employee.department}</td>
              <td className="px-4 py-3 text-muted-foreground">
                {formatDate(employee.joinDate)}
              </td>
              <td className="px-4 py-3 text-foreground">{employee.designation}</td>
              <td className="px-4 py-3">
                <EmployeeStatusBadge status={employee.status} />
              </td>
              <td className="px-4 py-3 text-right">
                {canManage && (
                  <div className="relative inline-block text-left">
                    <button
                      type="button"
                      onClick={(event) => {
                        event.stopPropagation()
                        setOpenMenuId(openMenuId === employee.id ? null : employee.id)
                      }}
                      className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label={`Actions for ${employee.firstName} ${employee.lastName}`}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </button>

                    {openMenuId === employee.id && (
                      <>
                        <div
                          className="fixed inset-0 z-10"
                          onClick={(event) => {
                            event.stopPropagation()
                            setOpenMenuId(null)
                          }}
                        />
                        <div className="absolute right-0 z-20 mt-1 w-36 overflow-hidden rounded-lg border border-border bg-card shadow-lg">
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              setOpenMenuId(null)
                              onEdit(employee)
                            }}
                            className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm text-foreground hover:bg-muted"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation()
                              setOpenMenuId(null)
                              onDelete(employee)
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
