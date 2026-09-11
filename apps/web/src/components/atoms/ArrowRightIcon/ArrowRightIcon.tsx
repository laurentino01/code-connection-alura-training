import { cn } from '@/lib/cn'

export type ArrowRightIconProps = {
  className?: string
}

/** Material Icons "arrow_forward" glyph, used on the primary auth buttons. */
export function ArrowRightIcon({ className }: ArrowRightIconProps) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-hidden="true"
      focusable="false"
      className={cn('h-6 w-6', className)}
    >
      <path d="M4 11v2h12l-5.5 5.5 1.42 1.42L19.84 12l-7.92-7.92L10.5 5.5 16 11H4z" />
    </svg>
  )
}
