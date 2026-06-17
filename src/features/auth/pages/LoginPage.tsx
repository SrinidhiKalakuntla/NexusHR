import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useAuthStore } from '@/stores/auth-store'
import { ROUTES } from '@/routes/route-config'
import { APP_NAME } from '@/lib/constants'
import type { Role } from '@/lib/constants'

const demoUsers: Array<{
  email: string
  password: string
  name: string
  role: Role
}> = [
  {
    email: 'admin@nexushr.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'admin',
  },
  {
    email: 'hr@nexushr.com',
    password: 'hr123',
    name: 'HR Manager',
    role: 'hr_manager',
  },
  {
    email: 'manager@nexushr.com',
    password: 'manager123',
    name: 'Team Manager',
    role: 'manager',
  },
  {
    email: 'employee@nexushr.com',
    password: 'employee123',
    name: 'Employee User',
    role: 'employee',
  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const setAuth = useAuthStore((state) => state.setAuth)
  const [email, setEmail] = useState('admin@nexushr.com')
  const [password, setPassword] = useState('admin123')

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    const user = demoUsers.find(
      (demoUser) =>
        demoUser.email === email && demoUser.password === password,
    )

    if (!user) {
      toast.error('Invalid credentials. Use one of the demo accounts.')
      return
    }

    setAuth(
      {
        id: user.email,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      'mock-jwt-token',
    )

    toast.success(`Welcome back, ${user.name}!`)
    navigate(ROUTES.DASHBOARD)
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted p-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-card p-8 shadow-sm">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary text-lg font-bold text-primary-foreground">
            N
          </div>
          <h1 className="text-2xl font-bold text-card-foreground">
            Sign in to {APP_NAME}
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Use a demo account to explore the application.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="email"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-primary focus:ring-2"
              required
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="mb-1.5 block text-sm font-medium text-foreground"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              className="w-full rounded-lg border border-border bg-background px-3 py-2 text-sm text-foreground outline-none ring-primary focus:ring-2"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            Sign In
          </button>
        </form>

        <div className="mt-6 rounded-lg bg-muted p-4 text-xs text-muted-foreground">
          <p className="font-medium text-foreground">Demo accounts</p>
          <ul className="mt-2 space-y-1">
            {demoUsers.map((user) => (
              <li key={user.email}>
                {user.email} / {user.password}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}
