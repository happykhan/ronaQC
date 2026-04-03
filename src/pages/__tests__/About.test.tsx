import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { About } from '../About'

function renderAbout() {
  return render(
    <MemoryRouter>
      <About />
    </MemoryRouter>
  )
}

describe('About', () => {
  it('renders the About heading', () => {
    renderAbout()
    expect(screen.getByText('About RonaQC')).toBeInTheDocument()
  })

  it('renders the author name', () => {
    renderAbout()
    expect(screen.getByText('Nabil-Fareed Alikhan')).toBeInTheDocument()
  })

  it('renders the author role', () => {
    renderAbout()
    expect(screen.getByText(/Senior Bioinformatician/)).toBeInTheDocument()
  })

  it('renders GitHub link', () => {
    renderAbout()
    const links = screen.getAllByText(/github.com\/happykhan\/ronaQC/)
    expect(links.length).toBeGreaterThanOrEqual(1)
  })

  it('renders privacy note about no data upload', () => {
    renderAbout()
    expect(screen.getByText(/never uploaded to any server/)).toBeInTheDocument()
  })
})
