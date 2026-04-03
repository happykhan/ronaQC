import { Routes, Route, Navigate } from 'react-router-dom'
import { NavBar, AppFooter } from '@genomicx/ui'
import { useEffect } from 'react'
import { AppProviders } from './lib/context'
import { ImportPage } from './pages/ImportPage'
import { ReportPage } from './pages/ReportPage'
import { ControlPage } from './pages/ControlPage'
import { HelpPage } from './pages/HelpPage'
import { About } from './pages/About'
import { APP_VERSION } from './lib/version'

export default function App() {
  useEffect(() => {
    const saved = (localStorage.getItem('gx-theme') as 'light' | 'dark') || 'dark'
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  return (
    <AppProviders>
      <div className="app">
        <NavBar appName="RONAQC" appSubtitle="SARS-CoV-2 sequencing QC" version={APP_VERSION} />
        <main className="app-main">
          <Routes>
            <Route path="/" element={<Navigate to="/import" replace />} />
            <Route path="/import" element={<ImportPage />} />
            <Route path="/report" element={<ReportPage />} />
            <Route path="/control" element={<ControlPage />} />
            <Route path="/help" element={<HelpPage />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </main>
        <AppFooter appName="RONAQC" />
      </div>
    </AppProviders>
  )
}
