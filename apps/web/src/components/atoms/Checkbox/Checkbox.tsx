import type { ComponentPropsWithRef } from 'react'
import { cn } from '@/lib/cn'

export type CheckboxProps = Omit<ComponentPropsWithRef<'input'>, 'type'>

export function Checkbox({ className, ...rest }: CheckboxProps) {
  return <input type="checkbox" className={cn('accent-brand', className)} {...rest} />
}
