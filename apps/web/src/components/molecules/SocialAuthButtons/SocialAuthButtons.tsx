import type { SocialProvider } from '@/constants/socialProviders'
import { SocialButton } from '@/components/molecules/SocialButton'
import { cn } from '@/lib/cn'

export type SocialAuthButtonsProps = {
  providers: SocialProvider[]
  onSelect?: (id: string) => void
  disabled?: boolean
  className?: string
}

export function SocialAuthButtons({
  providers,
  onSelect,
  disabled,
  className,
}: SocialAuthButtonsProps) {
  return (
    <div className={cn('flex items-center justify-center gap-6', className)}>
      {providers.map((provider) => (
        <SocialButton
          key={provider.id}
          iconSrc={provider.iconSrc}
          label={provider.label}
          iconWidth={provider.iconWidth}
          iconHeight={provider.iconHeight}
          disabled={disabled}
          onClick={() => onSelect?.(provider.id)}
        />
      ))}
    </div>
  )
}
