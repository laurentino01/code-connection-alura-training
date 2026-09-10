import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { FormField } from './FormField'

describe('FormField', () => {
  it('links the label to the input via id/htmlFor', () => {
    render(<FormField id="email" label="Email ou usuário" />)
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
  })

  it('calls onChange as the user types', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<FormField id="email" label="Email ou usuário" onChange={handleChange} />)
    await user.type(screen.getByLabelText('Email ou usuário'), 'a')
    expect(handleChange).toHaveBeenCalledTimes(1)
  })

  it('renders the error message and marks the input invalid', () => {
    render(<FormField id="email" label="Email ou usuário" error="Campo obrigatório" />)
    const input = screen.getByLabelText('Email ou usuário')
    expect(input).toHaveAttribute('aria-invalid', 'true')
    expect(screen.getByText('Campo obrigatório')).toBeInTheDocument()
    expect(input).toHaveAttribute('aria-describedby', expect.stringContaining('email-error'))
  })

  it('renders no error message when error is not provided', () => {
    render(<FormField id="email" label="Email ou usuário" />)
    expect(screen.getByLabelText('Email ou usuário')).not.toHaveAttribute('aria-invalid', 'true')
  })
})
