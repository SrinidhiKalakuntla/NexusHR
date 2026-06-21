import seedData from '@/mocks/data/employees.json'
import type { Employee } from '@/types/employee'

/**
 * Phase 0 of this project has MSW scaffolded (src/mocks/handlers, src/mocks/browser.ts)
 * but not wired up or installed as a dependency yet. Rather than block the Employee
 * Management module on that infrastructure work, this module provides an in-memory
 * mock store that the employee service uses whenever USE_MOCK is true.
 *
 * When the team enables MSW (or a real backend) in a later phase, only
 * `employee.service.ts` needs to change — this file and the consuming hooks/components
 * are unaffected.
 */

let store: Employee[] = (seedData as unknown as Employee[]).map((employee) => ({
  ...employee,
}))

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function simulateLatency(): Promise<void> {
  const delay = 250 + Math.random() * 300
  return new Promise((resolve) => setTimeout(resolve, delay))
}

function nextEmployeeId(): string {
  const numericIds = store
    .map((employee) => Number.parseInt(employee.id.replace(/\D/g, ''), 10))
    .filter((value) => !Number.isNaN(value))
  const max = numericIds.length > 0 ? Math.max(...numericIds) : 1000
  return `EMP${max + 1}`
}

export async function mockGetAll(): Promise<Employee[]> {
  await simulateLatency()
  return clone(store)
}

export async function mockGetById(id: string): Promise<Employee | null> {
  await simulateLatency()
  const found = store.find((employee) => employee.id === id)
  return found ? clone(found) : null
}

export async function mockCreate(
  input: Omit<Employee, 'id' | 'employeeCode' | 'createdAt' | 'updatedAt'>,
): Promise<Employee> {
  await simulateLatency()

  const duplicateEmail = store.some(
    (employee) => employee.email.toLowerCase() === input.email.toLowerCase(),
  )
  if (duplicateEmail) {
    throw new Error('An employee with this email already exists.')
  }

  const id = nextEmployeeId()
  const now = new Date().toISOString()
  const created: Employee = {
    ...input,
    id,
    employeeCode: id,
    createdAt: now,
    updatedAt: now,
  }

  store = [created, ...store]
  return clone(created)
}

export async function mockUpdate(
  id: string,
  input: Partial<Omit<Employee, 'id' | 'employeeCode' | 'createdAt' | 'updatedAt'>>,
): Promise<Employee> {
  await simulateLatency()

  const index = store.findIndex((employee) => employee.id === id)
  if (index === -1) {
    throw new Error(`Employee with id "${id}" was not found.`)
  }

  if (input.email) {
    const normalizedEmail = input.email.toLowerCase()
    const duplicateEmail = store.some(
      (employee) => employee.id !== id && employee.email.toLowerCase() === normalizedEmail,
    )
    if (duplicateEmail) {
      throw new Error('An employee with this email already exists.')
    }
  }

  const updated: Employee = {
    ...store[index],
    ...input,
    updatedAt: new Date().toISOString(),
  }

  store = [...store.slice(0, index), updated, ...store.slice(index + 1)]
  return clone(updated)
}

export async function mockDelete(id: string): Promise<void> {
  await simulateLatency()

  const exists = store.some((employee) => employee.id === id)
  if (!exists) {
    throw new Error(`Employee with id "${id}" was not found.`)
  }

  store = store.filter((employee) => employee.id !== id)
}

/** Returns true if any other employee references this id as their manager. */
export async function mockHasDirectReports(id: string): Promise<boolean> {
  await simulateLatency()
  return store.some((employee) => employee.managerId === id)
}
