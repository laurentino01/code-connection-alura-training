import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { Heading } from './Heading'

describe('Heading', () => {
  it('renders its children', () => {
    render(<Heading>Login</Heading>)
    expect(screen.getByText('Login')).toBeInTheDocument()
  })

  it('defaults to a level-1 heading', () => {
    render(<Heading>Login</Heading>)
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Login')
  })

  it('renders the requested heading level', () => {
    render(<Heading level={2}>Login</Heading>)
    expect(screen.getByRole('heading', { level: 2 })).toHaveTextContent('Login')
  })
})
