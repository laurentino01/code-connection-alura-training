import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Input } from './Input'

describe('Input', () => {
  it('renders with the given placeholder', () => {
    render(<Input placeholder="usuario123" />)
    expect(screen.getByPlaceholderText('usuario123')).toBeInTheDocument()
  })

  it('calls onChange as the user types', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Input aria-label="email" onChange={handleChange} />)
    await user.type(screen.getByLabelText('email'), 'abc')
    expect(handleChange).toHaveBeenCalledTimes(3)
  })

  it('sets aria-invalid when invalid is true', () => {
    render(<Input aria-label="email" invalid />)
    expect(screen.getByLabelText('email')).toHaveAttribute('aria-invalid', 'true')
  })

  it('does not set aria-invalid by default', () => {
    render(<Input aria-label="email" />)
    expect(screen.getByLabelText('email')).not.toHaveAttribute('aria-invalid')
  })

  it('forwards unknown props to the underlying input', () => {
    render(<Input aria-label="email" name="email" autoComplete="username" />)
    const input = screen.getByLabelText('email')
    expect(input).toHaveAttribute('name', 'email')
    expect(input).toHaveAttribute('autocomplete', 'username')
  })
})
