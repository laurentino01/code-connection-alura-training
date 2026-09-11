import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

export type LabelProps = ComponentPropsWithoutRef<'label'>

export function Label({ className, ...rest }: LabelProps) {
  return <label className={cn('text-xs text-ink-soft', className)} {...rest} />
}
