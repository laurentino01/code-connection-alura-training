import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthLayout } from './AuthLayout'

describe('AuthLayout', () => {
  it('renders its children', () => {
    render(
      <AuthLayout>
        <p>Conteúdo</p>
      </AuthLayout>,
    )
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('wraps the content in a main landmark', () => {
    render(
      <AuthLayout>
        <p>Conteúdo</p>
      </AuthLayout>,
    )
    expect(screen.getByRole('main')).toContainElement(screen.getByText('Conteúdo'))
  })

  it('renders two decorative, hidden chain glyphs', () => {
    const { container } = render(
      <AuthLayout>
        <p>Conteúdo</p>
      </AuthLayout>,
    )
    const glyphs = container.querySelectorAll('svg[aria-hidden="true"]')
    expect(glyphs).toHaveLength(2)
  })
})
