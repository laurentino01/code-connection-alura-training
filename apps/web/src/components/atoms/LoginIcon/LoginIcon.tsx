import { cn } from '@/lib/cn'

export type LoginIconProps = {
  className?: string
}

/** Material Icons "login" glyph, used next to the link back to the login screen. */
export function LoginIcon({ className }: LoginIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn('h-6 w-6', className)}
    >
      <path d="M11 7 9.6 8.4l2.6 2.6H2v2h10.2l-2.6 2.6L11 17l5-5z" />
      <path d="M20 3h-9v2h9v14h-9v2h9c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2z" />
    </svg>
  )
}
