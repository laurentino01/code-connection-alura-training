import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AuthCard } from './AuthCard'

describe('AuthCard', () => {
  it('renders its children', () => {
    render(
      <AuthCard image={{ src: '/login-banner.png' }}>
        <p>Conteúdo</p>
      </AuthCard>,
    )
    expect(screen.getByText('Conteúdo')).toBeInTheDocument()
  })

  it('renders the image with the given src and alt', () => {
    render(<AuthCard image={{ src: '/login-banner.png', alt: 'Banner' }}>children</AuthCard>)
    expect(screen.getByAltText('Banner')).toHaveAttribute('src', '/login-banner.png')
  })

  it('serves a webp source while keeping the original as fallback', () => {
    const { container } = render(
      <AuthCard image={{ src: '/login-banner.png', webpSrc: '/login-banner.webp', alt: 'Banner' }}>
        children
      </AuthCard>,
    )
    const source = container.querySelector('source')
    expect(source).toHaveAttribute('srcset', '/login-banner.webp')
    expect(source).toHaveAttribute('type', 'image/webp')
    expect(screen.getByAltText('Banner')).toHaveAttribute('src', '/login-banner.png')
  })

  it('omits the webp source when none is given', () => {
    const { container } = render(
      <AuthCard image={{ src: '/login-banner.png', alt: 'Banner' }}>children</AuthCard>,
    )
    expect(container.querySelector('source')).not.toBeInTheDocument()
  })

  it('marks the banner as a high priority request', () => {
    render(<AuthCard image={{ src: '/login-banner.png', alt: 'Banner' }}>children</AuthCard>)
    expect(screen.getByAltText('Banner')).toHaveAttribute('fetchpriority', 'high')
  })

  it('reverses the layout when imagePosition is right', () => {
    const { container } = render(
      <AuthCard image={{ src: '/login-banner.png' }} imagePosition="right">
        children
      </AuthCard>,
    )
    expect(container.firstChild).toHaveClass('sm:flex-row-reverse')
  })

  it('overlays the logo on the banner by default', () => {
    const { container } = render(
      <AuthCard image={{ src: '/login-banner.png' }}>children</AuthCard>,
    )
    expect(container.querySelector('svg[aria-hidden="true"]')).toBeInTheDocument()
  })

  it('hides the logo when showLogo is false', () => {
    const { container } = render(
      <AuthCard image={{ src: '/login-banner.png' }} showLogo={false}>
        children
      </AuthCard>,
    )
    expect(container.querySelector('svg[aria-hidden="true"]')).not.toBeInTheDocument()
  })
})
