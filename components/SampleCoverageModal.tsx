'use client'

import { useEffect, useRef, useCallback } from 'react'
import CoveragePlot from './CoveragePlot'

interface SampleCoverageModalProps {
  sampleName: string
  coverage: number[]
  onClose: () => void
}

export default function SampleCoverageModal({
  sampleName,
  coverage,
  onClose,
}: SampleCoverageModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    },
    [onClose]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  const displayName = sampleName
    .replace(/\.mapped\.bam$/, '')
    .replace(/\.sorted\.bam$/, '')
    .replace(/\.bam$/, '')

  return (
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={(e) => {
        if (e.target === overlayRef.current) onClose()
      }}
      role="dialog"
      aria-modal="true"
      aria-label={`Coverage plot for ${displayName}`}
    >
      <div className="card w-full max-w-4xl mx-4 max-h-[90vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-gx-text">
            Coverage: <span className="font-mono">{displayName}</span>
          </h2>
          <button
            onClick={onClose}
            className="text-gx-text-muted hover:text-gx-text transition-colors p-1"
            aria-label="Close modal"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>
        <CoveragePlot coverage={coverage} />
      </div>
    </div>
  )
}
