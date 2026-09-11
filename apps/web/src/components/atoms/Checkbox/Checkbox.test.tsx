import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { Checkbox } from './Checkbox'

describe('Checkbox', () => {
  it('exposes a checkbox role', () => {
    render(<Checkbox aria-label="Lembre-me" />)
    expect(screen.getByRole('checkbox', { name: 'Lembre-me' })).toBeInTheDocument()
  })

  it('reflects the checked prop', () => {
    render(<Checkbox aria-label="Lembre-me" checked readOnly />)
    expect(screen.getByRole('checkbox', { name: 'Lembre-me' })).toBeChecked()
  })

  it('calls onChange when toggled', async () => {
    const user = userEvent.setup()
    const handleChange = vi.fn()
    render(<Checkbox aria-label="Lembre-me" onChange={handleChange} />)
    await user.click(screen.getByRole('checkbox', { name: 'Lembre-me' }))
    expect(handleChange).toHaveBeenCalledTimes(1)
  })
})
