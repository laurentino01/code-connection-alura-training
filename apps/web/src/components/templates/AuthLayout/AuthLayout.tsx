import type { ReactNode } from 'react'
import { ChainGlyph } from '@/components/atoms/ChainGlyph'

export type AuthLayoutProps = {
  children: ReactNode
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="relative min-h-screen overflow-hidden bg-canvas">
      <ChainGlyph className="pointer-events-none absolute -left-10 -top-2 h-[420px] w-[350px] opacity-30" />
      <ChainGlyph className="pointer-events-none absolute -right-16 bottom-0 h-[420px] w-[350px] opacity-30" />

      <div className="relative z-10 flex min-h-screen items-center justify-center p-4">
        {children}
      </div>
    </div>
  )
}
