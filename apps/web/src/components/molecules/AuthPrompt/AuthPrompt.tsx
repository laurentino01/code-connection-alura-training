import type { ReactNode } from 'react'
import { Text } from '@/components/atoms/Text'
import { TextLink } from '@/components/atoms/TextLink'
import { cn } from '@/lib/cn'

export type AuthPromptLayout = 'stacked' | 'inline'

export type AuthPromptProps = {
  message: string
  linkLabel: string
  to: string
  icon?: ReactNode
  layout?: AuthPromptLayout
  className?: string
}

export function AuthPrompt({
  message,
  linkLabel,
  to,
  icon,
  layout = 'stacked',
  className,
}: AuthPromptProps) {
  if (layout === 'inline') {
    return (
      <div className={cn('flex items-center gap-2', className)}>
        <Text as="span" tone="default" size="body">
          {message}
        </Text>
        <TextLink to={to} tone="brand" size="body" iconRight={icon}>
          {linkLabel}
        </TextLink>
      </div>
    )
  }

  return (
    <div className={cn('flex flex-col items-center gap-2 text-center', className)}>
      <Text as="span" tone="default" size="small">
        {message}
      </Text>
      <TextLink to={to} tone="brand" size="body" iconRight={icon}>
        {linkLabel}
      </TextLink>
    </div>
  )
}
