import type { SocialProvider } from '@/constants/socialProviders'
import { LabeledDivider } from '@/components/molecules/LabeledDivider'
import { SocialAuthButtons } from '@/components/molecules/SocialAuthButtons'
import { cn } from '@/lib/cn'

export type SocialAuthSectionProps = {
  label: string
  providers: SocialProvider[]
  onSelect?: (id: string) => void
  className?: string
}

export function SocialAuthSection({
  label,
  providers,
  onSelect,
  className,
}: SocialAuthSectionProps) {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <LabeledDivider label={label} />
      <SocialAuthButtons providers={providers} onSelect={onSelect} />
    </div>
  )
}
