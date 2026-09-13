import { cn } from '@/lib/cn'

export type AssignmentIconProps = {
  className?: string
}

/** Material Icons "assignment" glyph, used next to the link to the signup screen. */
export function AssignmentIcon({ className }: AssignmentIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn('h-6 w-6', className)}
    >
      <path d="M19 3h-4.18C14.4 1.84 13.3 1 12 1S9.6 1.84 9.18 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zM12 3c.55 0 1 .45 1 1s-.45 1-1 1-1-.45-1-1 .45-1 1-1zM14 19H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V9h10v2z" />
    </svg>
  )
}
