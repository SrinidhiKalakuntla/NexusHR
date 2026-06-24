export type AttendanceStatus =
  | 'present'
  | 'absent'
  | 'late'
  | 'half_day'
  | 'work_from_home'

export interface AttendanceRecord {
  id: string
  employeeId: string
  employeeCode: string
  employeeName: string
  department: string
  date: string
  checkIn: string | null
  checkOut: string | null
  totalHours: number | null
  status: AttendanceStatus
  notes: string
  createdAt: string
  updatedAt: string
}

/** Payload for creating a new record — server-generated fields omitted. */
export type CreateAttendanceInput = Omit<
  AttendanceRecord,
  'id' | 'createdAt' | 'updatedAt' | 'totalHours'
>

/** All fields optional for updates. */
export type UpdateAttendanceInput = Partial<CreateAttendanceInput>

export interface AttendanceFilters {
  search?: string
  department?: string
  status?: AttendanceStatus | 'all'
  dateFrom?: string
  dateTo?: string
  page?: number
  pageSize?: number
  sortBy?: 'date' | 'employeeName' | 'department' | 'status'
  sortOrder?: 'asc' | 'desc'
}

export interface AttendanceSummary {
  totalEmployees: number
  presentToday: number
  absentToday: number
  lateArrivals: number
  workFromHome: number
}
