import { describe, it, expect } from 'vitest'
import { sampleConsensusMetrics } from '../sampleUtil'

describe('sampleConsensusMetrics', () => {
  it('calculates correct consensus length', () => {
    const fasta = '>test\nATGCATGCATGC'
    const [consensusLength] = sampleConsensusMetrics(fasta, 'test')
    expect(consensusLength).toBe(12)
  })

  it('detects N runs', () => {
    const fasta = '>test\nATGCNNNNNATGC'
    const [, , longestNRun] = sampleConsensusMetrics(fasta, 'test')
    expect(longestNRun).toBe(5)
  })

  it('handles no N runs', () => {
    const fasta = '>test\nATGCATGC'
    const [, , longestNRun] = sampleConsensusMetrics(fasta, 'test')
    expect(longestNRun).toBe(0)
  })

  it('counts ambiguous bases', () => {
    const fasta = '>test\nATGCRYSWKM'
    const [, ambigiousBasesCount] = sampleConsensusMetrics(fasta, 'test')
    expect(ambigiousBasesCount).toBe(6) // R, Y, S, W, K, M
  })

  it('calculates high QC pass correctly', () => {
    // Need >90% of 29903 = 26913 bases
    const bases = 'A'.repeat(27000)
    const fasta = `>test\n${bases}`
    const [, , , , highQCpass] = sampleConsensusMetrics(fasta, 'test')
    expect(highQCpass).toBe(true)
  })

  it('calculates high QC fail correctly', () => {
    const bases = 'A'.repeat(100)
    const fasta = `>test\n${bases}`
    const [, , , , highQCpass] = sampleConsensusMetrics(fasta, 'test')
    expect(highQCpass).toBe(false)
  })

  it('calculates base QC pass correctly', () => {
    // Need >50% of 29903 = 14952 bases
    const bases = 'A'.repeat(15000)
    const fasta = `>test\n${bases}`
    const [, , , , , baseQCpass] = sampleConsensusMetrics(fasta, 'test')
    expect(baseQCpass).toBe(true)
  })

  it('calculates base QC fail correctly', () => {
    const bases = 'A'.repeat(100)
    const fasta = `>test\n${bases}`
    const [, , , , , baseQCpass] = sampleConsensusMetrics(fasta, 'test')
    expect(baseQCpass).toBe(false)
  })

  it('generates valid FASTA string', () => {
    const bases = 'ATGC'.repeat(25) // 100 bases
    const fasta = `>test\n${bases}`
    const [, , , fastaString] = sampleConsensusMetrics(fasta, 'sample1')
    expect(fastaString).toMatch(/^>sample1\n/)
    // Should wrap at 80 chars per line
    const lines = fastaString.split('\n')
    expect(lines[0]).toBe('>sample1')
    expect(lines[1].length).toBe(80)
    expect(lines[2].length).toBe(20)
  })

  it('handles multiline FASTA input', () => {
    const fasta = '>test\nATGC\nATGC\nATGC'
    const [consensusLength] = sampleConsensusMetrics(fasta, 'test')
    expect(consensusLength).toBe(12)
  })

  it('handles empty consensus', () => {
    const fasta = '>test\nNNNNN'
    const [consensusLength] = sampleConsensusMetrics(fasta, 'test')
    expect(consensusLength).toBe(0)
  })

  it('handles mixed N and real bases for longest N run', () => {
    const fasta = '>test\nATGCNNATGCNNNNNATGCNNATGC'
    const [, , longestNRun] = sampleConsensusMetrics(fasta, 'test')
    expect(longestNRun).toBe(5)
  })
})
