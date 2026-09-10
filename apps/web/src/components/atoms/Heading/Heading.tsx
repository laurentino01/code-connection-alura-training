import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type HeadingSize = 'lg' | 'md' | 'sm'

export type HeadingProps = {
  level?: 1 | 2 | 3
  size?: HeadingSize
  children: ReactNode
  className?: string
}

const sizeClasses: Record<HeadingSize, string> = {
  lg: 'text-2xl font-semibold',
  md: 'text-xl font-semibold',
  sm: 'text-base font-medium',
}

export function Heading({ level = 1, size = 'lg', children, className }: HeadingProps) {
  const Component = `h${level}` as 'h1' | 'h2' | 'h3'
  return <Component className={cn('text-ink', sizeClasses[size], className)}>{children}</Component>
}
