import { useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { attendanceService } from '../services/attendance.service'
import { attendanceKeys } from './useAttendances'
import type { AttendanceRecord, CreateAttendanceInput, UpdateAttendanceInput } from '@/types/attendance'

function getErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message) return error.message
  return fallback
}

export function useCreateAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (input: CreateAttendanceInput) => attendanceService.create(input),
    onSuccess: (record: AttendanceRecord) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: attendanceKeys.summary() })
      toast.success(`Attendance record for ${record.employeeName} was added successfully.`)
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to create attendance record. Please try again.'))
    },
  })
}

export function useUpdateAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: ({ id, input }: { id: string; input: UpdateAttendanceInput }) =>
      attendanceService.update(id, input),
    onSuccess: (record: AttendanceRecord) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() })
      queryClient.invalidateQueries({ queryKey: attendanceKeys.detail(record.id) })
      queryClient.invalidateQueries({ queryKey: attendanceKeys.summary() })
      toast.success(`Attendance record for ${record.employeeName} was updated successfully.`)
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to update attendance record. Please try again.'))
    },
  })
}

export function useDeleteAttendance() {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => attendanceService.remove(id),
    onSuccess: (_data: void, id: string) => {
      queryClient.invalidateQueries({ queryKey: attendanceKeys.lists() })
      queryClient.removeQueries({ queryKey: attendanceKeys.detail(id) })
      queryClient.invalidateQueries({ queryKey: attendanceKeys.summary() })
      toast.success('Attendance record was removed successfully.')
    },
    onError: (error: unknown) => {
      toast.error(getErrorMessage(error, 'Failed to delete attendance record. Please try again.'))
    },
  })
}
