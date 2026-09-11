import type { ReactNode } from 'react'
import { ChainGlyph } from '@/components/atoms/ChainGlyph'

export type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            'radial-gradient(circle at 50% 35%, var(--color-canvas-tint), var(--color-canvas) 70%)',
        }}
      />
      <ChainGlyph className="pointer-events-none absolute -left-24 top-10 h-[420px] w-[420px] opacity-60" />
      <ChainGlyph className="pointer-events-none absolute -right-32 bottom-0 h-[520px] w-[520px] opacity-40" />
      <ChainGlyph className="pointer-events-none absolute -right-10 top-[-80px] h-[280px] w-[280px] opacity-30" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}
