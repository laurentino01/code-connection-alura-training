import { Checkbox, type CheckboxProps } from '@/components/atoms/Checkbox'
import { Label } from '@/components/atoms/Label'
import { cn } from '@/lib/cn'

export type CheckboxFieldProps = Omit<CheckboxProps, 'id'> & {
  id: string
  label: string
  className?: string
}

export function CheckboxField({ id, label, className, ...rest }: CheckboxFieldProps) {
  return (
    <div className={cn('flex items-center gap-2', className)}>
      <Checkbox id={id} {...rest} />
      <Label htmlFor={id} className="cursor-pointer">
        {label}
      </Label>
    </div>
  )
}
