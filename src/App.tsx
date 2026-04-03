import { Routes, Route, Navigate, NavLink } from 'react-router-dom'
import { NavBar, AppFooter } from '@genomicx/ui'
import { useEffect } from 'react'
import { AppProviders } from './lib/context'
import { ImportPage } from './pages/ImportPage'
import { ReportPage } from './pages/ReportPage'
import { ControlPage } from './pages/ControlPage'
import { HelpPage } from './pages/HelpPage'
import { About } from './pages/About'
import { APP_VERSION } from './lib/version'

const NAV_TABS = [
  { to: '/import', label: 'Import' },
  { to: '/report', label: 'Sample Report' },
  { to: '/control', label: 'Control Report' },
  { to: '/help', label: 'Help' },
]

function TabNav() {
  return (
    <nav className="rqc-tab-nav" aria-label="Analysis pages">
      <div className="rqc-tab-nav-inner">
        {NAV_TABS.map(({ to, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              isActive ? 'rqc-tab-link rqc-tab-link--active' : 'rqc-tab-link'
            }
          >
            {label}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

export default function App() {
  useEffect(() => {
    const saved = (localStorage.getItem('gx-theme') as 'light' | 'dark') || 'dark'
    document.documentElement.setAttribute('data-theme', saved)
  }, [])

  return (
    <AppProviders>
      <div className="app">
        <NavBar
          appName="RONAQC"
          appSubtitle="SARS-CoV-2 sequencing QC"
          githubUrl="https://github.com/happykhan/ronaQC"
          version={APP_VERSION}
          icon={
            <svg className="gx-nav-logo-icon" viewBox="0 0 24 24" fill="none" stroke="var(--gx-accent)" strokeWidth="1.5">
              {/* Coronavirus particle icon */}
              <circle cx="12" cy="12" r="5" />
              <line x1="12" y1="2" x2="12" y2="6" />
              <circle cx="12" cy="1.5" r="1" fill="var(--gx-accent)" stroke="none" />
              <line x1="12" y1="18" x2="12" y2="22" />
              <circle cx="12" cy="22.5" r="1" fill="var(--gx-accent)" stroke="none" />
              <line x1="2" y1="12" x2="6" y2="12" />
              <circle cx="1.5" cy="12" r="1" fill="var(--gx-accent)" stroke="none" />
              <line x1="18" y1="12" x2="22" y2="12" />
              <circle cx="22.5" cy="12" r="1" fill="var(--gx-accent)" stroke="none" />
              <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
              <circle cx="4.22" cy="4.22" r="1" fill="var(--gx-accent)" stroke="none" />
              <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
              <circle cx="19.78" cy="19.78" r="1" fill="var(--gx-accent)" stroke="none" />
              <line x1="19.07" y1="4.93" x2="16.24" y2="7.76" />
              <circle cx="19.78" cy="4.22" r="1" fill="var(--gx-accent)" stroke="none" />
              <line x1="7.76" y1="16.24" x2="4.93" y2="19.07" />
              <circle cx="4.22" cy="19.78" r="1" fill="var(--gx-accent)" stroke="none" />
            </svg>
          }
        />
        <TabNav />
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
