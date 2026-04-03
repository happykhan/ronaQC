export interface NegativeControl {
  name?: string
  file?: File
  coverage?: number[]
  genomeRecovery?: number
  snpCount?: number | string
  amplicons?: number[]
  ampLabels?: string[]
  detectedAmplicons?: string[]
  properReads?: string
  onefoureight?: string
  totalReads?: string
  comments?: string
}

export interface Sample {
  name: string
  file: File
  amplicons?: number[]
  ampLabels?: string[]
  missingAmplicons?: string[]
  coverage?: number[]
  properReads?: string
  onefoureight?: string
  totalReads?: string
  consensusLength?: number
  ambigiousBasesCount?: number
  longestNRun?: number
  consensusFasta?: string
  highQCpass?: string
  baseQCpass?: string
  comments?: string
}

export interface ProcessingProgress {
  step: string
  percent: number
  active: boolean
}

export type ArticVersion =
  | 'nCov-2019.v5.4.2.insert.bed'
  | 'nCov-2019.v5.3.2.insert.bed'
  | 'nCov-2019.v5.0.0.insert.bed'
  | 'nCov-2019.v4.1.insert.bed'
  | 'nCov-2019.v4.insert.bed'
  | 'nCov-2019.v3.insert.bed'
  | 'nCov-2019.v2.insert.bed'
  | 'nCov-2019.v1.insert.bed'

// Negative control reducer actions
export type NegativeControlAction =
  | { type: 'ADD_CONTROL'; name: string; file: File }
  | { type: 'REMOVE_CONTROL' }
  | { type: 'ADD_COVERAGE'; coverage: number[] }
  | { type: 'ADD_GEN_RECOVERY'; genomeRecovery: number }
  | { type: 'ADD_SNP_COUNT'; snpCount: number | string }
  | {
      type: 'ADD_AMPLICONS'
      amplicons: number[]
      ampLabels: string[]
      detectedAmplicons: string[]
    }
  | { type: 'ADD_PROPER_MAPPED_READS'; properReads: string }
  | { type: 'ADD_MAPPED_READS'; onefoureight: string }
  | { type: 'ADD_TOTAL_READS'; totalReads: string }
  | { type: 'FINISH_NC'; comments: string }

// Sample reducer actions
export type SampleAction =
  | { type: 'ADD_SAMPLE'; name: string; file: File }
  | { type: 'REMOVE_SAMPLE'; name: string }
  | { type: 'EDIT_SAMPLE'; name: string; updates: Partial<Sample> }
