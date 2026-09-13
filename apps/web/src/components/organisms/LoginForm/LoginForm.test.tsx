import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { axe } from '@/test/a11y'
import { renderWithRouter } from '@/test/utils'
import { LoginForm } from './LoginForm'

describe('LoginForm', () => {
  it('renders the expected pt-BR copy', () => {
    renderWithRouter(<LoginForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Login' })).toBeInTheDocument()
    expect(screen.getByText('Boas-vindas! Faça seu login.')).toBeInTheDocument()
    expect(screen.getByLabelText('Email ou usuário')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Lembrar-me')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'Esqueci a senha' })).toBeInTheDocument()
    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
    expect(screen.getByText('Ainda não tem conta?')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Crie seu cadastro!/ })).toBeInTheDocument()
  })

  it('submits identifier, password and rememberMe', async () => {
    const handleSubmit = vi.fn()
    const { user } = renderWithRouter(<LoginForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText('Email ou usuário'), 'usuario123')
    await user.type(screen.getByLabelText('Senha'), 'segredo')
    await user.click(screen.getByLabelText('Lembrar-me'))
    await user.click(screen.getByRole('button', { name: 'Login' }))

    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(handleSubmit).toHaveBeenCalledWith({
      identifier: 'usuario123',
      password: 'segredo',
      rememberMe: true,
    })
  })

  it('disables the submit button and shows the loading label while submitting', () => {
    renderWithRouter(<LoginForm onSubmit={vi.fn()} isSubmitting />)
    expect(screen.getByRole('button', { name: 'Entrando...' })).toBeDisabled()
  })

  it('renders the error message when provided', () => {
    renderWithRouter(<LoginForm onSubmit={vi.fn()} errorMessage="Credenciais inválidas" />)
    expect(screen.getByText('Credenciais inválidas')).toBeInTheDocument()
  })

  it('has no WCAG 2.x Level A/AA violations when showing an error message', async () => {
    const { container } = renderWithRouter(
      <LoginForm onSubmit={vi.fn()} errorMessage="Credenciais inválidas" />,
    )
    expect(await axe(container)).toHaveNoViolations()
  })

  it('points the forgot-password and signup links to the given routes', () => {
    renderWithRouter(
      <LoginForm
        onSubmit={vi.fn()}
        forgotPasswordTo="/recuperar-senha"
        signupTo="/cadastro"
      />,
    )
    expect(screen.getByRole('link', { name: 'Esqueci a senha' })).toHaveAttribute(
      'href',
      '/recuperar-senha',
    )
    expect(screen.getByRole('link', { name: /Crie seu cadastro!/ })).toHaveAttribute(
      'href',
      '/cadastro',
    )
  })

  it('calls onSocialSelect when a social button is clicked', async () => {
    const handleSocialSelect = vi.fn()
    const { user } = renderWithRouter(
      <LoginForm onSubmit={vi.fn()} onSocialSelect={handleSocialSelect} />,
    )
    await user.click(screen.getByRole('button', { name: 'Github' }))
    expect(handleSocialSelect).toHaveBeenCalledWith('github')
  })
})
