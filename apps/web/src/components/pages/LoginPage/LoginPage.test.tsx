import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '@/test/a11y'
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

  it('has no WCAG 2.x Level A/AA violations', async () => {
    const { container } = renderWithRouter(<LoginPage />)
    expect(await axe(container)).toHaveNoViolations()
  })

  it('shows the loading state while submitting and returns to idle afterwards', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const { user } = renderWithRouter(<LoginPage />)

    await user.type(screen.getByLabelText('Email ou usuário'), 'usuario123')
    await user.type(screen.getByLabelText('Senha'), 'segredo')
    await user.click(screen.getByRole('button', { name: 'Login' }))

    const submittingButton = screen.getByRole('button', { name: 'Entrando...' })
    expect(submittingButton).toBeDisabled()
    expect(await axe(submittingButton.closest('form') ?? document.body)).toHaveNoViolations()

    await waitFor(() => expect(screen.getByRole('button', { name: 'Login' })).toBeEnabled())
    expect(infoSpy).toHaveBeenCalledWith(
      'login submetido',
      expect.objectContaining({ identifier: 'usuario123' }),
    )

    infoSpy.mockRestore()
  })
})
