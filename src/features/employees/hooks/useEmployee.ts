import { useQuery } from '@tanstack/react-query'
import { employeeService } from '../services/employee.service'
import { employeeKeys } from './useEmployees'

export function useEmployee(id: string | undefined) {
  return useQuery({
    queryKey: employeeKeys.detail(id ?? ''),
    queryFn: () => employeeService.getById(id as string),
    enabled: Boolean(id),
  })
}
