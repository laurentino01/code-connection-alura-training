import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Logo } from './Logo'

describe('Logo', () => {
  it('renders an svg element', () => {
    const { container } = render(<Logo />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('is hidden from assistive technology', () => {
    const { container } = render(<Logo />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('merges a custom className', () => {
    const { container } = render(<Logo className="h-8" />)
    expect(container.querySelector('svg')).toHaveClass('h-8')
  })
})
