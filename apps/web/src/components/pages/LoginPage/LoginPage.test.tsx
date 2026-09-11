import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from '@/test/utils'
import { LoginPage } from './LoginPage'

describe('LoginPage', () => {
  it('renders the heading and the banner image', () => {
    renderWithRouter(<LoginPage />)
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /computador/i })).toHaveAttribute(
      'src',
      '/login-banner.png',
    )
  })

  it('shows the loading state while submitting and returns to idle afterwards', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const { user } = renderWithRouter(<LoginPage />)

    await user.type(screen.getByLabelText('Email ou usuário'), 'usuario123')
    await user.type(screen.getByLabelText('Senha'), 'segredo')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(screen.getByRole('button', { name: 'Entrando...' })).toBeDisabled()

    await waitFor(() => expect(screen.getByRole('button', { name: 'Login' })).toBeEnabled())
    expect(infoSpy).toHaveBeenCalledWith(
      'login submetido',
      expect.objectContaining({ identifier: 'usuario123' }),
    )

    infoSpy.mockRestore()
  })
})
