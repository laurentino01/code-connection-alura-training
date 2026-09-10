import { cn } from '@/lib/cn'

export type ChainGlyphProps = {
  className?: string
}

/**
 * Decorative "chain link" glyph based on the Code Connect mark. Renders as an
 * inline SVG (not a static asset) so it can inherit color via `currentColor`
 * and be reused at brand size elsewhere later.
 */
export function ChainGlyph({ className }: ChainGlyphProps) {
  return (
    <svg
      viewBox="0 0 200 200"
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={cn('text-glyph', className)}
    >
      <rect x="20" y="55" width="90" height="60" rx="30" stroke="currentColor" strokeWidth={4} />
      <rect x="90" y="85" width="90" height="60" rx="30" stroke="currentColor" strokeWidth={4} />
    </svg>
  )
}
