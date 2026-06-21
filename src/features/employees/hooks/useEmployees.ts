import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { employeeService } from '../services/employee.service'
import type { EmployeeFilters } from '@/types/employee'

export const employeeKeys = {
  all: ['employees'] as const,
  lists: () => [...employeeKeys.all, 'list'] as const,
  list: (filters: EmployeeFilters) => [...employeeKeys.lists(), filters] as const,
  details: () => [...employeeKeys.all, 'detail'] as const,
  detail: (id: string) => [...employeeKeys.details(), id] as const,
}

export function useEmployees(filters: EmployeeFilters = {}) {
  return useQuery({
    queryKey: employeeKeys.list(filters),
    queryFn: () => employeeService.list(filters),
    placeholderData: keepPreviousData,
  })
}
