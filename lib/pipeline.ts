import type { ProcessingProgress, ArticVersion, NegativeControlAction, SampleAction } from './types'
import type { Dispatch } from 'react'
import { validateBAM } from './bamValidator'
import { covDepth, snpMethod, mappedReads, amplicons } from './negativeControl'
import { sampleConsensus, sampleConsensusMetrics, sampleMappedReads } from './sampleUtil'
import { amplicons as sampleAmplicons } from './negativeControl'

// Dynamically import Aioli to avoid SSR issues
async function createCLI() {
  const Aioli = (await import('@biowasm/aioli')).default
  return new Aioli(['samtools/1.10', 'ivar/1.3.1'])
}

export async function processNegativeControl(
  file: File,
  articVersion: ArticVersion,
  onProgress: (p: ProcessingProgress) => void,
  dispatch: Dispatch<NegativeControlAction>
): Promise<void> {
  // Validate BAM
  const validation = await validateBAM(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  onProgress({ step: 'Initializing bioinformatics tools...', percent: 10, active: true })

  const CLI = await createCLI()
  const mountedFiles = await CLI.mount([file])
  const mountedPath = mountedFiles[0]

  // Run all analyses in parallel
  onProgress({ step: 'Analyzing coverage, SNPs, reads, and amplicons...', percent: 20, active: true })

  const [covResult, snpResult, readsResult, ampResult] = await Promise.all([
    covDepth(mountedPath, file.name, CLI).then((result) => {
      dispatch({ type: 'ADD_COVERAGE', coverage: result.coverage })
      dispatch({ type: 'ADD_GEN_RECOVERY', genomeRecovery: result.genomeRecovery })
      onProgress({ step: 'Coverage analysis complete', percent: 40, active: true })
      return result
    }),
    snpMethod(mountedPath, file.name, CLI).then((result) => {
      const snpCount = result || 0
      dispatch({ type: 'ADD_SNP_COUNT', snpCount })
      onProgress({ step: 'SNP analysis complete', percent: 55, active: true })
      return result
    }),
    mappedReads(mountedPath, file.name, CLI).then(([properReads, onefoureight, totalReads]) => {
      dispatch({ type: 'ADD_PROPER_MAPPED_READS', properReads })
      dispatch({ type: 'ADD_MAPPED_READS', onefoureight })
      dispatch({ type: 'ADD_TOTAL_READS', totalReads })
      onProgress({ step: 'Read mapping analysis complete', percent: 70, active: true })
      return [properReads, onefoureight, totalReads]
    }),
    amplicons(mountedPath, file.name, CLI, articVersion).then(([ampList, ampListName]) => {
      const detectedAmplicons = ampList
        .map((coverage, index) => ({ coverage, name: ampListName[index] }))
        .filter((a) => a.coverage >= 0.4)
        .map((a) => a.name)
      dispatch({ type: 'ADD_AMPLICONS', amplicons: ampList, ampLabels: ampListName, detectedAmplicons })
      onProgress({ step: 'Amplicon analysis complete', percent: 85, active: true })
      return [ampList, ampListName]
    }),
  ])

  // Suppress unused variable warnings
  void covResult
  void snpResult
  void readsResult
  void ampResult

  dispatch({ type: 'FINISH_NC', comments: 'Done' })
  onProgress({ step: 'Complete', percent: 100, active: false })
}

export async function processSample(
  file: File,
  articVersion: ArticVersion,
  subsample: boolean,
  dispatch: Dispatch<SampleAction>
): Promise<void> {
  // Validate BAM
  const validation = await validateBAM(file)
  if (!validation.valid) {
    throw new Error(validation.error)
  }

  dispatch({
    type: 'EDIT_SAMPLE',
    name: file.name,
    updates: { comments: 'Initializing...' },
  })

  const CLI = await createCLI()
  const mountedFiles = await CLI.mount([file])
  const mountedPath = mountedFiles[0]

  // Step 1: Amplicon analysis (must complete first for proper ordering)
  dispatch({
    type: 'EDIT_SAMPLE',
    name: file.name,
    updates: { comments: 'Calculating amplicons' },
  })

  const [ampList, ampListName] = await sampleAmplicons(mountedPath, file.name, CLI, articVersion)
  const missingAmplicons = ampList
    .map((coverage, index) => ({ coverage, name: ampListName[index] }))
    .filter((a) => a.coverage < 0.4)
    .map((a) => a.name)

  dispatch({
    type: 'EDIT_SAMPLE',
    name: file.name,
    updates: { amplicons: ampList, missingAmplicons, ampLabels: ampListName },
  })

  // Step 2: Mapped reads (needed for subsampling ratio)
  dispatch({
    type: 'EDIT_SAMPLE',
    name: file.name,
    updates: { comments: 'Calculating mapped reads' },
  })

  const [properReads, onefoureight, totalReads] = await sampleMappedReads(mountedPath, file.name, CLI)
  dispatch({
    type: 'EDIT_SAMPLE',
    name: file.name,
    updates: { properReads, onefoureight, totalReads },
  })

  // Step 3: Consensus generation (with optional subsampling)
  // FIX: Original code had variable-before-declaration bug. Correct order:
  // mount → amplicons → mappedReads → calculate subsample ratio → consensus
  dispatch({
    type: 'EDIT_SAMPLE',
    name: file.name,
    updates: { comments: 'Generating consensus' },
  })

  let subsampleRatio: number | undefined
  if (subsample) {
    const mappedCount = parseInt(onefoureight, 10) || 0
    if (mappedCount > 0) {
      subsampleRatio = 30000 / mappedCount
      if (subsampleRatio >= 1) {
        subsampleRatio = undefined // No subsampling needed
      }
    }
  }

  const fastaOut = await sampleConsensus(mountedPath, file.name, CLI, subsampleRatio)

  if (fastaOut.length > 200) {
    const [consensusLength, ambigiousBasesCount, longestNRun, fastaString, highQCpass, baseQCpass] =
      sampleConsensusMetrics(fastaOut, file.name)

    dispatch({
      type: 'EDIT_SAMPLE',
      name: file.name,
      updates: {
        consensusLength,
        ambigiousBasesCount,
        longestNRun,
        consensusFasta: fastaString,
        highQCpass: highQCpass ? 'True' : 'False',
        baseQCpass: baseQCpass ? 'True' : 'False',
        comments: 'Done',
      },
    })
  } else {
    dispatch({
      type: 'EDIT_SAMPLE',
      name: file.name,
      updates: { comments: 'Error: Could not generate consensus' },
    })
  }
}
