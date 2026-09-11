import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SocialButton } from './SocialButton'

describe('SocialButton', () => {
  it('exposes the label as its accessible name', () => {
    render(<SocialButton iconSrc="/git-logo.svg" label="Github" />)
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
  })

  it('renders the icon with the given src', () => {
    render(<SocialButton iconSrc="/git-logo.svg" label="Github" />)
    expect(screen.getByRole('button', { name: 'Github' }).querySelector('img')).toHaveAttribute(
      'src',
      '/git-logo.svg',
    )
  })

  it('defaults to type="button"', () => {
    render(<SocialButton iconSrc="/git-logo.svg" label="Github" />)
    expect(screen.getByRole('button', { name: 'Github' })).toHaveAttribute('type', 'button')
  })

  it('calls onClick when clicked', async () => {
    const user = userEvent.setup()
    const handleClick = vi.fn()
    render(<SocialButton iconSrc="/git-logo.svg" label="Github" onClick={handleClick} />)
    await user.click(screen.getByRole('button', { name: 'Github' }))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })
})
