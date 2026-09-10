import type { ComponentPropsWithRef, ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: ButtonVariant
  fullWidth?: boolean
  iconLeft?: ReactNode
  iconRight?: ReactNode
}

const variantClasses: Record<ButtonVariant, string> = {
  primary: 'bg-brand text-brand-ink hover:bg-brand-hover disabled:opacity-60',
  secondary: 'bg-field text-ink border border-line hover:bg-line disabled:opacity-60',
  ghost: 'bg-transparent text-ink hover:bg-field disabled:opacity-60',
}

export function Button({
  variant = 'primary',
  fullWidth = false,
  iconLeft,
  iconRight,
  type = 'button',
  className,
  children,
  ...rest
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 rounded-field px-4 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed',
        variantClasses[variant],
        fullWidth && 'w-full',
        className,
      )}
      {...rest}
    >
      {iconLeft}
      {children}
      {iconRight}
    </button>
  )
}
