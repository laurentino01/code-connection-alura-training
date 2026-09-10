import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { ArrowRightIcon } from './ArrowRightIcon'

describe('ArrowRightIcon', () => {
  it('renders a decorative svg', () => {
    const { container } = render(<ArrowRightIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('merges a custom className', () => {
    const { container } = render(<ArrowRightIcon className="text-brand-ink" />)
    expect(container.querySelector('svg')).toHaveClass('text-brand-ink')
  })
})
