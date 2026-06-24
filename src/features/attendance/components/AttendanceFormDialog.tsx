import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { DEPARTMENTS } from '@/types/employee'
import type { AttendanceRecord, CreateAttendanceInput } from '@/types/attendance'
import type { AttendanceFormMode } from '../types'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

const attendanceFormSchema = z
  .object({
    employeeId: z.string().trim().min(1, 'Employee ID is required'),
    employeeCode: z.string().trim().min(1, 'Employee code is required'),
    employeeName: z.string().trim().min(1, 'Employee name is required'),
    department: z.string().min(1, 'Select a department'),
    date: z.string().min(1, 'Date is required'),
    checkIn: z
      .string()
      .optional()
      .refine((v) => !v || timeRegex.test(v), 'Enter time in HH:MM format'),
    checkOut: z
      .string()
      .optional()
      .refine((v) => !v || timeRegex.test(v), 'Enter time in HH:MM format'),
    status: z.enum(['present', 'absent', 'late', 'half_day', 'work_from_home']),
    notes: z.string().max(500).optional(),
  })
  .refine(
    (data) => {
      if (!data.checkIn || !data.checkOut) return true
      const [inH, inM] = data.checkIn.split(':').map(Number)
      const [outH, outM] = data.checkOut.split(':').map(Number)
      return outH * 60 + outM > inH * 60 + inM
    },
    { message: 'Check-out must be later than check-in', path: ['checkOut'] },
  )

type AttendanceFormSchema = z.infer<typeof attendanceFormSchema>

interface AttendanceFormDialogProps {
  mode: AttendanceFormMode
  initialValues?: AttendanceRecord
  isSubmitting: boolean
  onSubmit: (input: CreateAttendanceInput) => void
  onCancel: () => void
}

function toFormDefaults(record?: AttendanceRecord): AttendanceFormSchema {
  return {
    employeeId: record?.employeeId ?? '',
    employeeCode: record?.employeeCode ?? '',
    employeeName: record?.employeeName ?? '',
    department: record?.department ?? '',
    date: record?.date ?? new Date().toISOString().slice(0, 10),
    checkIn: record?.checkIn ?? '',
    checkOut: record?.checkOut ?? '',
    status: record?.status ?? 'present',
    notes: record?.notes ?? '',
  }
}

const fieldClass = (hasError: boolean) =>
  [
    'w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none ring-primary focus:ring-2',
    hasError ? 'border-red-400' : 'border-border',
  ].join(' ')

interface FieldProps {
  label: string
  error?: string
  children: React.ReactNode
}

function Field({ label, error, children }: FieldProps) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-sm font-medium text-foreground">{label}</span>
      {children}
      {error && (
        <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>
      )}
    </label>
  )
}

export function AttendanceFormDialog({
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: AttendanceFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AttendanceFormSchema>({
    resolver: zodResolver(attendanceFormSchema),
    defaultValues: toFormDefaults(initialValues),
  })

  useEffect(() => {
    reset(toFormDefaults(initialValues))
  }, [initialValues, reset])

  const submit = handleSubmit((values) => {
    onSubmit({
      employeeId: values.employeeId.trim(),
      employeeCode: values.employeeCode.trim(),
      employeeName: values.employeeName.trim(),
      department: values.department,
      date: values.date,
      checkIn: values.checkIn?.trim() || null,
      checkOut: values.checkOut?.trim() || null,
      status: values.status,
      notes: values.notes?.trim() ?? '',
    })
  })

  const title = mode === 'create' ? 'Add attendance record' : 'Edit attendance record'
  const submitLabel = mode === 'create' ? 'Add record' : 'Save changes'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="attendance-form-title"
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 id="attendance-form-title" className="text-lg font-semibold text-card-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            aria-label="Close"
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Employee ID" error={errors.employeeId?.message}>
              <input
                {...register('employeeId')}
                placeholder="e.g. EMP1001"
                autoFocus
                className={fieldClass(Boolean(errors.employeeId))}
              />
            </Field>

            <Field label="Employee Code" error={errors.employeeCode?.message}>
              <input
                {...register('employeeCode')}
                placeholder="e.g. EMP1001"
                className={fieldClass(Boolean(errors.employeeCode))}
              />
            </Field>

            <Field label="Employee Name" error={errors.employeeName?.message}>
              <input
                {...register('employeeName')}
                placeholder="Full name"
                className={fieldClass(Boolean(errors.employeeName))}
              />
            </Field>

            <Field label="Department" error={errors.department?.message}>
              <select
                {...register('department')}
                className={fieldClass(Boolean(errors.department))}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Date" error={errors.date?.message}>
              <input
                type="date"
                {...register('date')}
                className={fieldClass(Boolean(errors.date))}
              />
            </Field>

            <Field label="Status" error={errors.status?.message}>
              <select {...register('status')} className={fieldClass(Boolean(errors.status))}>
                <option value="present">Present</option>
                <option value="absent">Absent</option>
                <option value="late">Late</option>
                <option value="half_day">Half Day</option>
                <option value="work_from_home">Work From Home</option>
              </select>
            </Field>

            <Field label="Check-In Time (HH:MM)" error={errors.checkIn?.message}>
              <input
                type="time"
                {...register('checkIn')}
                className={fieldClass(Boolean(errors.checkIn))}
              />
            </Field>

            <Field label="Check-Out Time (HH:MM)" error={errors.checkOut?.message}>
              <input
                type="time"
                {...register('checkOut')}
                className={fieldClass(Boolean(errors.checkOut))}
              />
            </Field>

            <div className="sm:col-span-2">
              <Field label="Notes (optional)" error={errors.notes?.message}>
                <textarea
                  {...register('notes')}
                  rows={3}
                  placeholder="Any additional notes..."
                  className={`resize-none ${fieldClass(Boolean(errors.notes))}`}
                />
              </Field>
            </div>
          </div>

          <div className="mt-6 flex justify-end gap-2 border-t border-border pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="rounded-lg border border-border px-4 py-2 text-sm font-medium text-foreground hover:bg-muted"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
              {submitLabel}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
