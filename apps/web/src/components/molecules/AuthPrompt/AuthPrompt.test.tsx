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
})
