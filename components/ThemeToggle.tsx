'use client'

import { useEffect, useState } from 'react'

export default function ThemeToggle() {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark')
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const stored = localStorage.getItem('gx-theme') as 'dark' | 'light' | null
    const initial = stored || 'dark'
    setTheme(initial)
    document.documentElement.setAttribute('data-theme', initial)
    setMounted(true)
  }, [])

  const toggle = () => {
    const next = theme === 'dark' ? 'light' : 'dark'
    setTheme(next)
    localStorage.setItem('gx-theme', next)
    document.documentElement.setAttribute('data-theme', next)
  }

  if (!mounted) return null

  return (
    <button
      onClick={toggle}
      className="relative inline-flex h-8 w-14 items-center rounded-full border border-gx-border bg-gx-surface transition-colors hover:bg-gx-surface-hover"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
      role="switch"
      aria-checked={theme === 'dark'}
    >
      <span
        className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-gx-accent text-gx-text-inverted transition-transform duration-200 ${
          theme === 'dark' ? 'translate-x-7' : 'translate-x-1'
        }`}
      >
        {theme === 'dark' ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 12.79A9 9 0 0 1 11.21 3 7 7 0 1 0 21 12.79Z" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <circle cx="12" cy="12" r="4" />
            <line x1="12" y1="2" x2="12" y2="4" />
            <line x1="12" y1="20" x2="12" y2="22" />
            <line x1="4.93" y1="4.93" x2="6.34" y2="6.34" />
            <line x1="17.66" y1="17.66" x2="19.07" y2="19.07" />
            <line x1="2" y1="12" x2="4" y2="12" />
            <line x1="20" y1="12" x2="22" y2="12" />
            <line x1="4.93" y1="19.07" x2="6.34" y2="17.66" />
            <line x1="17.66" y1="6.34" x2="19.07" y2="4.93" />
          </svg>
        )}
      </span>
    </button>
  )
}
