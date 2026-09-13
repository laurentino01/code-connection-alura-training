import type { ComponentPropsWithRef } from 'react'
import { cn } from '@/lib/cn'

export type InputProps = ComponentPropsWithRef<'input'> & { invalid?: boolean }

export function Input({ invalid, className, ...rest }: InputProps) {
  return (
    <input
      aria-invalid={invalid || undefined}
      className={cn(
        'w-full rounded-field bg-field px-4 py-2 text-small text-field-ink placeholder:text-field-ink/70 focus:outline-none focus:ring-2 focus:ring-brand',
        invalid && 'ring-2 ring-red-500',
        className,
      )}
      {...rest}
    />
  )
}
