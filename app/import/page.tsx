'use client'

import { useState } from 'react'
import FileDropZone from '@/components/FileDropZone'
import ProcessingProgress from '@/components/ProcessingProgress'
import Alert from '@/components/Alert'
import { useNegativeControl, useSamples } from '@/lib/context'
import type { ArticVersion, ProcessingProgress as ProgressType } from '@/lib/types'

const articVersions: { value: ArticVersion; label: string }[] = [
  { value: 'nCov-2019.v5.4.2.insert.bed', label: 'ARTIC V5.4.2 (latest)' },
  { value: 'nCov-2019.v5.3.2.insert.bed', label: 'ARTIC V5.3.2' },
  { value: 'nCov-2019.v5.0.0.insert.bed', label: 'ARTIC V5.0' },
  { value: 'nCov-2019.v4.1.insert.bed', label: 'ARTIC V4.1' },
  { value: 'nCov-2019.v4.insert.bed', label: 'ARTIC V4' },
  { value: 'nCov-2019.v3.insert.bed', label: 'ARTIC V3' },
  { value: 'nCov-2019.v2.insert.bed', label: 'ARTIC V2' },
  { value: 'nCov-2019.v1.insert.bed', label: 'ARTIC V1' },
]

export default function ImportPage() {
  const { negativeControl, dispatch } = useNegativeControl()
  const { sampleDispatch } = useSamples()
  const [articV, setArticV] = useState<ArticVersion>('nCov-2019.v5.4.2.insert.bed')
  const [subsampling, setSubsampling] = useState(true)
  const [ncProcessing, setNcProcessing] = useState(false)
  const [sampleProcessing, setSampleProcessing] = useState(false)
  const [ncProgress, setNcProgress] = useState<ProgressType>({
    step: '',
    percent: 0,
    active: false,
  })
  const [sampleProgress, setSampleProgress] = useState<ProgressType>({
    step: '',
    percent: 0,
    active: false,
  })

  const handleControlFiles = async (files: File[]) => {
    const file = files[0]
    if (!file) return

    dispatch({ type: 'ADD_CONTROL', name: file.name, file })
    setNcProcessing(true)
    setNcProgress({ step: 'Initializing...', percent: 5, active: true })

    try {
      const { processNegativeControl } = await import('@/lib/pipeline')
      await processNegativeControl(file, articV, setNcProgress, dispatch)
      setNcProgress({ step: 'Complete', percent: 100, active: false })
    } catch (err) {
      const { default: toast } = await import('react-hot-toast')
      toast.error(`Error processing control: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setNcProgress({ step: 'Error', percent: 0, active: false })
    } finally {
      setNcProcessing(false)
    }
  }

  const handleSampleFiles = async (files: File[]) => {
    setSampleProcessing(true)
    setSampleProgress({ step: 'Initializing...', percent: 5, active: true })

    try {
      const { processSample } = await import('@/lib/pipeline')
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        sampleDispatch({ type: 'ADD_SAMPLE', name: file.name, file })

        const progress = Math.round(((i + 1) / files.length) * 90) + 5
        setSampleProgress({
          step: `Processing ${file.name} (${i + 1}/${files.length})`,
          percent: progress,
          active: true,
        })

        await processSample(file, articV, subsampling, sampleDispatch)
      }
      setSampleProgress({ step: 'Complete', percent: 100, active: false })
    } catch (err) {
      const { default: toast } = await import('react-hot-toast')
      toast.error(`Error processing samples: ${err instanceof Error ? err.message : 'Unknown error'}`)
      setSampleProgress({ step: 'Error', percent: 0, active: false })
    } finally {
      setSampleProcessing(false)
    }
  }

  const isProcessing = ncProcessing || sampleProcessing

  return (
    <div className="space-y-6">
      <h1 className="section-title">Import</h1>

      <Alert variant="info">
        <p>
          RonaQC accepts mapped SARS-CoV-2 reads (<strong>BAM format</strong>),
          generated from bioinformatics pipelines like ARTIC, and any control
          samples from the respective sequencing run (negative/positive) as input.
          It assesses cross-contamination, primer contamination, and determines if
          samples are reliable for phylogenetic analysis and public database submission.
        </p>
      </Alert>

      {/* Settings */}
      <div className="card p-6 space-y-4">
        <h2 className="text-lg font-semibold text-gx-text">Settings</h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="artic-version" className="label">
              ARTIC Primer Version
            </label>
            <select
              id="artic-version"
              value={articV}
              onChange={(e) => setArticV(e.target.value as ArticVersion)}
              className="input-field"
              disabled={isProcessing}
            >
              {articVersions.map((v) => (
                <option key={v.value} value={v.value}>
                  {v.label}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-end">
            <label className="inline-flex items-center gap-3 cursor-pointer">
              <span className="text-sm font-medium text-gx-text">Subsampling</span>
              <button
                type="button"
                role="switch"
                aria-checked={subsampling}
                onClick={() => setSubsampling(!subsampling)}
                disabled={isProcessing}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                  subsampling ? 'bg-gx-accent' : 'bg-gx-border'
                } ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
              >
                <span
                  className={`inline-block h-4 w-4 rounded-full bg-white transition-transform ${
                    subsampling ? 'translate-x-6' : 'translate-x-1'
                  }`}
                />
              </button>
              <span className="text-xs text-gx-text-muted">
                {subsampling ? 'On (30K reads)' : 'Off'}
              </span>
            </label>
          </div>
        </div>
      </div>

      {/* Upload zones */}
      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gx-text">Negative Control</h2>
          <FileDropZone
            accept=".bam"
            onFiles={handleControlFiles}
            label="Drop negative control BAM file here"
            hint="Or click to browse. Single BAM file."
            disabled={isProcessing}
          />
          {negativeControl.name && (
            <p className="text-sm text-gx-text-muted">
              Loaded: <span className="font-mono">{negativeControl.name}</span>
            </p>
          )}
          <ProcessingProgress progress={ncProgress} />
        </div>

        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-gx-text">Sample Data</h2>
          <FileDropZone
            accept=".bam"
            multiple
            onFiles={handleSampleFiles}
            label="Drop sample BAM files here"
            hint="Or click to browse. Multiple files supported."
            disabled={isProcessing}
          />
          <ProcessingProgress progress={sampleProgress} />
        </div>
      </div>

      {/* Sample data download */}
      <div className="card p-6">
        <p className="text-sm text-gx-text-muted mb-3">
          Don&apos;t have any data? Download sample data with sequenced controls:
        </p>
        <a
          href="/ronaqc_small_test.zip"
          download="ronaqc_small_test.zip"
          className="btn-secondary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7,10 12,15 17,10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Download Sample Data
        </a>
      </div>
    </div>
  )
}
