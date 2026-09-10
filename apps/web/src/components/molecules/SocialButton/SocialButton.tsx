import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'

export type SocialButtonProps = {
  iconSrc: string
  label: string
  iconAlt?: string
  onClick?: () => void
  disabled?: boolean
  className?: string
}

export function SocialButton({
  iconSrc,
  label,
  iconAlt = '',
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
      <span className="flex h-10 w-10 items-center justify-center rounded-full border border-line bg-field">
        <img src={iconSrc} alt={iconAlt} className="h-5 w-5" />
      </span>
      <Text as="span" tone="muted" size="xs">
        {label}
      </Text>
    </button>
  )
}
