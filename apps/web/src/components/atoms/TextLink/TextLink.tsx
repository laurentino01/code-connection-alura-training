import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/cn'

export type TextLinkTone = 'muted' | 'brand'
export type TextLinkSize = 'xs' | 'sm'

export type TextLinkProps = {
  to: string
  external?: boolean
  tone?: TextLinkTone
  size?: TextLinkSize
  iconRight?: ReactNode
  children: ReactNode
  className?: string
}

const toneClasses: Record<TextLinkTone, string> = {
  muted: 'text-ink-muted hover:text-ink-soft',
  brand: 'text-brand hover:text-brand-hover',
}

const sizeClasses: Record<TextLinkSize, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
}

export function TextLink({
  to,
  external = false,
  tone = 'muted',
  size = 'sm',
  iconRight,
  children,
  className,
}: TextLinkProps) {
  const classes = cn(
    'inline-flex items-center gap-1 font-medium',
    toneClasses[tone],
    sizeClasses[size],
    className,
  )

  if (external) {
    return (
      <a href={to} target="_blank" rel="noreferrer" className={classes}>
        {children}
        {iconRight}
      </a>
    )
  }

  return (
    <Link to={to} className={classes}>
      {children}
      {iconRight}
    </Link>
  )
}
