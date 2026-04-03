import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { StatusBadge } from '@genomicx/ui'

describe('StatusBadge (@genomicx/ui)', () => {
  it('renders success variant', () => {
    render(<StatusBadge variant="success">Pass</StatusBadge>)
    expect(screen.getByText('Pass')).toBeInTheDocument()
  })

  it('renders warning variant', () => {
    render(<StatusBadge variant="warning">Warning</StatusBadge>)
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })

  it('renders error variant', () => {
    render(<StatusBadge variant="error">Fail</StatusBadge>)
    expect(screen.getByText('Fail')).toBeInTheDocument()
  })

  it('renders muted variant', () => {
    render(<StatusBadge variant="muted">Unknown</StatusBadge>)
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  it('renders info variant', () => {
    render(<StatusBadge variant="info">Info</StatusBadge>)
    expect(screen.getByText('Info')).toBeInTheDocument()
  })

  it('renders custom label as children', () => {
    render(<StatusBadge variant="success">High QC</StatusBadge>)
    expect(screen.getByText('High QC')).toBeInTheDocument()
  })
})
