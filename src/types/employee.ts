export type EmploymentStatus = 'active' | 'inactive' | 'on_leave' | 'terminated'

export interface Employee {
  id: string
  firstName: string
  lastName: string
  email: string
  department: string
  designation: string
  status: EmploymentStatus
  joinDate: string
  managerId?: string
}
