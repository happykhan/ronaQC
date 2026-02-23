'use client'

import { useNegativeControl } from '@/lib/context'
import StatusBadge from '@/components/StatusBadge'
import CoveragePlot from '@/components/CoveragePlot'
import { exportTableAsCSV } from '@/lib/exportUtils'

export default function ControlPage() {
  const { negativeControl } = useNegativeControl()

  if (!negativeControl.name) {
    return (
      <div className="space-y-6">
        <h1 className="section-title">Control Report</h1>
        <div className="card p-12 text-center">
          <svg
            width="48"
            height="48"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="mx-auto text-gx-text-muted"
            aria-hidden="true"
          >
            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
            <polyline points="14,2 14,8 20,8" />
          </svg>
          <p className="mt-4 text-gx-text-muted">
            No control file loaded. Please upload a negative control BAM file on the{' '}
            <a href="/import" className="text-gx-accent hover:text-gx-accent-hover underline">
              Import
            </a>{' '}
            page.
          </p>
        </div>
      </div>
    )
  }

  const snpStatus = negativeControl.snpCount === undefined
    ? 'unknown'
    : typeof negativeControl.snpCount === 'number' && negativeControl.snpCount > 0
      ? 'fail'
      : 'pass'

  const recoveryStatus = negativeControl.genomeRecovery === undefined
    ? 'unknown'
    : negativeControl.genomeRecovery >= 500
      ? 'warn'
      : 'pass'

  const ampCount = negativeControl.detectedAmplicons?.length ?? 0
  const ampStatus = negativeControl.detectedAmplicons === undefined
    ? 'unknown'
    : ampCount > 1
      ? 'fail'
      : ampCount === 1
        ? 'warn'
        : 'pass'

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <h1 className="section-title">Control Report</h1>
        {negativeControl.comments && (
          <span className="text-sm text-gx-text-muted">
            &mdash; {negativeControl.comments}
          </span>
        )}
      </div>

      <p className="text-sm text-gx-text-muted">
        Loaded file: <span className="font-mono">{negativeControl.name}</span>
      </p>

      {/* Metrics table */}
      <div className="card overflow-x-auto">
        <div className="flex items-center justify-end gap-2 px-4 pt-4">
          <button
            onClick={() => {
              const headers = ['Metric', 'Value', 'Status']
              const rows = [
                ['SNPs', negativeControl.snpCount !== undefined ? String(negativeControl.snpCount) : '', snpStatus],
                ['Called Bases (Coverage >=10x)', negativeControl.genomeRecovery !== undefined ? String(negativeControl.genomeRecovery) : '', recoveryStatus],
                ['Best Mapped Reads', negativeControl.onefoureight ?? '', ''],
                ['Properly Paired Reads', negativeControl.properReads ?? '', ''],
                ['Total Reads', negativeControl.totalReads ?? '', ''],
                ['Detected Amplicons', negativeControl.detectedAmplicons?.join('; ') ?? '', ampStatus],
              ]
              exportTableAsCSV(headers, rows, 'control_report', ',')
            }}
            className="text-xs text-gx-accent hover:text-gx-accent-hover underline"
          >
            Export CSV
          </button>
          <span className="text-gx-text-muted text-xs">|</span>
          <button
            onClick={() => {
              const headers = ['Metric', 'Value', 'Status']
              const rows = [
                ['SNPs', negativeControl.snpCount !== undefined ? String(negativeControl.snpCount) : '', snpStatus],
                ['Called Bases (Coverage >=10x)', negativeControl.genomeRecovery !== undefined ? String(negativeControl.genomeRecovery) : '', recoveryStatus],
                ['Best Mapped Reads', negativeControl.onefoureight ?? '', ''],
                ['Properly Paired Reads', negativeControl.properReads ?? '', ''],
                ['Total Reads', negativeControl.totalReads ?? '', ''],
                ['Detected Amplicons', negativeControl.detectedAmplicons?.join('; ') ?? '', ampStatus],
              ]
              exportTableAsCSV(headers, rows, 'control_report', '\t')
            }}
            className="text-xs text-gx-accent hover:text-gx-accent-hover underline"
          >
            Export TSV
          </button>
        </div>
        <table className="gx-table">
          <thead>
            <tr>
              <th>Metric</th>
              <th>Value</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="font-sans font-medium">SNPs</td>
              <td>
                {negativeControl.snpCount !== undefined
                  ? negativeControl.snpCount
                  : 'Calculating...'}
              </td>
              <td><StatusBadge status={snpStatus as 'pass' | 'warn' | 'fail' | 'unknown'} /></td>
            </tr>
            <tr>
              <td className="font-sans font-medium">Called Bases (Coverage &ge;10x)</td>
              <td>
                {negativeControl.genomeRecovery !== undefined
                  ? negativeControl.genomeRecovery.toLocaleString()
                  : 'Calculating...'}
              </td>
              <td><StatusBadge status={recoveryStatus as 'pass' | 'warn' | 'fail' | 'unknown'} /></td>
            </tr>
            <tr>
              <td className="font-sans font-medium">Best Mapped Reads</td>
              <td>{negativeControl.onefoureight ?? 'Calculating...'}</td>
              <td />
            </tr>
            <tr>
              <td className="font-sans font-medium">Properly Paired Reads</td>
              <td>{negativeControl.properReads ?? 'Calculating...'}</td>
              <td />
            </tr>
            <tr>
              <td className="font-sans font-medium">Total Reads</td>
              <td>{negativeControl.totalReads ?? 'Calculating...'}</td>
              <td />
            </tr>
            <tr>
              <td className="font-sans font-medium">Detected Amplicons</td>
              <td>
                {negativeControl.detectedAmplicons !== undefined
                  ? negativeControl.detectedAmplicons.length > 0
                    ? negativeControl.detectedAmplicons.join(', ')
                    : 'None'
                  : 'Calculating...'}
              </td>
              <td><StatusBadge status={ampStatus as 'pass' | 'warn' | 'fail' | 'unknown'} /></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Coverage plot */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gx-text mb-4">Coverage Plot</h2>
        {negativeControl.coverage ? (
          <CoveragePlot coverage={negativeControl.coverage} />
        ) : (
          <div className="flex items-center justify-center py-12">
            <svg
              className="h-6 w-6 animate-spin text-gx-accent"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
            </svg>
            <span className="ml-3 text-sm text-gx-text-muted">Loading coverage data...</span>
          </div>
        )}
      </div>
    </div>
  )
}
