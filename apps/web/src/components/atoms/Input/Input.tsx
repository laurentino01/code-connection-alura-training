import type { ComponentPropsWithRef } from 'react'
import { cn } from '@/lib/cn'

export type InputProps = ComponentPropsWithRef<'input'> & {
  invalid?: boolean
}

export function Input({ invalid, className, ...rest }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-field border bg-field px-3 py-2 text-sm text-ink placeholder:text-ink-muted focus:outline-none focus:ring-2 focus:ring-brand',
        invalid ? 'border-red-500' : 'border-line',
        className,
      )}
      {...rest}
    />
  )
}
