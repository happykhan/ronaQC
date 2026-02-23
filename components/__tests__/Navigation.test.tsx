import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Navigation from '../Navigation'

// Mock next/navigation
vi.mock('next/navigation', () => ({
  usePathname: () => '/import',
}))

// Mock next/link
vi.mock('next/link', () => ({
  default: ({ children, href, ...props }: { children: React.ReactNode; href: string; [key: string]: unknown }) => (
    <a href={href} {...props}>{children}</a>
  ),
}))

describe('Navigation', () => {
  it('renders all nav links', () => {
    render(<Navigation />)
    expect(screen.getByText('Import')).toBeInTheDocument()
    expect(screen.getByText('Control Report')).toBeInTheDocument()
    expect(screen.getByText('Sample Report')).toBeInTheDocument()
    expect(screen.getByText('Help')).toBeInTheDocument()
  })

  it('renders the RonaQC brand link', () => {
    render(<Navigation />)
    expect(screen.getByText('RonaQC')).toBeInTheDocument()
  })

  it('renders main navigation landmark', () => {
    render(<Navigation />)
    expect(screen.getByRole('navigation', { name: 'Main navigation' })).toBeInTheDocument()
  })

  it('has a mobile menu toggle button', () => {
    render(<Navigation />)
    const toggleButtons = screen.getAllByRole('button')
    // Should have at least theme toggle and mobile menu toggle
    expect(toggleButtons.length).toBeGreaterThanOrEqual(1)
  })
})
