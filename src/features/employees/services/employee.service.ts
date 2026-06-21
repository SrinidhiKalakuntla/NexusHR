import { apiClient } from '@/lib/axios'
import { USE_MOCK } from '@/lib/constants'
import type {
  CreateEmployeeInput,
  Employee,
  EmployeeFilters,
  UpdateEmployeeInput,
} from '@/types/employee'
import type { PaginatedResponse } from '@/types/common'
import {
  mockCreate,
  mockDelete,
  mockGetAll,
  mockGetById,
  mockHasDirectReports,
  mockUpdate,
} from './employee.mock-data'

const EMPLOYEES_ENDPOINT = '/employees'

function applyFilters(employees: Employee[], filters: EmployeeFilters): Employee[] {
  let result = employees

  if (filters.search) {
    const query = filters.search.trim().toLowerCase()
    result = result.filter((employee) => {
      const haystack = [
        employee.firstName,
        employee.lastName,
        employee.email,
        employee.employeeCode,
        employee.designation,
      ]
        .join(' ')
        .toLowerCase()
      return haystack.includes(query)
    })
  }

  if (filters.department && filters.department !== 'all') {
    result = result.filter((employee) => employee.department === filters.department)
  }

  if (filters.status && filters.status !== 'all') {
    result = result.filter((employee) => employee.status === filters.status)
  }

  if (filters.employmentType && filters.employmentType !== 'all') {
    result = result.filter((employee) => employee.employmentType === filters.employmentType)
  }

  const sortBy = filters.sortBy ?? 'name'
  const sortOrder = filters.sortOrder ?? 'asc'
  const direction = sortOrder === 'asc' ? 1 : -1

  result = [...result].sort((a, b) => {
    if (sortBy === 'joinDate') {
      return (a.joinDate < b.joinDate ? -1 : a.joinDate > b.joinDate ? 1 : 0) * direction
    }
    if (sortBy === 'department') {
      return a.department.localeCompare(b.department) * direction
    }
    const nameA = `${a.firstName} ${a.lastName}`
    const nameB = `${b.firstName} ${b.lastName}`
    return nameA.localeCompare(nameB) * direction
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

export const employeeService = {
  async list(filters: EmployeeFilters = {}): Promise<PaginatedResponse<Employee>> {
    const page = filters.page ?? 1
    const pageSize = filters.pageSize ?? 10

    if (USE_MOCK) {
      const all = await mockGetAll()
      const filtered = applyFilters(all, filters)
      return paginate(filtered, page, pageSize)
    }

    const { data } = await apiClient.get<PaginatedResponse<Employee>>(EMPLOYEES_ENDPOINT, {
      params: filters,
    })
    return data
  },

  async getById(id: string): Promise<Employee> {
    if (USE_MOCK) {
      const employee = await mockGetById(id)
      if (!employee) {
        throw new Error(`Employee with id "${id}" was not found.`)
      }
      return employee
    }

    const { data } = await apiClient.get<Employee>(`${EMPLOYEES_ENDPOINT}/${id}`)
    return data
  },

  async create(input: CreateEmployeeInput): Promise<Employee> {
    if (USE_MOCK) {
      return mockCreate(input)
    }

    const { data } = await apiClient.post<Employee>(EMPLOYEES_ENDPOINT, input)
    return data
  },

  async update(id: string, input: UpdateEmployeeInput): Promise<Employee> {
    if (USE_MOCK) {
      return mockUpdate(id, input)
    }

    const { data } = await apiClient.patch<Employee>(`${EMPLOYEES_ENDPOINT}/${id}`, input)
    return data
  },

  async remove(id: string): Promise<void> {
    if (USE_MOCK) {
      await mockDelete(id)
      return
    }

    await apiClient.delete(`${EMPLOYEES_ENDPOINT}/${id}`)
  },

  async hasDirectReports(id: string): Promise<boolean> {
    if (USE_MOCK) {
      return mockHasDirectReports(id)
    }

    const { data } = await apiClient.get<{ hasDirectReports: boolean }>(
      `${EMPLOYEES_ENDPOINT}/${id}/direct-reports/exists`,
    )
    return data.hasDirectReports
  },
}
