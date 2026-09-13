import { Divider } from '@/components/atoms/Divider'
import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'

export type LabeledDividerProps = { label: string; className?: string }

export function LabeledDivider({ label, className }: LabeledDividerProps) {
  return (
    <div className={cn('flex items-center gap-4', className)}>
      <Divider className="flex-1" />
      <Text as="span" tone="default" size="small" className="shrink-0 whitespace-nowrap">
        {label}
      </Text>
      <Divider className="flex-1" />
    </div>
  )
}
