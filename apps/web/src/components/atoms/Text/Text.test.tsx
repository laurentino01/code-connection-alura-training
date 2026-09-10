import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Text } from './Text'

describe('Text', () => {
  it('renders its children', () => {
    render(<Text>Hello</Text>)
    expect(screen.getByText('Hello')).toBeInTheDocument()
  })

  it('renders as a <p> by default', () => {
    render(<Text>Hello</Text>)
    expect(screen.getByText('Hello').tagName).toBe('P')
  })

  it('renders as a <span> when as="span"', () => {
    render(<Text as="span">Hello</Text>)
    expect(screen.getByText('Hello').tagName).toBe('SPAN')
  })

  it('applies the muted tone class', () => {
    render(<Text tone="muted">Hello</Text>)
    expect(screen.getByText('Hello')).toHaveClass('text-ink-muted')
  })
})
