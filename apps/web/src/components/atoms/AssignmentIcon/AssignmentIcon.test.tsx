import { render } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AssignmentIcon } from './AssignmentIcon'

describe('AssignmentIcon', () => {
  it('renders a decorative svg', () => {
    const { container } = render(<AssignmentIcon />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute('aria-hidden', 'true')
  })

  it('merges a custom className', () => {
    const { container } = render(<AssignmentIcon className="text-brand" />)
    expect(container.querySelector('svg')).toHaveClass('text-brand')
  })
})
