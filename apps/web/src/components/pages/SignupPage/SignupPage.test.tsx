import { screen, waitFor } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from '@/test/utils'
import { SignupPage } from './SignupPage'

describe('SignupPage', () => {
  it('renders the heading and the banner image', () => {
    renderWithRouter(<SignupPage />)
    expect(screen.getByRole('heading', { name: 'Cadastro' })).toBeInTheDocument()
    expect(screen.getByRole('img', { name: /futurista/i })).toHaveAttribute(
      'src',
      '/signup-banner.png',
    )
  })

  it('shows the loading state while submitting and returns to idle afterwards', async () => {
    const infoSpy = vi.spyOn(console, 'info').mockImplementation(() => {})
    const { user } = renderWithRouter(<SignupPage />)

    await user.type(screen.getByLabelText('Nome'), 'Ana Silva')
    await user.type(screen.getByLabelText('Email'), 'ana@example.com')
    await user.type(screen.getByLabelText('Senha'), 'segredo')
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(screen.getByRole('button', { name: 'Cadastrando...' })).toBeDisabled()

    await waitFor(() => expect(screen.getByRole('button', { name: 'Cadastrar' })).toBeEnabled())
    expect(infoSpy).toHaveBeenCalledWith(
      'cadastro submetido',
      expect.objectContaining({ name: 'Ana Silva', email: 'ana@example.com' }),
    )

    infoSpy.mockRestore()
  })
})
