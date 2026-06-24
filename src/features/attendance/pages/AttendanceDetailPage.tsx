import {
  ArrowLeft,
  Briefcase,
  Calendar,
  Clock,
  FileText,
  LogIn,
  LogOut,
  Pencil,
  Timer,
  Trash2,
  User,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { AttendanceFormDialog } from '../components/AttendanceFormDialog'
import { AttendanceStatusBadge } from '../components/AttendanceStatusBadge'
import { DeleteAttendanceDialog } from '../components/DeleteAttendanceDialog'
import { useAttendance } from '../hooks/useAttendance'
import { useDeleteAttendance, useUpdateAttendance } from '../hooks/useAttendanceMutations'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { RoleGuard } from '@/components/common/RoleGuard'
import { ROUTES } from '@/routes/route-config'
import { formatDate } from '@/lib/utils'
import type { CreateAttendanceInput } from '@/types/attendance'

export function AttendanceDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: record, isLoading, isError } = useAttendance(id)
  const updateMutation = useUpdateAttendance()
  const deleteMutation = useDeleteAttendance()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BackLink />
        <LoadingSkeleton />
      </div>
    )
  }

  if (isError || !record) {
    return (
      <div className="space-y-6">
        <BackLink />
        <EmptyState
          title="Record not found"
          description="This attendance record may have been removed, or the link is invalid."
        />
      </div>
    )
  }

  const handleUpdate = (input: CreateAttendanceInput) => {
    updateMutation.mutate({ id: record.id, input }, { onSuccess: () => setIsEditing(false) })
  }

  const handleConfirmDelete = () => {
    deleteMutation.mutate(record.id, {
      onSuccess: () => navigate(ROUTES.ATTENDANCE),
    })
  }

  function formatTime(time: string | null): string {
    return time ?? '—'
  }

  function formatHours(hours: number | null): string {
    if (hours === null) return '—'
    return `${hours} hours`
  }

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-xl font-bold text-card-foreground">{record.employeeName}</h1>
            <p className="mt-0.5 text-sm text-muted-foreground">
              {record.employeeCode} · {record.department}
            </p>
            <div className="mt-2 flex items-center gap-2">
              <AttendanceStatusBadge status={record.status} />
              <span className="text-xs text-muted-foreground">{formatDate(record.date)}</span>
            </div>
          </div>

          <RoleGuard roles={['admin', 'hr_manager']}>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                onClick={() => setIsEditing(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-foreground hover:bg-muted"
              >
                <Pencil className="h-4 w-4" />
                Edit
              </button>
              <button
                type="button"
                onClick={() => setIsDeleting(true)}
                className="inline-flex items-center gap-2 rounded-lg border border-border px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-500/10"
              >
                <Trash2 className="h-4 w-4" />
                Delete
              </button>
            </div>
          </RoleGuard>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem icon={User} label="Employee" value={record.employeeName} />
          <DetailItem icon={Briefcase} label="Employee ID" value={record.employeeCode} />
          <DetailItem icon={Calendar} label="Department" value={record.department} />
          <DetailItem icon={Clock} label="Date" value={formatDate(record.date)} />
          <DetailItem icon={LogIn} label="Check-In" value={formatTime(record.checkIn)} />
          <DetailItem icon={LogOut} label="Check-Out" value={formatTime(record.checkOut)} />
          <DetailItem icon={Timer} label="Total Hours" value={formatHours(record.totalHours)} />
          <DetailItem
            icon={FileText}
            label="Notes"
            value={record.notes.trim() !== '' ? record.notes : '—'}
          />
        </div>
      </div>

      {isEditing && (
        <AttendanceFormDialog
          mode="edit"
          initialValues={record}
          isSubmitting={updateMutation.isPending}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {isDeleting && (
        <DeleteAttendanceDialog
          record={record}
          isDeleting={deleteMutation.isPending}
          onConfirm={handleConfirmDelete}
          onCancel={() => setIsDeleting(false)}
        />
      )}
    </div>
  )
}

function BackLink() {
  const navigate = useNavigate()
  return (
    <button
      type="button"
      onClick={() => navigate(ROUTES.ATTENDANCE)}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to attendance
    </button>
  )
}

interface DetailItemProps {
  icon: LucideIcon
  label: string
  value: string
}

function DetailItem({ icon: Icon, label, value }: DetailItemProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="mt-0.5 rounded-lg bg-accent p-2 text-accent-foreground">
        <Icon className="h-4 w-4" />
      </div>
      <div>
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground">{value}</p>
      </div>
    </div>
  )
}
