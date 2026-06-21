import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { EmployeeFilters } from '../components/EmployeeFilters'
import { EmployeeFormDialog } from '../components/EmployeeFormDialog'
import { DeleteEmployeeDialog } from '../components/DeleteEmployeeDialog'
import { EmployeePagination } from '../components/EmployeePagination'
import { EmployeeTable } from '../components/EmployeeTable'
import { useEmployees } from '../hooks/useEmployees'
import { useCreateEmployee, useDeleteEmployee, useUpdateEmployee } from '../hooks/useEmployeeMutations'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { RoleGuard } from '@/components/common/RoleGuard'
import { useDebounce } from '@/hooks/useDebounce'
import type { CreateEmployeeInput, Employee, EmploymentStatus } from '@/types/employee'

const PAGE_SIZE = 10

export function EmployeeListPage() {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [status, setStatus] = useState<EmploymentStatus | 'all'>('all')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<'name' | 'joinDate' | 'department'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')

  const [formState, setFormState] = useState<
    { mode: 'create' } | { mode: 'edit'; employee: Employee } | null
  >(null)
  const [employeeToDelete, setEmployeeToDelete] = useState<Employee | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, isError } = useEmployees({
    search: debouncedSearch,
    department,
    status,
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
  })

  const createMutation = useCreateEmployee()
  const updateMutation = useUpdateEmployee()
  const deleteMutation = useDeleteEmployee()

  const employees = useMemo(() => data?.data ?? [], [data])

  const handleSortChange = (column: 'name' | 'joinDate' | 'department') => {
    if (sortBy === column) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const handleFormSubmit = (input: CreateEmployeeInput) => {
    if (formState?.mode === 'edit') {
      updateMutation.mutate(
        { id: formState.employee.id, input },
        { onSuccess: () => setFormState(null) },
      )
      return
    }

    createMutation.mutate(input, {
      onSuccess: () => setFormState(null),
    })
  }

  const handleConfirmDelete = () => {
    if (!employeeToDelete) return
    deleteMutation.mutate(employeeToDelete.id, {
      onSuccess: () => setEmployeeToDelete(null),
    })
  }

  const isSubmittingForm = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader
        title="Employee Management"
        description="View, add, and manage employee records across your organization."
      >
        <RoleGuard roles={['admin', 'hr_manager']}>
          <button
            type="button"
            onClick={() => setFormState({ mode: 'create' })}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add employee
          </button>
        </RoleGuard>
      </PageHeader>

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <EmployeeFilters
            search={search}
            onSearchChange={(value) => {
              setSearch(value)
              setPage(1)
            }}
            department={department}
            onDepartmentChange={(value) => {
              setDepartment(value)
              setPage(1)
            }}
            status={status}
            onStatusChange={(value) => {
              setStatus(value)
              setPage(1)
            }}
          />
        </div>

        {isLoading && (
          <div className="p-6">
            <LoadingSkeleton />
          </div>
        )}

        {isError && (
          <div className="p-6">
            <EmptyState
              title="Couldn't load employees"
              description="Something went wrong while fetching employee records. Please try again."
            />
          </div>
        )}

        {!isLoading && !isError && employees.length === 0 && (
          <div className="p-6">
            <EmptyState
              title="No employees found"
              description="Try adjusting your filters, or add a new employee to get started."
            />
          </div>
        )}

        {!isLoading && !isError && employees.length > 0 && (
          <>
            <EmployeeTable
              employees={employees}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onEdit={(employee) => setFormState({ mode: 'edit', employee })}
              onDelete={(employee) => setEmployeeToDelete(employee)}
            />
            {data && (
              <EmployeePagination
                page={data.page}
                totalPages={data.totalPages}
                total={data.total}
                pageSize={data.pageSize}
                onPageChange={setPage}
              />
            )}
          </>
        )}
      </div>

      {formState && (
        <EmployeeFormDialog
          mode={formState.mode}
          initialValues={formState.mode === 'edit' ? formState.employee : undefined}
          isSubmitting={isSubmittingForm}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormState(null)}
        />
      )}

      <DeleteEmployeeDialog
        employee={employeeToDelete}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setEmployeeToDelete(null)}
      />
    </div>
  )
}
