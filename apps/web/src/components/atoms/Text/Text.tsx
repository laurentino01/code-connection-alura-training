import type { ComponentPropsWithoutRef } from 'react'
import { cn } from '@/lib/cn'

export type TextTone = 'default' | 'muted' | 'brand'
export type TextSize = 'label' | 'small' | 'body' | 'subtitle'

export type TextProps = ComponentPropsWithoutRef<'p'> &
  ComponentPropsWithoutRef<'span'> & {
    as?: 'p' | 'span'
    tone?: TextTone
    size?: TextSize
  }

const toneClasses: Record<TextTone, string> = {
  default: 'text-ink',
  muted: 'text-ink-muted',
  brand: 'text-brand',
}

const sizeClasses: Record<TextSize, string> = {
  label: 'text-label',
  small: 'text-small',
  body: 'text-body',
  subtitle: 'text-subtitle',
}

export function Text({
  as = 'p',
  tone = 'default',
  size = 'small',
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
