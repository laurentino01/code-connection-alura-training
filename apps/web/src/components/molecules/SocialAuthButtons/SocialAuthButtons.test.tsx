import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SocialAuthButtons } from './SocialAuthButtons'

const providers = [
  { id: 'github', label: 'Github', iconSrc: '/git-logo.svg' },
  { id: 'google', label: 'Gmail', iconSrc: '/google-logo.svg' },
]

describe('SocialAuthButtons', () => {
  it('renders one button per provider', () => {
    render(<SocialAuthButtons providers={providers} />)
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gmail' })).toBeInTheDocument()
  })

  it('calls onSelect with the provider id when clicked', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    render(<SocialAuthButtons providers={providers} onSelect={handleSelect} />)
    await user.click(screen.getByRole('button', { name: 'Github' }))
    expect(handleSelect).toHaveBeenCalledWith('github')
  })
})
