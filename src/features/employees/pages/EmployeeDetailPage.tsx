import type { LucideIcon } from 'lucide-react'
import {
  ArrowLeft,
  Briefcase,
  Building2,
  Calendar,
  Mail,
  MapPin,
  Pencil,
  Phone,
  Trash2,
  Wallet,
} from 'lucide-react'
import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { EmployeeAvatar } from '../components/EmployeeAvatar'
import { DeleteEmployeeDialog } from '../components/DeleteEmployeeDialog'
import { EmployeeFormDialog } from '../components/EmployeeFormDialog'
import { EmployeeStatusBadge } from '../components/EmployeeStatusBadge'
import { useEmployee } from '../hooks/useEmployee'
import { useDeleteEmployee, useUpdateEmployee } from '../hooks/useEmployeeMutations'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { RoleGuard } from '@/components/common/RoleGuard'
import { ROUTES } from '@/routes/route-config'
import { formatDate } from '@/lib/utils'
import type { CreateEmployeeInput } from '@/types/employee'

export function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [isEditing, setIsEditing] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const { data: employee, isLoading, isError } = useEmployee(id)
  const updateMutation = useUpdateEmployee()
  const deleteMutation = useDeleteEmployee()

  if (isLoading) {
    return (
      <div className="space-y-6">
        <BackLink />
        <LoadingSkeleton />
      </div>
    )
  }

  if (isError || !employee) {
    return (
      <div className="space-y-6">
        <BackLink />
        <EmptyState
          title="Employee not found"
          description="This employee record may have been removed, or the link is invalid."
        />
      </div>
    )
  }

  const handleUpdate = (input: CreateEmployeeInput) => {
    updateMutation.mutate({ id: employee.id, input }, { onSuccess: () => setIsEditing(false) })
  }

  const handleConfirmDelete = () => {
    deleteMutation.mutate(employee.id, {
      onSuccess: () => navigate(ROUTES.EMPLOYEES),
    })
  }

  return (
    <div className="space-y-6">
      <BackLink />

      <div className="rounded-xl border border-border bg-card p-6">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex items-start gap-4">
            <EmployeeAvatar
              firstName={employee.firstName}
              lastName={employee.lastName}
              avatarUrl={employee.avatarUrl}
              size="lg"
            />
            <div>
              <h1 className="text-xl font-bold text-card-foreground">
                {employee.firstName} {employee.lastName}
              </h1>
              <p className="mt-0.5 text-sm text-muted-foreground">
                {employee.designation} · {employee.department}
              </p>
              <div className="mt-2 flex items-center gap-2">
                <EmployeeStatusBadge status={employee.status} />
                <span className="text-xs text-muted-foreground">{employee.employeeCode}</span>
              </div>
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
                Remove
              </button>
            </div>
          </RoleGuard>
        </div>

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <DetailItem icon={Mail} label="Email" value={employee.email} />
          <DetailItem icon={Phone} label="Phone" value={employee.phone || '—'} />
          <DetailItem icon={Building2} label="Department" value={employee.department} />
          <DetailItem icon={Briefcase} label="Employment type" value={formatEmploymentType(employee.employmentType)} />
          <DetailItem icon={Calendar} label="Join date" value={formatDate(employee.joinDate)} />
          <DetailItem
            icon={MapPin}
            label="Location"
            value={[employee.city, employee.country].filter(Boolean).join(', ') || '—'}
          />
          <RoleGuard roles={['admin', 'hr_manager']}>
            <DetailItem
              icon={Wallet}
              label="Annual salary"
              value={employee.salary != null ? formatCurrency(employee.salary) : '—'}
            />
          </RoleGuard>
        </div>
      </div>

      {isEditing && (
        <EmployeeFormDialog
          mode="edit"
          initialValues={employee}
          isSubmitting={updateMutation.isPending}
          onSubmit={handleUpdate}
          onCancel={() => setIsEditing(false)}
        />
      )}

      {isDeleting && (
        <DeleteEmployeeDialog
          employee={employee}
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
      onClick={() => navigate(ROUTES.EMPLOYEES)}
      className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
    >
      <ArrowLeft className="h-4 w-4" />
      Back to employees
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

function formatEmploymentType(type: string): string {
  return type
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    maximumFractionDigits: 0,
  }).format(value)
}
