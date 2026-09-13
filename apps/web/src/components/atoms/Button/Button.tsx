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
  secondary: 'bg-field text-field-ink hover:opacity-90 disabled:opacity-60',
  ghost: 'bg-transparent text-ink hover:bg-card disabled:opacity-60',
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
        'inline-flex items-center justify-center gap-2 rounded-button px-4 py-3 text-body font-semibold transition-colors disabled:cursor-not-allowed',
        'focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-brand',
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
