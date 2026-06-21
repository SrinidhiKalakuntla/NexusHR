export type EmployeeModule = 'employees'

export type EmployeeFormMode = 'create' | 'edit'

export interface EmployeeTableSortState {
  sortBy: 'name' | 'joinDate' | 'department'
  sortOrder: 'asc' | 'desc'
}
