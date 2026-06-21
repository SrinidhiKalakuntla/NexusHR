import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { employeeService } from '../services/employee.service'
import { employeeKeys } from './useEmployees'
import type { CreateEmployeeInput, Employee, UpdateEmployeeInput } from '@/types/employee'

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) {
    return error.message
  }
  return fallback
}

export function useCreateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateEmployeeInput) => employeeService.create(input),
    onSuccess: (employee: Employee) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      toast.success(`${employee.firstName} ${employee.lastName} was added successfully.`)
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to create employee. Please try again.'))
    },
  })
}

export function useUpdateEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateEmployeeInput }) =>
      employeeService.update(id, input),
    onSuccess: (employee: Employee) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      queryClient.invalidateQueries({ queryKey: employeeKeys.detail(employee.id) })
      toast.success(`${employee.firstName} ${employee.lastName} was updated successfully.`)
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to update employee. Please try again.'))
    },
  })
}

export function useDeleteEmployee() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => employeeService.remove(id),
    onSuccess: (_data: void, id: string) => {
      queryClient.invalidateQueries({ queryKey: employeeKeys.lists() })
      queryClient.removeQueries({ queryKey: employeeKeys.detail(id) })
      toast.success('Employee was removed successfully.')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to delete employee. Please try again.'))
    },
  })
}
