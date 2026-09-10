import { cn } from '@/lib/cn'

export type DividerProps = {
  className?: string
}

export function Divider({ className }: DividerProps) {
  return <hr className={cn('border-line', className)} />
}
