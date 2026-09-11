import type { ReactNode } from 'react'
import { cn } from '@/lib/cn'

export type AuthCardProps = {
  image: { src: string; alt?: string }
  imagePosition?: 'left' | 'right'
  children: ReactNode
  className?: string
}

export function AuthCard({ image, imagePosition = 'left', children, className }: AuthCardProps) {
  return (
    <div
      className={cn(
        'flex w-full max-w-md flex-col gap-6 rounded-card bg-card p-4 shadow-card sm:w-auto sm:max-w-none sm:flex-row sm:gap-8',
        imagePosition === 'right' && 'sm:flex-row-reverse',
        className,
      )}
    >
      <img
        src={image.src}
        alt={image.alt ?? ''}
        className="h-40 w-full shrink-0 rounded-xl object-cover sm:h-full sm:w-[190px]"
      />
      <div className="flex w-full flex-col gap-4 sm:w-[250px]">{children}</div>
    </div>
  )
}
