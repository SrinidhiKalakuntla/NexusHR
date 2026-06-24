import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { attendanceService } from '../services/attendance.service'
import type { AttendanceFilters } from '@/types/attendance'

export const attendanceKeys = {
  all: ['attendance'] as const,
  lists: () => [...attendanceKeys.all, 'list'] as const,
  list: (filters: AttendanceFilters) => [...attendanceKeys.lists(), filters] as const,
  details: () => [...attendanceKeys.all, 'detail'] as const,
  detail: (id: string) => [...attendanceKeys.details(), id] as const,
  summary: () => [...attendanceKeys.all, 'summary'] as const,
}

export function useAttendances(filters: AttendanceFilters = {}) {
  return useQuery({
    queryKey: attendanceKeys.list(filters),
    queryFn: () => attendanceService.list(filters),
    placeholderData: keepPreviousData,
  })
}

export function useAttendanceSummary() {
  return useQuery({
    queryKey: attendanceKeys.summary(),
    queryFn: () => attendanceService.getSummary(),
  })
}
