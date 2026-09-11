import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

export type TextTone = 'default' | 'soft' | 'muted' | 'brand'
export type TextSize = 'xs' | 'sm' | 'base'

export type TextProps = ComponentPropsWithoutRef<'p'> &
  ComponentPropsWithoutRef<'span'> & {
    as?: 'p' | 'span'
    tone?: TextTone
    size?: TextSize
  }

const toneClasses: Record<TextTone, string> = {
  default: 'text-ink',
  soft: 'text-ink-soft',
  muted: 'text-ink-muted',
  brand: 'text-brand',
}

const sizeClasses: Record<TextSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  base: 'text-base',
}

export function Text({
  as = 'p',
  tone = 'default',
  size = 'sm',
  children,
  className,
  ...rest
}: TextProps) {
  const Component = as
  return (
    <Component className={cn(toneClasses[tone], sizeClasses[size], className)} {...rest}>
      {children}
    </Component>
  )
}
