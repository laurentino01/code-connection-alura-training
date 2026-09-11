import type { ReactNode } from 'react'
import { Link } from 'react-router'
import { cn } from '@/lib/cn'

export type TextLinkTone = 'muted' | 'brand'
export type TextLinkSize = 'small' | 'body'

export type TextLinkProps = {
  to: string
  external?: boolean
  tone?: TextLinkTone
  size?: TextLinkSize
  underline?: boolean
  iconRight?: ReactNode
  children: ReactNode
  className?: string
}

const toneClasses: Record<TextLinkTone, string> = {
  muted: 'text-ink',
  brand: 'text-brand hover:text-brand-hover',
}
const sizeClasses: Record<TextLinkSize, string> = { small: 'text-small', body: 'text-body' }

export function TextLink({
  to,
  external = false,
  tone = 'muted',
  size = 'small',
  underline = false,
  iconRight,
  children,
  className,
}: TextLinkProps) {
  const classes = cn(
    'inline-flex items-center gap-3 font-medium',
    toneClasses[tone],
    sizeClasses[size],
    underline && 'underline',
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
