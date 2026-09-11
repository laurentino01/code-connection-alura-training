import { cn } from '@/lib/cn'

export type ArrowRightIconProps = {
  className?: string
}

export function ArrowRightIcon({ className }: ArrowRightIconProps) {
  return (
    <svg
      viewBox="0 0 16 16"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn('h-4 w-4', className)}
    >
      <path
        d="M3.333 8h9.334M8.667 3.667 13 8l-4.333 4.333"
        stroke="currentColor"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}
