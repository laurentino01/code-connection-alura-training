import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { SocialAuthSection } from './SocialAuthSection'

const providers = [
  { id: 'github', label: 'Github', iconSrc: '/git-logo.svg' },
  { id: 'google', label: 'Gmail', iconSrc: '/google-logo.svg' },
]

describe('SocialAuthSection', () => {
  it('renders the label and a button per provider', () => {
    render(<SocialAuthSection label="ou entre com outras contas" providers={providers} />)
    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Github' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Gmail' })).toBeInTheDocument()
  })

  it('forwards onSelect to the underlying buttons', async () => {
    const user = userEvent.setup()
    const handleSelect = vi.fn()
    render(
      <SocialAuthSection
        label="ou entre com outras contas"
        providers={providers}
        onSelect={handleSelect}
      />,
    )
    await user.click(screen.getByRole('button', { name: 'Gmail' }))
    expect(handleSelect).toHaveBeenCalledWith('google')
  })
})
