import { zodResolver } from '@hookform/resolvers/zod'
import { Loader2, X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { DEPARTMENTS } from '@/types/employee'
import type { CreateEmployeeInput, Employee } from '@/types/employee'
import type { EmployeeFormMode } from '../types'

const employeeFormSchema = z.object({
  firstName: z.string().trim().min(1, 'First name is required').max(50),
  lastName: z.string().trim().min(1, 'Last name is required').max(50),
  email: z.string().trim().min(1, 'Email is required').email('Enter a valid email address'),
  phone: z.string().trim().optional(),
  department: z.string().min(1, 'Select a department'),
  designation: z.string().trim().min(1, 'Designation is required'),
  status: z.enum(['active', 'inactive', 'on_leave', 'terminated']),
  employmentType: z.enum(['full_time', 'part_time', 'contract', 'intern']),
  joinDate: z.string().min(1, 'Join date is required'),
  salary: z
    .string()
    .optional()
    .refine((value) => !value || /^\d+(\.\d{1,2})?$/.test(value), 'Enter a valid amount'),
})

type EmployeeFormSchema = z.infer<typeof employeeFormSchema>

interface EmployeeFormDialogProps {
  mode: EmployeeFormMode
  initialValues?: Employee
  isSubmitting: boolean
  onSubmit: (input: CreateEmployeeInput) => void
  onCancel: () => void
}

function toFormDefaults(employee?: Employee): EmployeeFormSchema {
  return {
    firstName: employee?.firstName ?? '',
    lastName: employee?.lastName ?? '',
    email: employee?.email ?? '',
    phone: employee?.phone ?? '',
    department: employee?.department ?? '',
    designation: employee?.designation ?? '',
    status: employee?.status ?? 'active',
    employmentType: employee?.employmentType ?? 'full_time',
    joinDate: employee?.joinDate ?? new Date().toISOString().slice(0, 10),
    salary: employee?.salary != null ? String(employee.salary) : '',
  }
}

export function EmployeeFormDialog({
  mode,
  initialValues,
  isSubmitting,
  onSubmit,
  onCancel,
}: EmployeeFormDialogProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<EmployeeFormSchema>({
    resolver: zodResolver(employeeFormSchema),
    defaultValues: toFormDefaults(initialValues),
  })

  useEffect(() => {
    reset(toFormDefaults(initialValues))
  }, [initialValues, reset])

  const submit = handleSubmit((values) => {
    const payload: CreateEmployeeInput = {
      firstName: values.firstName.trim(),
      lastName: values.lastName.trim(),
      email: values.email.trim(),
      phone: values.phone?.trim() || undefined,
      department: values.department,
      designation: values.designation.trim(),
      status: values.status,
      employmentType: values.employmentType,
      joinDate: values.joinDate,
      salary: values.salary ? Number(values.salary) : undefined,
    }
    onSubmit(payload)
  })

  const title = mode === 'create' ? 'Add employee' : 'Edit employee'
  const submitLabel = mode === 'create' ? 'Add employee' : 'Save changes'

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="fixed inset-0 bg-black/50" onClick={onCancel} aria-hidden="true" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="employee-form-title"
        className="relative flex max-h-[90vh] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-xl"
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-4">
          <h2 id="employee-form-title" className="text-lg font-semibold text-card-foreground">
            {title}
          </h2>
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
            aria-label="Close"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <form onSubmit={submit} className="overflow-y-auto px-6 py-5">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="First name" error={errors.firstName?.message}>
              <input
                {...register('firstName')}
                className={inputClass(Boolean(errors.firstName))}
                autoFocus
              />
            </Field>

            <Field label="Last name" error={errors.lastName?.message}>
              <input {...register('lastName')} className={inputClass(Boolean(errors.lastName))} />
            </Field>

            <Field label="Email" error={errors.email?.message}>
              <input
                type="email"
                {...register('email')}
                className={inputClass(Boolean(errors.email))}
              />
            </Field>

            <Field label="Phone" error={errors.phone?.message}>
              <input {...register('phone')} className={inputClass(Boolean(errors.phone))} />
            </Field>

            <Field label="Department" error={errors.department?.message}>
              <select
                {...register('department')}
                className={inputClass(Boolean(errors.department))}
              >
                <option value="">Select department</option>
                {DEPARTMENTS.map((dept) => (
                  <option key={dept} value={dept}>
                    {dept}
                  </option>
                ))}
              </select>
            </Field>

            <Field label="Designation" error={errors.designation?.message}>
              <input
                {...register('designation')}
                className={inputClass(Boolean(errors.designation))}
              />
            </Field>

            <Field label="Employment type" error={errors.employmentType?.message}>
              <select {...register('employmentType')} className={inputClass(false)}>
                <option value="full_time">Full-time</option>
                <option value="part_time">Part-time</option>
                <option value="contract">Contract</option>
                <option value="intern">Intern</option>
              </select>
            </Field>

            <Field label="Status" error={errors.status?.message}>
              <select {...register('status')} className={inputClass(false)}>
                <option value="active">Active</option>
                <option value="on_leave">On leave</option>
                <option value="inactive">Inactive</option>
                <option value="terminated">Terminated</option>
              </select>
            </Field>

            <Field label="Join date" error={errors.joinDate?.message}>
              <input
                type="date"
                {...register('joinDate')}
                className={inputClass(Boolean(errors.joinDate))}
              />
            </Field>

            <Field label="Annual salary (optional)" error={errors.salary?.message}>
              <input
                inputMode="decimal"
                placeholder="e.g. 85000"
                {...register('salary')}
                className={inputClass(Boolean(errors.salary))}
              />
            </Field>
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

function inputClass(hasError: boolean) {
  return [
    'w-full rounded-lg border bg-background px-3 py-2 text-sm text-foreground outline-none ring-primary focus:ring-2',
    hasError ? 'border-red-400' : 'border-border',
  ].join(' ')
}

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
      {error && <span className="mt-1 block text-xs text-red-600 dark:text-red-400">{error}</span>}
    </label>
  )
}
