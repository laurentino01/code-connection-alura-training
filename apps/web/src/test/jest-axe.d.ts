import 'vitest'
import type { AssertionsResult } from 'jest-axe'

declare module 'vitest' {
  interface Assertion<T = unknown> {
    toHaveNoViolations(): T extends Promise<unknown> ? Promise<void> : void
  }
  interface AsymmetricMatchersContaining {
    toHaveNoViolations(): AssertionsResult
  }
}
