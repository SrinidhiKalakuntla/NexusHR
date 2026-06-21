import { AlertTriangle, Loader2, X } from 'lucide-react'
import { useEffect, useState } from 'react'
import { employeeService } from '../services/employee.service'
import type { Employee } from '@/types/employee'

interface DeleteEmployeeDialogProps {
  employee: Employee | null
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteEmployeeDialog({
  employee,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteEmployeeDialogProps) {
  const [hasDirectReports, setHasDirectReports] = useState(false)
  const [isChecking, setIsChecking] = useState(false)

  useEffect(() => {
    if (!employee) {
      setHasDirectReports(false)
      return
    }

    let cancelled = false
    setIsChecking(true)

    employeeService
      .hasDirectReports(employee.id)
      .then((result) => {
        if (!cancelled) setHasDirectReports(result)
      })
      .finally(() => {
        if (!cancelled) setIsChecking(false)
      })

    return () => {
      cancelled = true
    }
  }, [employee])

  if (!employee) return null

  const blocked = hasDirectReports

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="fixed inset-0 bg-black/50"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-employee-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onCancel}
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Close"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <h2 id="delete-employee-title" className="mt-4 text-lg font-semibold text-card-foreground">
          Remove {employee.firstName} {employee.lastName}?
        </h2>

        {blocked ? (
          <p className="mt-2 text-sm text-muted-foreground">
            This employee has direct reports assigned to them. Reassign their reports to another
            manager before removing this record.
          </p>
        ) : (
          <p className="mt-2 text-sm text-muted-foreground">
            This will permanently remove the employee record. This action cannot be undone.
          </p>
        )}

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isDeleting || isChecking || blocked}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Remove employee
          </button>
        </div>
      </div>
    </div>
  )
}
