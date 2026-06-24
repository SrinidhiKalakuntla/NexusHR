import { apiClient } from '@/lib/axios'
import { USE_MOCK } from '@/lib/constants'
import type {
  AttendanceFilters,
  AttendanceRecord,
  AttendanceSummary,
  CreateAttendanceInput,
  UpdateAttendanceInput,
} from '@/types/attendance'
import type { PaginatedResponse } from '@/types/common'
import {
  mockCreate,
  mockDelete,
  mockGetAll,
  mockGetById,
  mockGetSummary,
  mockUpdate,
} from './attendance.mock-data'

const ENDPOINT = '/attendance'

function applyFilters(
  records: AttendanceRecord[],
  filters: AttendanceFilters,
): AttendanceRecord[] {
  let result = records

  if (filters.search) {
    const query = filters.search.trim().toLowerCase()
    result = result.filter((r) => {
      const haystack = [r.employeeName, r.employeeCode, r.department]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }

  if (filters.department && filters.department !== 'all') {
    result = result.filter((r) => r.department === filters.department)
  }

  if (filters.status && filters.status !== 'all') {
    result = result.filter((r) => r.status === filters.status)
  }

  if (filters.dateFrom) {
    result = result.filter((r) => r.date >= filters.dateFrom!)
  }

  if (filters.dateTo) {
    result = result.filter((r) => r.date <= filters.dateTo!)
  }

  const sortBy = filters.sortBy ?? 'date'
  const direction = (filters.sortOrder ?? 'desc') === 'asc' ? 1 : -1

  result = [...result].sort((a, b) => {
    switch (sortBy) {
      case 'employeeName':
        return a.employeeName.localeCompare(b.employeeName) * direction
      case 'department':
        return a.department.localeCompare(b.department) * direction
      case 'status':
        return a.status.localeCompare(b.status) * direction
      default:
        return (a.date < b.date ? -1 : a.date > b.date ? 1 : 0) * direction
    }
  })

  return result
}

function paginate<T>(items: T[], page: number, pageSize: number): PaginatedResponse<T> {
  const total = items.length
  const totalPages = Math.max(1, Math.ceil(total / pageSize))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const start = (safePage - 1) * pageSize
  const data = items.slice(start, start + pageSize)
  return { data, total, page: safePage, pageSize, totalPages }
}

export const attendanceService = {
  async list(filters: AttendanceFilters = {}): Promise<PaginatedResponse<AttendanceRecord>> {
    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? 10

    if (USE_MOCK) {
      const all = await mockGetAll()
      const filtered = applyFilters(all, filters)
      return paginate(filtered, page, pageSize)
    }

    const { data } = await apiClient.get<PaginatedResponse<AttendanceRecord>>(ENDPOINT, {
      params: filters,
    })
    return data
  },

  async getById(id: string): Promise<AttendanceRecord> {
    if (USE_MOCK) {
      const record = await mockGetById(id)
      if (!record) throw new Error(`Attendance record "${id}" was not found.`)
      return record
    }

    const { data } = await apiClient.get<AttendanceRecord>(`${ENDPOINT}/${id}`)
    return data
  },

  async create(input: CreateAttendanceInput): Promise<AttendanceRecord> {
    if (USE_MOCK) return mockCreate(input)

    const { data } = await apiClient.post<AttendanceRecord>(ENDPOINT, input)
    return data
  },

  async update(id: string, input: UpdateAttendanceInput): Promise<AttendanceRecord> {
    if (USE_MOCK) return mockUpdate(id, input)

    const { data } = await apiClient.patch<AttendanceRecord>(`${ENDPOINT}/${id}`, input)
    return data
  },

  async remove(id: string): Promise<void> {
    if (USE_MOCK) {
      await mockDelete(id)
      return
    }

    await apiClient.delete(`${ENDPOINT}/${id}`)
  },

  async getSummary(): Promise<AttendanceSummary> {
    if (USE_MOCK) return mockGetSummary()

    const { data } = await apiClient.get<AttendanceSummary>(`${ENDPOINT}/summary`)
    return data
  },
}
