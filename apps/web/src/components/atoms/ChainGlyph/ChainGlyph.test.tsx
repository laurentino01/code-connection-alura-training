import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ChainGlyph } from './ChainGlyph'

describe('ChainGlyph', () => {
  it('renders an svg element', () => {
    const { container } = render(<ChainGlyph />)
    expect(container.querySelector('svg')).toBeInTheDocument()
  })

  it('is hidden from assistive technology', () => {
    const { container } = render(<ChainGlyph />)
    expect(container.querySelector('svg')).toHaveAttribute('aria-hidden', 'true')
  })

  it('merges a custom className', () => {
    const { container } = render(<ChainGlyph className="h-10 w-10" />)
    expect(container.querySelector('svg')).toHaveClass('h-10', 'w-10')
  })
})
