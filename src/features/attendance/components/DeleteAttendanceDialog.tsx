import { AlertTriangle, Loader2, X } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { AttendanceRecord } from '@/types/attendance'

interface DeleteAttendanceDialogProps {
  record: AttendanceRecord | null
  isDeleting: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function DeleteAttendanceDialog({
  record,
  isDeleting,
  onConfirm,
  onCancel,
}: DeleteAttendanceDialogProps) {
  if (!record) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-attendance-title"
        className="relative w-full max-w-md rounded-2xl border border-border bg-card p-6 shadow-xl"
      >
        <button
          type="button"
          onClick={onCancel}
          aria-label="Close"
          className="absolute right-4 top-4 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-red-50 text-red-600 dark:bg-red-500/10 dark:text-red-400">
          <AlertTriangle className="h-5 w-5" />
        </div>

        <h2
          id="delete-attendance-title"
          className="mt-4 text-lg font-semibold text-card-foreground"
        >
          Delete attendance record?
        </h2>

        <p className="mt-2 text-sm text-muted-foreground">
          This will permanently remove the attendance record for{' '}
          <span className="font-medium text-foreground">{record.employeeName}</span> on{' '}
          <span className="font-medium text-foreground">{formatDate(record.date)}</span>. This
          action cannot be undone.
        </p>

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
            disabled={isDeleting}
            className="inline-flex items-center gap-2 rounded-lg bg-red-600 px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isDeleting && <Loader2 className="h-4 w-4 animate-spin" />}
            Delete record
          </button>
        </div>
      </div>
    </div>
  )
}
