import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LoginIcon } from './LoginIcon'

describe('LoginIcon', () => {
  it('renders a decorative svg', () => {
    const { container } = render(<LoginIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('merges a custom className', () => {
    const { container } = render(<LoginIcon className="text-brand" />)
    expect(container.querySelector('svg')).toHaveClass('text-brand')
  })
})
