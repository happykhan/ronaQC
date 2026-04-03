import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { About } from '../About'

describe('About', () => {
  it('renders the About heading', () => {
    render(<About />)
    expect(screen.getByText('About RonaQC')).toBeInTheDocument()
  })

  it('renders the author name', () => {
    render(<About />)
    expect(screen.getByText('Nabil-Fareed Alikhan')).toBeInTheDocument()
  })

  it('renders the author role', () => {
    render(<About />)
    expect(screen.getByText(/Senior Bioinformatician/)).toBeInTheDocument()
  })

  it('renders GitHub link', () => {
    render(<About />)
    const links = screen.getAllByText(/github.com\/happykhan\/ronaQC/)
    expect(links.length).toBeGreaterThanOrEqual(1)
  })

  it('renders privacy note about no data upload', () => {
    render(<About />)
    expect(screen.getByText(/No data leaves your computer/)).toBeInTheDocument()
  })
})
