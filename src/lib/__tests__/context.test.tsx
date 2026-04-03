import { describe, it, expect } from 'vitest'
import { negativeControlReducer, sampleReducer } from '../context'
import type { NegativeControl, NegativeControlAction, Sample, SampleAction } from '../types'

describe('negativeControlReducer', () => {
  const emptyState: NegativeControl = {}

  it('handles ADD_CONTROL', () => {
    const file = new File([''], 'test.bam')
    const action: NegativeControlAction = { type: 'ADD_CONTROL', name: 'test.bam', file }
    const result = negativeControlReducer(emptyState, action)
    expect(result.name).toBe('test.bam')
    expect(result.file).toBe(file)
  })

  it('handles REMOVE_CONTROL', () => {
    const state: NegativeControl = { name: 'test.bam' }
    const action: NegativeControlAction = { type: 'REMOVE_CONTROL' }
    const result = negativeControlReducer(state, action)
    expect(result).toEqual({})
  })

  it('handles ADD_COVERAGE', () => {
    const state: NegativeControl = { name: 'test.bam' }
    const action: NegativeControlAction = { type: 'ADD_COVERAGE', coverage: [1, 2, 3] }
    const result = negativeControlReducer(state, action)
    expect(result.coverage).toEqual([1, 2, 3])
    expect(result.name).toBe('test.bam')
  })

  it('handles ADD_GEN_RECOVERY', () => {
    const action: NegativeControlAction = { type: 'ADD_GEN_RECOVERY', genomeRecovery: 500 }
    const result = negativeControlReducer(emptyState, action)
    expect(result.genomeRecovery).toBe(500)
  })

  it('handles ADD_SNP_COUNT', () => {
    const action: NegativeControlAction = { type: 'ADD_SNP_COUNT', snpCount: 3 }
    const result = negativeControlReducer(emptyState, action)
    expect(result.snpCount).toBe(3)
  })

  it('handles ADD_AMPLICONS', () => {
    const action: NegativeControlAction = {
      type: 'ADD_AMPLICONS',
      amplicons: [0.5, 0.3],
      ampLabels: ['amp1', 'amp2'],
      detectedAmplicons: ['amp1'],
    }
    const result = negativeControlReducer(emptyState, action)
    expect(result.amplicons).toEqual([0.5, 0.3])
    expect(result.ampLabels).toEqual(['amp1', 'amp2'])
    expect(result.detectedAmplicons).toEqual(['amp1'])
  })

  it('handles ADD_PROPER_MAPPED_READS', () => {
    const action: NegativeControlAction = { type: 'ADD_PROPER_MAPPED_READS', properReads: '1000' }
    const result = negativeControlReducer(emptyState, action)
    expect(result.properReads).toBe('1000')
  })

  it('handles ADD_MAPPED_READS', () => {
    const action: NegativeControlAction = { type: 'ADD_MAPPED_READS', onefoureight: '500' }
    const result = negativeControlReducer(emptyState, action)
    expect(result.onefoureight).toBe('500')
  })

  it('handles ADD_TOTAL_READS', () => {
    const action: NegativeControlAction = { type: 'ADD_TOTAL_READS', totalReads: '5000' }
    const result = negativeControlReducer(emptyState, action)
    expect(result.totalReads).toBe('5000')
  })

  it('handles FINISH_NC', () => {
    const action: NegativeControlAction = { type: 'FINISH_NC', comments: 'Done' }
    const result = negativeControlReducer(emptyState, action)
    expect(result.comments).toBe('Done')
  })
})

describe('sampleReducer', () => {
  const emptyState: Sample[] = []

  it('handles ADD_SAMPLE', () => {
    const file = new File([''], 'sample.bam')
    const action: SampleAction = { type: 'ADD_SAMPLE', name: 'sample.bam', file }
    const result = sampleReducer(emptyState, action)
    expect(result).toHaveLength(1)
    expect(result[0].name).toBe('sample.bam')
  })

  it('does not add duplicate samples', () => {
    const file = new File([''], 'sample.bam')
    const state: Sample[] = [{ name: 'sample.bam', file }]
    const action: SampleAction = { type: 'ADD_SAMPLE', name: 'sample.bam', file }
    const result = sampleReducer(state, action)
    expect(result).toHaveLength(1)
  })

  it('handles REMOVE_SAMPLE', () => {
    const file = new File([''], 'sample.bam')
    const state: Sample[] = [{ name: 'sample.bam', file }]
    const action: SampleAction = { type: 'REMOVE_SAMPLE', name: 'sample.bam' }
    const result = sampleReducer(state, action)
    expect(result).toHaveLength(0)
  })

  it('handles EDIT_SAMPLE', () => {
    const file = new File([''], 'sample.bam')
    const state: Sample[] = [{ name: 'sample.bam', file }]
    const action: SampleAction = {
      type: 'EDIT_SAMPLE',
      name: 'sample.bam',
      updates: { consensusLength: 29000, comments: 'Done' },
    }
    const result = sampleReducer(state, action)
    expect(result[0].consensusLength).toBe(29000)
    expect(result[0].comments).toBe('Done')
  })

  it('does not modify other samples on EDIT_SAMPLE', () => {
    const file1 = new File([''], 'a.bam')
    const file2 = new File([''], 'b.bam')
    const state: Sample[] = [
      { name: 'a.bam', file: file1 },
      { name: 'b.bam', file: file2 },
    ]
    const action: SampleAction = {
      type: 'EDIT_SAMPLE',
      name: 'a.bam',
      updates: { comments: 'Updated' },
    }
    const result = sampleReducer(state, action)
    expect(result[0].comments).toBe('Updated')
    expect(result[1].comments).toBeUndefined()
  })
})
