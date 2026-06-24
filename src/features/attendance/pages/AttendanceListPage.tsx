import { Plus } from 'lucide-react'
import { useMemo, useState } from 'react'
import { AttendanceFilters } from '../components/AttendanceFilters'
import { AttendanceFormDialog } from '../components/AttendanceFormDialog'
import { AttendancePagination } from '../components/AttendancePagination'
import { AttendanceSummaryCards } from '../components/AttendanceSummaryCards'
import { AttendanceTable } from '../components/AttendanceTable'
import { DeleteAttendanceDialog } from '../components/DeleteAttendanceDialog'
import { useAttendances } from '../hooks/useAttendances'
import {
  useCreateAttendance,
  useDeleteAttendance,
  useUpdateAttendance,
} from '../hooks/useAttendanceMutations'
import { EmptyState } from '@/components/common/EmptyState'
import { LoadingSkeleton } from '@/components/common/LoadingSkeleton'
import { PageHeader } from '@/components/common/PageHeader'
import { RoleGuard } from '@/components/common/RoleGuard'
import { useDebounce } from '@/hooks/useDebounce'
import type { AttendanceRecord, AttendanceStatus, CreateAttendanceInput } from '@/types/attendance'

const PAGE_SIZE = 10

export function AttendanceListPage() {
  const [search, setSearch] = useState('')
  const [department, setDepartment] = useState('all')
  const [status, setStatus] = useState<AttendanceStatus | 'all'>('all')
  const [dateFrom, setDateFrom] = useState('')
  const [dateTo, setDateTo] = useState('')
  const [page, setPage] = useState(1)
  const [sortBy, setSortBy] = useState<'date' | 'employeeName' | 'department' | 'status'>('date')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const [formState, setFormState] = useState<
    { mode: 'create' } | { mode: 'edit'; record: AttendanceRecord } | null
  >(null)
  const [recordToDelete, setRecordToDelete] = useState<AttendanceRecord | null>(null)

  const debouncedSearch = useDebounce(search, 300)

  const { data, isLoading, isError } = useAttendances({
    search: debouncedSearch,
    department,
    status,
    dateFrom: dateFrom || undefined,
    dateTo: dateTo || undefined,
    page,
    pageSize: PAGE_SIZE,
    sortBy,
    sortOrder,
  })

  const createMutation = useCreateAttendance()
  const updateMutation = useUpdateAttendance()
  const deleteMutation = useDeleteAttendance()

  const records = useMemo(() => data?.data ?? [], [data])

  const handleSortChange = (key: 'date' | 'employeeName' | 'department' | 'status') => {
    if (sortBy === key) {
      setSortOrder((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortBy(key)
      setSortOrder('asc')
    }
  }

  const resetPage = () => setPage(1)

  const handleFormSubmit = (input: CreateAttendanceInput) => {
    if (formState?.mode === 'edit') {
      updateMutation.mutate(
        { id: formState.record.id, input },
        { onSuccess: () => setFormState(null) },
      )
      return
    }
    createMutation.mutate(input, { onSuccess: () => setFormState(null) })
  }

  const handleConfirmDelete = () => {
    if (!recordToDelete) return
    deleteMutation.mutate(recordToDelete.id, {
      onSuccess: () => setRecordToDelete(null),
    })
  }

  const isSubmitting = createMutation.isPending || updateMutation.isPending

  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance Management"
        description="Track and manage employee attendance records across your organization."
      >
        <RoleGuard roles={['admin', 'hr_manager']}>
          <button
            type="button"
            onClick={() => setFormState({ mode: 'create' })}
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Plus className="h-4 w-4" />
            Add record
          </button>
        </RoleGuard>
      </PageHeader>

      <AttendanceSummaryCards />

      <div className="rounded-xl border border-border bg-card">
        <div className="border-b border-border p-4">
          <AttendanceFilters
            search={search}
            onSearchChange={(v) => { setSearch(v); resetPage() }}
            department={department}
            onDepartmentChange={(v) => { setDepartment(v); resetPage() }}
            status={status}
            onStatusChange={(v) => { setStatus(v); resetPage() }}
            dateFrom={dateFrom}
            onDateFromChange={(v) => { setDateFrom(v); resetPage() }}
            dateTo={dateTo}
            onDateToChange={(v) => { setDateTo(v); resetPage() }}
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
              title="Couldn't load attendance records"
              description="Something went wrong while fetching attendance data. Please try again."
            />
          </div>
        )}

        {!isLoading && !isError && records.length === 0 && (
          <div className="p-6">
            <EmptyState
              title="No records found"
              description="Try adjusting your filters, or add a new attendance record."
            />
          </div>
        )}

        {!isLoading && !isError && records.length > 0 && (
          <>
            <AttendanceTable
              records={records}
              sortBy={sortBy}
              sortOrder={sortOrder}
              onSortChange={handleSortChange}
              onEdit={(record) => setFormState({ mode: 'edit', record })}
              onDelete={(record) => setRecordToDelete(record)}
            />
            {data && (
              <AttendancePagination
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
        <AttendanceFormDialog
          mode={formState.mode}
          initialValues={formState.mode === 'edit' ? formState.record : undefined}
          isSubmitting={isSubmitting}
          onSubmit={handleFormSubmit}
          onCancel={() => setFormState(null)}
        />
      )}

      <DeleteAttendanceDialog
        record={recordToDelete}
        isDeleting={deleteMutation.isPending}
        onConfirm={handleConfirmDelete}
        onCancel={() => setRecordToDelete(null)}
      />
    </div>
  )
}
