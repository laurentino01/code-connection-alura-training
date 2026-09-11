import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthCard } from './AuthCard'

describe('AuthCard', () => {
  it('renders its children', () => {
    render(
      <AuthCard image={{ src: '/main-banner.png' }}>
        <p>Conteúdo</p>
      </AuthCard>,
    )
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('renders the image with the given src and alt', () => {
    render(<AuthCard image={{ src: '/main-banner.png', alt: 'Banner' }}>children</AuthCard>)
    expect(screen.getByAltText('Banner')).toHaveAttribute('src', '/main-banner.png')
  })

  it('reverses the layout when imagePosition is right', () => {
    const { container } = render(
      <AuthCard image={{ src: '/main-banner.png' }} imagePosition="right">
        children
      </AuthCard>,
    )
    expect(container.firstChild).toHaveClass('sm:flex-row-reverse')
  })
})
