import { screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { renderWithRouter } from '@/test/utils'
import { TextLink } from './TextLink'

describe('TextLink', () => {
  it('renders an internal link with the given href', () => {
    renderWithRouter(<TextLink to="/cadastro">Crie seu cadastro!</TextLink>)
    expect(screen.getByRole('link', { name: 'Crie seu cadastro!' })).toHaveAttribute(
      'href',
      '/cadastro',
    )
  })

  it('renders an external link with target and rel set', () => {
    renderWithRouter(
      <TextLink to="https://example.com" external>
        Externo
      </TextLink>,
    )
    const link = screen.getByRole('link', { name: 'Externo' })
    expect(link).toHaveAttribute('href', 'https://example.com')
    expect(link).toHaveAttribute('target', '_blank')
    expect(link).toHaveAttribute('rel', 'noreferrer')
  })

  it('renders an iconRight node', () => {
    renderWithRouter(
      <TextLink to="/cadastro" iconRight={<span data-testid="icon" />}>
        Crie seu cadastro!
      </TextLink>,
    )
    expect(screen.getByTestId('icon')).toBeInTheDocument()
  })
})
