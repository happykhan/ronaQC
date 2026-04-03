import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { AppProviders } from '@/lib/context'
import { ImportPage } from '../ImportPage'

function renderWithProviders(ui: React.ReactElement) {
  return render(
    <MemoryRouter>
      <AppProviders>
        {ui}
      </AppProviders>
    </MemoryRouter>
  )
}

describe('ImportPage', () => {
  it('renders the Import heading', () => {
    renderWithProviders(<ImportPage />)
    expect(screen.getByText('Import')).toBeInTheDocument()
  })

  it('renders the Settings section', () => {
    renderWithProviders(<ImportPage />)
    expect(screen.getByText('Settings')).toBeInTheDocument()
  })

  it('renders the ARTIC primer version selector', () => {
    renderWithProviders(<ImportPage />)
    expect(screen.getByLabelText('ARTIC Primer Version')).toBeInTheDocument()
  })

  it('renders the Negative Control drop zone', () => {
    renderWithProviders(<ImportPage />)
    expect(screen.getByText('Negative Control')).toBeInTheDocument()
  })

  it('renders the Sample Data drop zone', () => {
    renderWithProviders(<ImportPage />)
    expect(screen.getByText('Sample Data')).toBeInTheDocument()
  })

  it('renders the info alert', () => {
    renderWithProviders(<ImportPage />)
    expect(screen.getByRole('alert')).toBeInTheDocument()
  })
})
