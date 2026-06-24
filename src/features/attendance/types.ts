export type AttendanceModule = 'attendance'

export type AttendanceFormMode = 'create' | 'edit'

export interface AttendanceTableSortState {
  sortBy: 'date' | 'employeeName' | 'department' | 'status'
  sortOrder: 'asc' | 'desc'
}
