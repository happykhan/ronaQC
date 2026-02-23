'use client'

import { useCallback, useRef, useState, type DragEvent, type ChangeEvent } from 'react'

interface FileDropZoneProps {
  accept?: string
  multiple?: boolean
  onFiles: (files: File[]) => void
  label: string
  hint?: string
  disabled?: boolean
}

export default function FileDropZone({
  accept,
  multiple = false,
  onFiles,
  label,
  hint,
  disabled = false,
}: FileDropZoneProps) {
  const [isDragOver, setIsDragOver] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      if (!disabled) setIsDragOver(true)
    },
    [disabled]
  )

  const handleDragLeave = useCallback((e: DragEvent) => {
    e.preventDefault()
    setIsDragOver(false)
  }, [])

  const handleDrop = useCallback(
    (e: DragEvent) => {
      e.preventDefault()
      setIsDragOver(false)
      if (disabled) return
      const files = Array.from(e.dataTransfer.files)
      if (files.length > 0) onFiles(files)
    },
    [disabled, onFiles]
  )

  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const files = Array.from(e.target.files || [])
      if (files.length > 0) onFiles(files)
      // Reset input so the same file can be re-selected
      if (inputRef.current) inputRef.current.value = ''
    },
    [onFiles]
  )

  return (
    <div
      role="button"
      tabIndex={disabled ? -1 : 0}
      aria-label={label}
      aria-disabled={disabled}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => !disabled && inputRef.current?.click()}
      onKeyDown={(e) => {
        if (!disabled && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault()
          inputRef.current?.click()
        }
      }}
      className={`relative flex flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
        disabled
          ? 'cursor-not-allowed border-gx-border bg-gx-bg-alt opacity-50'
          : isDragOver
            ? 'border-gx-accent bg-gx-accent/10 cursor-copy'
            : 'border-gx-border hover:border-gx-accent hover:bg-gx-accent/5 cursor-pointer'
      }`}
    >
      <svg
        width="32"
        height="32"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        className="text-gx-text-muted"
        aria-hidden="true"
      >
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="17,8 12,3 7,8" />
        <line x1="12" y1="3" x2="12" y2="15" />
      </svg>

      <p className="text-sm font-medium text-gx-text">{label}</p>
      {hint && <p className="text-xs text-gx-text-muted">{hint}</p>}

      <input
        ref={inputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        className="hidden"
        aria-hidden="true"
        tabIndex={-1}
      />
    </div>
  )
}
