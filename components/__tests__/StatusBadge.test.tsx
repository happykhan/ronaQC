import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import StatusBadge from '../StatusBadge'

describe('StatusBadge', () => {
  it('renders pass status with default label', () => {
    render(<StatusBadge status="pass" />)
    expect(screen.getByText('Pass')).toBeInTheDocument()
  })

  it('renders warn status with default label', () => {
    render(<StatusBadge status="warn" />)
    expect(screen.getByText('Warning')).toBeInTheDocument()
  })

  it('renders fail status with default label', () => {
    render(<StatusBadge status="fail" />)
    expect(screen.getByText('Fail')).toBeInTheDocument()
  })

  it('renders unknown status with default label', () => {
    render(<StatusBadge status="unknown" />)
    expect(screen.getByText('Unknown')).toBeInTheDocument()
  })

  it('renders custom label', () => {
    render(<StatusBadge status="pass" label="High QC" />)
    expect(screen.getByText('High QC')).toBeInTheDocument()
  })

  it('has status role', () => {
    render(<StatusBadge status="pass" />)
    expect(screen.getByRole('status')).toBeInTheDocument()
  })
})
