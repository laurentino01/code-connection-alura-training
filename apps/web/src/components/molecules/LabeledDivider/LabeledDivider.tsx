import { Divider } from '@/components/atoms/Divider'
import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'

export type LabeledDividerProps = {
  label: string
  className?: string
}

export function LabeledDivider({ label, className }: LabeledDividerProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <Divider className="flex-1" />
      <Text as="span" tone="muted" size="xs" className="shrink-0">
        {label}
      </Text>
      <Divider className="flex-1" />
    </div>
  )
}
