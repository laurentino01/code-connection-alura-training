import { screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import { renderWithRouter } from '@/test/utils'
import { SignupForm } from './SignupForm'

describe('SignupForm', () => {
  it('renders the expected pt-BR copy', () => {
    renderWithRouter(<SignupForm onSubmit={vi.fn()} />)
    expect(screen.getByRole('heading', { name: 'Cadastro' })).toBeInTheDocument()
    expect(screen.getByText('Olá! Preencha seus dados.')).toBeInTheDocument()
    expect(screen.getByLabelText('Nome')).toBeInTheDocument()
    expect(screen.getByLabelText('Email')).toBeInTheDocument()
    expect(screen.getByLabelText('Senha')).toBeInTheDocument()
    expect(screen.getByLabelText('Lembrar-me')).toBeInTheDocument()
    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
    expect(screen.getByText('Já tem conta?')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Faça seu login!/ })).toBeInTheDocument()
  })

  it('does not render a forgot-password link', () => {
    renderWithRouter(<SignupForm onSubmit={vi.fn()} />)
    expect(screen.queryByText(/esqueci a senha/i)).not.toBeInTheDocument()
  })

  it('submits name, email, password and rememberMe', async () => {
    const handleSubmit = vi.fn()
    const { user } = renderWithRouter(<SignupForm onSubmit={handleSubmit} />)

    await user.type(screen.getByLabelText('Nome'), 'Ana Silva')
    await user.type(screen.getByLabelText('Email'), 'ana@example.com')
    await user.type(screen.getByLabelText('Senha'), 'segredo')
    await user.click(screen.getByLabelText('Lembrar-me'))
    await user.click(screen.getByRole('button', { name: 'Cadastrar' }))

    expect(handleSubmit).toHaveBeenCalledTimes(1)
    expect(handleSubmit).toHaveBeenCalledWith({
      name: 'Ana Silva',
      email: 'ana@example.com',
      password: 'segredo',
      rememberMe: true,
    })
  })

  it('disables the submit button and shows the loading label while submitting', () => {
    renderWithRouter(<SignupForm onSubmit={vi.fn()} isSubmitting />)
    expect(screen.getByRole('button', { name: 'Cadastrando...' })).toBeDisabled()
  })

  it('renders the error message when provided', () => {
    renderWithRouter(<SignupForm onSubmit={vi.fn()} errorMessage="Email já cadastrado" />)
    expect(screen.getByText('Email já cadastrado')).toBeInTheDocument()
  })

  it('points the login link to the given route', () => {
    renderWithRouter(<SignupForm onSubmit={vi.fn()} loginTo="/login" />)
    expect(screen.getByRole('link', { name: /Faça seu login!/ })).toHaveAttribute(
      'href',
      '/login',
    )
  })

  it('calls onSocialSelect when a social button is clicked', async () => {
    const handleSocialSelect = vi.fn()
    const { user } = renderWithRouter(
      <SignupForm onSubmit={vi.fn()} onSocialSelect={handleSocialSelect} />,
    )
    await user.click(screen.getByRole('button', { name: 'Github' }))
    expect(handleSocialSelect).toHaveBeenCalledWith('github')
  })
})
