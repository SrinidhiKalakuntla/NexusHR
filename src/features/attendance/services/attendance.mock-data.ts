import seedData from '@/mocks/data/attendance.json'
import type { AttendanceRecord, AttendanceSummary, CreateAttendanceInput } from '@/types/attendance'

let store: AttendanceRecord[] = (seedData as unknown as AttendanceRecord[]).map((r) => ({ ...r }))

function clone<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T
}

function simulateLatency(): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 200 + Math.random() * 250))
}

function nextId(): string {
  const nums = store
    .map((r) => Number.parseInt(r.id.replace(/\D/g, ''), 10))
    .filter((n) => !Number.isNaN(n))
  const max = nums.length > 0 ? Math.max(...nums) : 1000
  return `ATT${max + 1}`
}

function computeHours(checkIn: string | null, checkOut: string | null): number | null {
  if (!checkIn || !checkOut) return null
  const [inH, inM] = checkIn.split(':').map(Number)
  const [outH, outM] = checkOut.split(':').map(Number)
  const total = (outH * 60 + outM - (inH * 60 + inM)) / 60
  return total > 0 ? Math.round(total * 10) / 10 : null
}

export async function mockGetAll(): Promise<AttendanceRecord[]> {
  await simulateLatency()
  return clone(store)
}

export async function mockGetById(id: string): Promise<AttendanceRecord | null> {
  await simulateLatency()
  const found = store.find((r) => r.id === id)
  return found ? clone(found) : null
}

export async function mockCreate(input: CreateAttendanceInput): Promise<AttendanceRecord> {
  await simulateLatency()

  const duplicate = store.some(
    (r) => r.employeeId === input.employeeId && r.date === input.date,
  )
  if (duplicate) {
    throw new Error(
      `An attendance record for ${input.employeeName} on ${input.date} already exists.`,
    )
  }

  if (input.checkIn && input.checkOut) {
    const [inH, inM] = input.checkIn.split(':').map(Number)
    const [outH, outM] = input.checkOut.split(':').map(Number)
    if (outH * 60 + outM <= inH * 60 + inM) {
      throw new Error('Check-out time must be later than check-in time.')
    }
  }

  const id = nextId()
  const now = new Date().toISOString()
  const created: AttendanceRecord = {
    ...input,
    id,
    totalHours: computeHours(input.checkIn, input.checkOut),
    createdAt: now,
    updatedAt: now,
  }

  store = [created, ...store]
  return clone(created)
}

export async function mockUpdate(
  id: string,
  input: Partial<CreateAttendanceInput>,
): Promise<AttendanceRecord> {
  await simulateLatency()

  const index = store.findIndex((r) => r.id === id)
  if (index === -1) {
    throw new Error(`Attendance record "${id}" was not found.`)
  }

  const merged = { ...store[index], ...input }

  if (merged.checkIn && merged.checkOut) {
    const [inH, inM] = merged.checkIn.split(':').map(Number)
    const [outH, outM] = merged.checkOut.split(':').map(Number)
    if (outH * 60 + outM <= inH * 60 + inM) {
      throw new Error('Check-out time must be later than check-in time.')
    }
  }

  const updated: AttendanceRecord = {
    ...merged,
    totalHours: computeHours(merged.checkIn, merged.checkOut),
    updatedAt: new Date().toISOString(),
  }

  store = [...store.slice(0, index), updated, ...store.slice(index + 1)]
  return clone(updated)
}

export async function mockDelete(id: string): Promise<void> {
  await simulateLatency()

  if (!store.some((r) => r.id === id)) {
    throw new Error(`Attendance record "${id}" was not found.`)
  }
  store = store.filter((r) => r.id !== id)
}

export async function mockGetSummary(): Promise<AttendanceSummary> {
  await simulateLatency()
  const today = new Date().toISOString().slice(0, 10)
  const todayRecords = store.filter((r) => r.date === today)
  const employeeIds = new Set(store.map((r) => r.employeeId))

  return {
    totalEmployees: employeeIds.size,
    presentToday: todayRecords.filter((r) => r.status === 'present').length,
    absentToday: todayRecords.filter((r) => r.status === 'absent').length,
    lateArrivals: todayRecords.filter((r) => r.status === 'late').length,
    workFromHome: todayRecords.filter((r) => r.status === 'work_from_home').length,
  }
}
