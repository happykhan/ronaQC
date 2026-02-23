type Status = 'pass' | 'warn' | 'fail' | 'unknown'

interface StatusBadgeProps {
  status: Status
  label?: string
}

const statusConfig: Record<Status, { bg: string; text: string; defaultLabel: string }> = {
  pass: {
    bg: 'bg-gx-success/15 border-gx-success/30',
    text: 'text-gx-success',
    defaultLabel: 'Pass',
  },
  warn: {
    bg: 'bg-gx-warning/15 border-gx-warning/30',
    text: 'text-gx-warning',
    defaultLabel: 'Warning',
  },
  fail: {
    bg: 'bg-gx-error/15 border-gx-error/30',
    text: 'text-gx-error',
    defaultLabel: 'Fail',
  },
  unknown: {
    bg: 'bg-gx-text-muted/10 border-gx-text-muted/20',
    text: 'text-gx-text-muted',
    defaultLabel: 'Unknown',
  },
}

export default function StatusBadge({ status, label }: StatusBadgeProps) {
  const config = statusConfig[status]
  const displayLabel = label || config.defaultLabel

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${config.bg} ${config.text}`}
      role="status"
      aria-label={displayLabel}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${
          status === 'pass'
            ? 'bg-gx-success'
            : status === 'warn'
              ? 'bg-gx-warning'
              : status === 'fail'
                ? 'bg-gx-error'
                : 'bg-gx-text-muted'
        }`}
        aria-hidden="true"
      />
      {displayLabel}
    </span>
  )
}
