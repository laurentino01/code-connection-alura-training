import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { CheckboxField } from './CheckboxField'

describe('CheckboxField', () => {
  it('resolves via getByLabelText', () => {
    render(<CheckboxField id="remember-me" label="Lembre-me" onChange={() => {}} />)
    expect(screen.getByLabelText('Lembre-me')).toBeInTheDocument()
  })

  it('calls onChange with the new checked state when toggled', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<CheckboxField id="remember-me" label="Lembre-me" onChange={handleChange} />)
    await user.click(screen.getByLabelText('Lembre-me'))
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})
