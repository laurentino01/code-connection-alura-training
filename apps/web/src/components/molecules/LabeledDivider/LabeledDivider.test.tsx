import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { LabeledDivider } from './LabeledDivider'

describe('LabeledDivider', () => {
  it('renders the label text between two separators', () => {
    render(<LabeledDivider label="ou entre com outras contas" />)
    expect(screen.getByText('ou entre com outras contas')).toBeInTheDocument()
    expect(screen.getAllByRole('separator')).toHaveLength(2)
  })
})
