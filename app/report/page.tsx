'use client'

import { useState } from 'react'
import { useSamples, useNegativeControl } from '@/lib/context'
import StatusBadge from '@/components/StatusBadge'
import AmpliconHeatmap from '@/components/AmpliconHeatmap'
import SampleCoverageModal from '@/components/SampleCoverageModal'
import { saveAs } from 'file-saver'
import { exportTableAsCSV } from '@/lib/exportUtils'
import type { Sample } from '@/lib/types'

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

function getJudgement(sample: Sample): { label: string; icon: 'up' | 'mixed' | 'down'; description: string } {
  if (sample.comments && sample.comments !== 'Done') {
    return { label: 'Pending', icon: 'mixed', description: 'Still processing' }
  }
  if (sample.highQCpass === 'True') {
    return { label: 'Upload', icon: 'up', description: 'Suitable for GISAID/INSDC submission' }
  }
  if (sample.baseQCpass === 'True') {
    return { label: 'Use only', icon: 'mixed', description: 'Usable for analysis but not for public database submission' }
  }
  if (sample.baseQCpass === 'False') {
    return { label: 'Discard', icon: 'down', description: 'Insufficient quality — discard' }
  }
  return { label: 'Pending', icon: 'mixed', description: 'Awaiting results' }
}

function JudgementIcon({ icon }: { icon: 'up' | 'mixed' | 'down' }) {
  if (icon === 'up') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gx-success inline" aria-hidden="true">
        <path d="M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3H14z" />
        <path d="M7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3" />
      </svg>
    )
  }
  if (icon === 'down') {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gx-error inline" aria-hidden="true">
        <path d="M10 15v4a3 3 0 0 0 3 3l4-9V2H5.72a2 2 0 0 0-2 1.7l-1.38 9a2 2 0 0 0 2 2.3H10z" />
        <path d="M17 2h3a2 2 0 0 1 2 2v7a2 2 0 0 1-2 2h-3" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-gx-warning inline" aria-hidden="true">
      <circle cx="12" cy="12" r="10" />
      <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
  )
}

function displayName(name: string) {
  return name
    .replace(/\.mapped\.bam$/, '')
    .replace(/\.sorted\.bam$/, '')
    .replace(/\.bam$/, '')
}

export default function ReportPage() {
  const { samples } = useSamples()
  const { negativeControl } = useNegativeControl()
  const [coverageSample, setCoverageSample] = useState<Sample | null>(null)

  // NC amplicon cross-check: get amplicons detected in negative control (#4)
  const ncDetectedAmplicons = new Set(negativeControl.detectedAmplicons ?? [])

  const downloadConsensus = (fastaString: string, name: string) => {
    const blob = new Blob([fastaString.replaceAll(',', '\n')], {
      type: 'text/plain',
    })
    saveAs(blob, name + '.fasta')
  }

  const handleExport = (delimiter: ',' | '\t') => {
    const headers = ['Name', 'Ambiguous Bases', 'Longest N Run', 'QC Status', 'Judgement', 'Consensus Length', 'Best Mapped Reads', 'Properly Paired Reads', 'Total Reads', 'Missing Amplicons', 'NC Flagged Amplicons']
    const rows = samples.map((sample) => {
      const ncFlagged = sample.ampLabels
        ?.filter((label) => ncDetectedAmplicons.has(label))
        .join('; ') ?? ''
      return [
        displayName(sample.name),
        typeof sample.ambigiousBasesCount === 'number' ? String(sample.ambigiousBasesCount) : '',
        sample.longestNRun !== undefined ? String(sample.longestNRun) : '',
        getQcLabel(sample),
        getJudgement(sample).label,
        sample.consensusLength !== undefined ? String(sample.consensusLength) : '',
        sample.onefoureight ?? '',
        sample.properReads ?? '',
        sample.totalReads ?? '',
        sample.missingAmplicons?.join('; ') ?? '',
        ncFlagged,
      ]
    })
    exportTableAsCSV(headers, rows, 'sample_report', delimiter)
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

      {/* NC cross-check warning */}
      {ncDetectedAmplicons.size > 0 && (
        <div className="rounded-lg border border-gx-warning/30 bg-gx-warning/10 px-4 py-3 text-sm text-gx-text">
          <strong>Control warning:</strong> {ncDetectedAmplicons.size} amplicon{ncDetectedAmplicons.size > 1 ? 's' : ''} detected
          in the negative control ({[...ncDetectedAmplicons].join(', ')}). These are flagged in the table below.
        </div>
      )}

      {/* Sample metrics table */}
      <div className="card overflow-x-auto">
        <div className="flex items-center justify-end gap-2 px-4 pt-4">
          <button
            onClick={() => handleExport(',')}
            className="text-xs text-gx-accent hover:text-gx-accent-hover underline"
          >
            Export CSV
          </button>
          <span className="text-gx-text-muted text-xs">|</span>
          <button
            onClick={() => handleExport('\t')}
            className="text-xs text-gx-accent hover:text-gx-accent-hover underline"
          >
            Export TSV
          </button>
        </div>
        <table className="gx-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Ambiguous Bases</th>
              <th>Longest N Run</th>
              <th>QC Status</th>
              <th>Judgement</th>
              <th>Consensus Length</th>
              <th>Mapped Reads</th>
              <th>Missing Amplicons</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {samples.map((sample) => {
              const isProcessing = sample.comments !== undefined && sample.comments !== 'Done'
              const judgement = getJudgement(sample)
              // NC cross-check: find flagged amplicons for this sample (#4)
              const ncFlaggedAmplicons = sample.ampLabels?.filter(
                (label) => ncDetectedAmplicons.has(label)
              ) ?? []
              return (
                <tr key={sample.name}>
                  <td className="font-sans font-medium max-w-[200px] truncate" title={sample.name}>
                    {displayName(sample.name)}
                  </td>
                  <td>
                    {typeof sample.ambigiousBasesCount === 'number'
                      ? sample.ambigiousBasesCount
                      : isProcessing
                        ? '...'
                        : '\u2014'}
                  </td>
                  <td>
                    {sample.longestNRun !== undefined
                      ? sample.longestNRun
                      : isProcessing
                        ? '...'
                        : '\u2014'}
                  </td>
                  <td>
                    <StatusBadge
                      status={getQcStatus(sample) as 'pass' | 'warn' | 'fail' | 'unknown'}
                      label={getQcLabel(sample)}
                    />
                  </td>
                  <td>
                    <span className="inline-flex items-center gap-1.5" title={judgement.description}>
                      <JudgementIcon icon={judgement.icon} />
                      <span className="text-xs">{judgement.label}</span>
                    </span>
                  </td>
                  <td>
                    {sample.consensusLength !== undefined
                      ? sample.consensusLength.toLocaleString()
                      : isProcessing
                        ? '...'
                        : '\u2014'}
                  </td>
                  <td className="whitespace-nowrap">
                    {sample.onefoureight ?? '\u2014'} / {sample.properReads ?? '\u2014'} / {sample.totalReads ?? '\u2014'}
                  </td>
                  <td>
                    {sample.missingAmplicons !== undefined ? (
                      <div>
                        {sample.missingAmplicons.length > 0
                          ? sample.missingAmplicons.length
                          : 'All found'}
                        {ncFlaggedAmplicons.length > 0 && (
                          <span
                            className="ml-2 inline-flex items-center gap-1 rounded-full bg-gx-warning/20 px-2 py-0.5 text-[10px] font-medium text-gx-warning"
                            title={`NC amplicons detected: ${ncFlaggedAmplicons.join(', ')}`}
                          >
                            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
                              <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                              <line x1="12" y1="9" x2="12" y2="13" />
                              <line x1="12" y1="17" x2="12.01" y2="17" />
                            </svg>
                            {ncFlaggedAmplicons.length} NC
                          </span>
                        )}
                      </div>
                    ) : isProcessing
                      ? '...'
                      : '\u2014'}
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      {isProcessing ? (
                        <span className="inline-flex items-center gap-2 text-xs text-gx-text-muted">
                          <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                          {sample.comments}
                        </span>
                      ) : (
                        <>
                          {sample.consensusFasta && (
                            <button
                              onClick={() => downloadConsensus(sample.consensusFasta!, sample.name)}
                              className="text-xs text-gx-accent hover:text-gx-accent-hover underline"
                            >
                              Consensus
                            </button>
                          )}
                          {sample.coverage && sample.coverage.length > 0 && (
                            <button
                              onClick={() => setCoverageSample(sample)}
                              className="text-xs text-gx-accent hover:text-gx-accent-hover underline"
                            >
                              Coverage
                            </button>
                          )}
                        </>
                      )}
                    </div>
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
              name: displayName(s.name),
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

      {/* Per-sample coverage modal (#14) */}
      {coverageSample && coverageSample.coverage && (
        <SampleCoverageModal
          sampleName={coverageSample.name}
          coverage={coverageSample.coverage}
          onClose={() => setCoverageSample(null)}
        />
      )}
    </div>
  )
}
