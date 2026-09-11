import { Input, type InputProps } from '@/components/atoms/Input'
import { Label } from '@/components/atoms/Label'
import { Text } from '@/components/atoms/Text'
import { cn } from '@/lib/cn'

export type FormFieldProps = Omit<InputProps, 'id' | 'invalid'> & {
  id: string
  label: string
  hint?: string
  error?: string
  className?: string
}

export function FormField({ id, label, hint, error, className, ...rest }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className={cn('flex flex-col gap-1', className)}>
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} invalid={!!error} aria-describedby={describedBy} {...rest} />
      {hint && (
        <Text as="span" tone="muted" size="xs" id={hintId}>
          {hint}
        </Text>
      )}
      {error && (
        <Text as="span" tone="muted" size="xs" id={errorId} className="text-red-400">
          {error}
        </Text>
      )}
    </div>
  )
}
