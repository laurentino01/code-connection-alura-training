import type { ReactNode } from 'react'
import { Logo } from '@/components/atoms/Logo'
import { cn } from '@/lib/cn'

export type AuthCardProps = {
  image: { src: string; webpSrc?: string; alt?: string }
  imagePosition?: 'left' | 'right'
  showLogo?: boolean
  children: ReactNode
  className?: string
}

export function AuthCard({
  image,
  imagePosition = 'left',
  showLogo = true,
  children,
  className,
}: AuthCardProps) {
  return (
    <div
      className={cn(
        'flex w-full max-w-md flex-col items-center gap-6 rounded-card border border-card-border bg-card p-6 sm:w-auto sm:max-w-none sm:flex-row sm:items-center sm:justify-between sm:gap-8 sm:px-[78px] sm:py-14',
        imagePosition === 'right' && 'sm:flex-row-reverse',
        className,
      )}
    >
      <div className="relative w-full shrink-0 sm:h-full sm:w-[407px]">
        <picture>
          {image.webpSrc && <source srcSet={image.webpSrc} type="image/webp" />}
          <img
            src={image.src}
            alt={image.alt ?? ''}
            fetchPriority="high"
            decoding="async"
            className="aspect-[407/675] w-full rounded-lg object-cover sm:h-full"
          />
        </picture>
        {showLogo && (
          <Logo className="absolute bottom-6 left-1/2 h-10 w-auto -translate-x-1/2" />
        )}
      </div>
      <div className="flex w-full flex-col gap-6 sm:w-[346px]">{children}</div>
    </div>
  )
}
