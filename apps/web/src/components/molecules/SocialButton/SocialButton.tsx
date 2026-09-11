import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'

export type SocialButtonProps = {
  iconSrc: string
  label: string
  iconAlt?: string
  iconWidth?: number
  iconHeight?: number
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function SocialButton({
  iconSrc,
  label,
  iconAlt = '',
  iconWidth = 32,
  iconHeight = 32,
  onClick,
  disabled,
  className,
}: SocialButtonProps) {
  return (
    <button
      type="button"
      aria-label={label}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'flex flex-col items-center gap-1 disabled:cursor-not-allowed disabled:opacity-60',
        className,
      )}
    >
      <img src={iconSrc} alt={iconAlt} width={iconWidth} height={iconHeight} />
      <Text as="span" tone="default" size="label">
        {label}
      </Text>
    </button>
  )
}
