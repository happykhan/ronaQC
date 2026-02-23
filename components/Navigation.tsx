'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import ThemeToggle from './ThemeToggle'

const navLinks = [
  { name: 'Import', href: '/import' },
  { name: 'Control Report', href: '/control' },
  { name: 'Sample Report', href: '/report' },
  { name: 'Help', href: '/help' },
]

export default function Navigation() {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <header
      className="sticky top-0 z-50 border-b border-gx-border"
      style={{
        background: 'rgba(var(--gx-bg-rgb, 248 250 252) / 0.8)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <nav className="mx-auto flex max-w-5xl items-center justify-between px-4 py-3" aria-label="Main navigation">
        <Link href="/import" className="text-xl font-bold text-gx-accent hover:text-gx-accent-hover transition-colors">
          RonaQC
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gx-accent text-gx-text-inverted'
                    : 'text-gx-text-muted hover:text-gx-text hover:bg-gx-surface-hover'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
          <ThemeToggle />
        </div>

        {/* Mobile hamburger */}
        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="rounded-lg p-2 text-gx-text-muted hover:bg-gx-surface-hover transition-colors"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            ) : (
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                <line x1="3" y1="6" x2="21" y2="6" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="3" y1="18" x2="21" y2="18" />
              </svg>
            )}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-gx-border px-4 pb-4 md:hidden">
          {navLinks.map((link) => {
            const isActive = pathname === link.href
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`block rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gx-accent text-gx-text-inverted'
                    : 'text-gx-text-muted hover:text-gx-text hover:bg-gx-surface-hover'
                }`}
              >
                {link.name}
              </Link>
            )
          })}
        </div>
      )}
    </header>
  )
}
