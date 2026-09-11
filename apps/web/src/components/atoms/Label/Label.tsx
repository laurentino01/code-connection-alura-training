import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

export type LabelSize = 'small' | 'body'
export type LabelTone = 'default' | 'muted'
export type LabelProps = ComponentPropsWithoutRef<'label'> & {
  size?: LabelSize
  tone?: LabelTone
}

const sizeClasses: Record<LabelSize, string> = {
  small: 'text-small',
  body: 'text-body',
}

const toneClasses: Record<LabelTone, string> = {
  default: 'text-ink',
  muted: 'text-ink-muted',
}

export function Label({ size = 'body', tone = 'default', className, ...rest }: LabelProps) {
  return <label className={cn(sizeClasses[size], toneClasses[tone], className)} {...rest} />
}
