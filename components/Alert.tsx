type AlertVariant = 'info' | 'warning' | 'error'

interface AlertProps {
  variant: AlertVariant
  children: React.ReactNode
}

const variantConfig: Record<AlertVariant, { bg: string; border: string; icon: string }> = {
  info: {
    bg: 'bg-gx-info/10',
    border: 'border-gx-info/30',
    icon: 'text-gx-info',
  },
  warning: {
    bg: 'bg-gx-warning/10',
    border: 'border-gx-warning/30',
    icon: 'text-gx-warning',
  },
  error: {
    bg: 'bg-gx-error/10',
    border: 'border-gx-error/30',
    icon: 'text-gx-error',
  },
}

const icons: Record<AlertVariant, React.ReactNode> = {
  info: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="12" y1="16" x2="12" y2="12" />
      <line x1="12" y1="8" x2="12.01" y2="8" />
    </svg>
  ),
  warning: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
      <line x1="12" y1="9" x2="12" y2="13" />
      <line x1="12" y1="17" x2="12.01" y2="17" />
    </svg>
  ),
  error: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="15" y1="9" x2="9" y2="15" />
      <line x1="9" y1="9" x2="15" y2="15" />
    </svg>
  ),
}

export default function Alert({ variant, children }: AlertProps) {
  const config = variantConfig[variant]

  return (
    <div
      className={`flex gap-3 rounded-lg border p-4 ${config.bg} ${config.border}`}
      role="alert"
    >
      <span className={`flex-shrink-0 ${config.icon}`}>{icons[variant]}</span>
      <div className="text-sm text-gx-text">{children}</div>
    </div>
  )
}
