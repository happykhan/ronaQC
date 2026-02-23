import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import Alert from '../Alert'

describe('Alert', () => {
  it('renders info variant', () => {
    render(<Alert variant="info">Info message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Info message')).toBeInTheDocument()
  })

  it('renders warning variant', () => {
    render(<Alert variant="warning">Warning message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Warning message')).toBeInTheDocument()
  })

  it('renders error variant', () => {
    render(<Alert variant="error">Error message</Alert>)
    expect(screen.getByRole('alert')).toBeInTheDocument()
    expect(screen.getByText('Error message')).toBeInTheDocument()
  })
})
