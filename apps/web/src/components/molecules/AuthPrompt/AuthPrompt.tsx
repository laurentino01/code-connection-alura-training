import type { ReactNode } from 'react'
import { ArrowRightIcon } from '@/components/atoms/ArrowRightIcon'
import { Text } from '@/components/atoms/Text'
import { TextLink } from '@/components/atoms/TextLink'
import { cn } from '@/lib/cn'

export type AuthPromptProps = {
  message: string
  linkLabel: string
  to: string
  icon?: ReactNode
  className?: string
}

export function AuthPrompt({ message, linkLabel, to, icon, className }: AuthPromptProps) {
  return (
    <div className={cn('flex flex-col items-center gap-1 text-center', className)}>
      <Text as="span" tone="muted" size="xs">
        {message}
      </Text>
      <TextLink to={to} tone="brand" size="sm" iconRight={icon ?? <ArrowRightIcon />}>
        {linkLabel}
      </TextLink>
    </div>
  )
}
