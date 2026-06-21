import { cn } from '@/lib/utils'

interface EmployeeAvatarProps {
  firstName: string
  lastName: string
  avatarUrl?: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const SIZE_CLASSES = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-10 w-10 text-sm',
  lg: 'h-16 w-16 text-lg',
}

const PALETTE = [
  'bg-blue-100 text-blue-700 dark:bg-blue-500/15 dark:text-blue-400',
  'bg-violet-100 text-violet-700 dark:bg-violet-500/15 dark:text-violet-400',
  'bg-rose-100 text-rose-700 dark:bg-rose-500/15 dark:text-rose-400',
  'bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-400',
  'bg-teal-100 text-teal-700 dark:bg-teal-500/15 dark:text-teal-400',
]

function colorFor(seed: string): string {
  const index = seed.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0) % PALETTE.length
  return PALETTE[index]
}

export function EmployeeAvatar({
  firstName,
  lastName,
  avatarUrl,
  size = 'md',
  className,
}: EmployeeAvatarProps) {
  const initials = `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase()

  if (avatarUrl) {
    return (
      <img
        src={avatarUrl}
        alt={`${firstName} ${lastName}`}
        className={cn('rounded-full object-cover', SIZE_CLASSES[size], className)}
      />
    )
  }

  return (
    <div
      className={cn(
        'flex shrink-0 items-center justify-center rounded-full font-semibold',
        SIZE_CLASSES[size],
        colorFor(`${firstName}${lastName}`),
        className,
      )}
      aria-hidden="true"
    >
      {initials}
    </div>
  )
}
