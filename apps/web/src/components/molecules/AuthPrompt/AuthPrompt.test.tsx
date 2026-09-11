import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/test/utils'
import { AuthPrompt } from './AuthPrompt'

describe('AuthPrompt', () => {
  it('renders the message and the link with the correct href', () => {
    renderWithRouter(
      <AuthPrompt message="Ainda não tem conta?" linkLabel="Crie seu cadastro!" to="/cadastro" />,
    )
    expect(screen.getByText('Ainda não tem conta?')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Crie seu cadastro!/ })).toHaveAttribute(
      'href',
      '/cadastro',
    )
  })

  it('renders an icon next to the link when given', () => {
    renderWithRouter(
      <AuthPrompt
        message="Ainda não tem conta?"
        linkLabel="Crie seu cadastro!"
        to="/cadastro"
        icon={<span data-testid="icon" />}
      />,
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })

  it('stacks the message above the link by default', () => {
    const { container } = renderWithRouter(
      <AuthPrompt message="Ainda não tem conta?" linkLabel="Crie seu cadastro!" to="/cadastro" />,
    )
    expect(container.firstChild).toHaveClass('flex-col')
  })

  it('lays the message and link out inline when layout is inline', () => {
    const { container } = renderWithRouter(
      <AuthPrompt
        message="Já tem conta?"
        linkLabel="Faça seu login!"
        to="/login"
        layout="inline"
      />,
    )
    expect(container.firstChild).not.toHaveClass('flex-col')
  })
})
