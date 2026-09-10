import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Button } from './Button'

describe('Button', () => {
  it('renders its children', () => {
    render(<Button>Login</Button>)
    expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument()
  })

  it('defaults to type="button"', () => {
    render(<Button>Login</Button>)
    expect(screen.getByRole('button', { name: 'Login' })).toHaveAttribute('type', 'button')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<Button onClick={handleClick}>Login</Button>)
    await user.click(screen.getByRole('button', { name: 'Login' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  it('does not call onClick when disabled', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(
      <Button onClick={handleClick} disabled>
        Login
      </Button>,
    )
    await user.click(screen.getByRole('button', { name: 'Login' }))
    expect(handleClick).not.toHaveBeenCalled()
  })

  it('renders an iconRight node', () => {
    render(<Button iconRight={<span data-testid="icon" />}>Login</Button>)
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('applies full width class when fullWidth is set', () => {
    render(<Button fullWidth>Login</Button>)
    expect(screen.getByRole('button', { name: 'Login' })).toHaveClass('w-full')
  })
})
