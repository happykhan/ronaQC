'use client'

import type { ProcessingProgress as ProgressType } from '@/lib/types'

interface ProcessingProgressProps {
  progress: ProgressType
}

export default function ProcessingProgress({ progress }: ProcessingProgressProps) {
  if (!progress.active) return null

  return (
    <div className="space-y-2" aria-live="polite" aria-atomic="true">
      <div className="flex items-center gap-3">
        <svg
          className="h-5 w-5 animate-spin text-gx-accent"
          viewBox="0 0 24 24"
          fill="none"
          aria-hidden="true"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
          />
        </svg>
        <span className="text-sm font-medium text-gx-text">{progress.step}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progress.percent}%` }}
          role="progressbar"
          aria-valuenow={progress.percent}
          aria-valuemin={0}
          aria-valuemax={100}
          aria-label={`Processing: ${progress.percent}%`}
        />
      </div>
    </div>
  )
}
