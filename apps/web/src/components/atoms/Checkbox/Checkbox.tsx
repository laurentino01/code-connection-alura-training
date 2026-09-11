import type { ComponentPropsWithRef } from 'react'
import { cn } from '@/lib/cn'

export type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'type'>

export function Checkbox({ className, ...rest }: CheckboxProps) {
  return (
    <input
      type="checkbox"
      className={cn(
        'size-6 shrink-0 appearance-none rounded-field border-2 border-line bg-transparent bg-center bg-no-repeat',
        'checked:[background-image:url(/check.svg)]',
        className,
      )}
      {...rest}
    />
  )
}
