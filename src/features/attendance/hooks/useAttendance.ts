import { useQuery } from '@tanstack/react-query'
import { attendanceService } from '../services/attendance.service'
import { attendanceKeys } from './useAttendances'

export function useAttendance(id: string | undefined) {
  return useQuery({
    queryKey: attendanceKeys.detail(id ?? ''),
    queryFn: () => attendanceService.getById(id as string),
    enabled: Boolean(id),
  })
}
