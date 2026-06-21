export type EmploymentStatus = 'active' | 'inactive' | 'on_leave' | 'terminated'

export type EmploymentType = 'full_time' | 'part_time' | 'contract' | 'intern'

export type Gender = 'male' | 'female' | 'other' | 'prefer_not_to_say'

/**
 * Core employee record.
 *
 * NOTE: id, firstName, lastName, email, department, designation, status,
 * joinDate, and managerId already existed in the Phase 0 stub and are kept
 * unchanged so any existing references continue to compile. Everything else
 * is additive.
 */
export interface Employee {
  id: string
  employeeCode: string
  firstName: string
  lastName: string
  email: string
  phone?: string
  department: string
  designation: string
  status: EmploymentStatus
  employmentType: EmploymentType
  joinDate: string
  managerId?: string
  gender?: Gender
  dateOfBirth?: string
  address?: string
  city?: string
  country?: string
  avatarUrl?: string
  salary?: number
  createdAt: string
  updatedAt: string
}

/** Lightweight shape used for manager pickers / avatars / nested references. */
export interface EmployeeSummary {
  id: string
  firstName: string
  lastName: string
  designation: string
  avatarUrl?: string
}

/** Payload for creating a new employee. Server-generated fields are omitted. */
export type CreateEmployeeInput = Omit<
  Employee,
  'id' | 'employeeCode' | 'createdAt' | 'updatedAt'
>

/** Payload for updating an employee. All fields optional except id. */
export type UpdateEmployeeInput = Partial<CreateEmployeeInput>

export interface EmployeeFilters {
  search?: string
  department?: string
  status?: EmploymentStatus | 'all'
  employmentType?: EmploymentType | 'all'
  page?: number
  pageSize?: number
  sortBy?: 'name' | 'joinDate' | 'department'
  sortOrder?: 'asc' | 'desc'
}

export const DEPARTMENTS = [
  'Engineering',
  'Product',
  'Design',
  'Sales',
  'Marketing',
  'Human Resources',
  'Finance',
  'Operations',
  'Customer Support',
  'Legal',
] as const

export type Department = (typeof DEPARTMENTS)[number]
