'use client'

import { useSamples } from '@/lib/context'
import StatusBadge from '@/components/StatusBadge'
import AmpliconHeatmap from '@/components/AmpliconHeatmap'
import { saveAs } from 'file-saver'

function getQcStatus(sample: { highQCpass?: string; baseQCpass?: string; comments?: string }) {
  if (sample.comments && sample.comments !== 'Done') return 'unknown'
  if (sample.highQCpass === 'True') return 'pass'
  if (sample.baseQCpass === 'True') return 'warn'
  if (sample.baseQCpass === 'False') return 'fail'
  return 'unknown'
}

function getQcLabel(sample: { highQCpass?: string; baseQCpass?: string; comments?: string }) {
  if (sample.comments && sample.comments !== 'Done') return 'Processing'
  if (sample.highQCpass === 'True') return 'High QC'
  if (sample.baseQCpass === 'True') return 'Base QC'
  if (sample.baseQCpass === 'False') return 'Fail'
  return 'Pending'
}

export default function ReportPage() {
  const { samples } = useSamples()

  const downloadConsensus = (fastaString: string, name: string) => {
    const blob = new Blob([fastaString.replaceAll(',', '\n')], {
      type: 'text/plain',
    })
    saveAs(blob, name + '.fasta')
  }

  if (samples.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="section-title">Sample Report</h1>
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
            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
            <line x1="3" y1="9" x2="21" y2="9" />
            <line x1="9" y1="21" x2="9" y2="9" />
          </svg>
          <p className="mt-4 text-gx-text-muted">
            No sample files loaded. Please upload BAM files on the{' '}
            <a href="/import" className="text-gx-accent hover:text-gx-accent-hover underline">
              Import
            </a>{' '}
            page.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <h1 className="section-title">Sample Report</h1>

      {/* Sample metrics table */}
      <div className="card overflow-x-auto">
        <table className="gx-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Ambiguous Bases</th>
              <th>Longest N Run</th>
              <th>QC Status</th>
              <th>Consensus Length</th>
              <th>Mapped Reads</th>
              <th>Missing Amplicons</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {samples.map((sample) => {
              const isProcessing = sample.comments !== undefined && sample.comments !== 'Done'
              return (
                <tr key={sample.name}>
                  <td className="font-sans font-medium max-w-[200px] truncate" title={sample.name}>
                    {sample.name
                      .replace(/\.mapped\.bam$/, '')
                      .replace(/\.sorted\.bam$/, '')
                      .replace(/\.bam$/, '')}
                  </td>
                  <td>
                    {typeof sample.ambigiousBasesCount === 'number'
                      ? sample.ambigiousBasesCount
                      : isProcessing
                        ? '...'
                        : '—'}
                  </td>
                  <td>
                    {sample.longestNRun !== undefined
                      ? sample.longestNRun
                      : isProcessing
                        ? '...'
                        : '—'}
                  </td>
                  <td>
                    <StatusBadge
                      status={getQcStatus(sample) as 'pass' | 'warn' | 'fail' | 'unknown'}
                      label={getQcLabel(sample)}
                    />
                  </td>
                  <td>
                    {sample.consensusLength !== undefined
                      ? sample.consensusLength.toLocaleString()
                      : isProcessing
                        ? '...'
                        : '—'}
                  </td>
                  <td className="whitespace-nowrap">
                    {sample.onefoureight ?? '—'} / {sample.properReads ?? '—'} / {sample.totalReads ?? '—'}
                  </td>
                  <td>
                    {sample.missingAmplicons !== undefined
                      ? sample.missingAmplicons.length > 0
                        ? sample.missingAmplicons.length
                        : 'All found'
                      : isProcessing
                        ? '...'
                        : '—'}
                  </td>
                  <td>
                    {isProcessing ? (
                      <span className="inline-flex items-center gap-2 text-xs text-gx-text-muted">
                        <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                        </svg>
                        {sample.comments}
                      </span>
                    ) : sample.consensusFasta ? (
                      <button
                        onClick={() => downloadConsensus(sample.consensusFasta!, sample.name)}
                        className="text-xs text-gx-accent hover:text-gx-accent-hover underline"
                      >
                        Download consensus
                      </button>
                    ) : null}
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Amplicon heatmap */}
      <div className="card p-6">
        <h2 className="text-lg font-semibold text-gx-text mb-4">Amplicon Coverage Heatmap</h2>
        {(() => {
          const ampliconData = samples
            .filter((s) => !!s.amplicons)
            .map((s) => ({
              name: s.name
                .replace(/\.mapped\.bam$/, '')
                .replace(/\.sorted\.bam$/, '')
                .replace(/\.bam$/, ''),
              coverage: s.amplicons!.map((c) => c ?? 0),
            }))
          const labels = samples.find((s) => s.ampLabels)?.ampLabels
          return ampliconData.length > 0 ? (
            <AmpliconHeatmap amplicons={ampliconData} labels={labels} />
          ) : (
            <p className="text-sm text-gx-text-muted text-center py-8">
              Amplicon data will appear here once processing completes.
            </p>
          )
        })()}
      </div>
    </div>
  )
}
