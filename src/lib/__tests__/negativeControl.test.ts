import { describe, it, expect, vi, beforeEach } from 'vitest'
import { covDepth, snpMethod, mappedReads, amplicons } from '../negativeControl'

// Mock fetch for reference files and BED files
const mockFetch = vi.fn()
global.fetch = mockFetch

function createMockCLI(overrides: Record<string, unknown> = {}) {
  return {
    exec: vi.fn().mockResolvedValue(''),
    cat: vi.fn().mockResolvedValue(''),
    fs: {
      writeFile: vi.fn().mockResolvedValue(undefined),
    },
    ...overrides,
  }
}

describe('covDepth', () => {
  it('parses samtools depth output and calculates coverage', async () => {
    const depthOutput = Array.from({ length: 100 }, (_, i) =>
      `MN908947.3\t${i + 1}\t${i < 50 ? 15 : 5}`
    ).join('\n')

    const CLI = createMockCLI({
      exec: vi.fn().mockResolvedValue(depthOutput),
    })

    const result = await covDepth('/data/test.bam', 'test.bam', CLI)

    expect(result.coverage).toHaveLength(100)
    expect(result.coverage[0]).toBe(15)
    expect(result.coverage[50]).toBe(5)
    // 50 positions with coverage >= 10
    expect(result.genomeRecovery).toBe(50)
  })

  it('handles empty depth output', async () => {
    const CLI = createMockCLI({
      exec: vi.fn().mockResolvedValue(''),
    })

    const result = await covDepth('/data/test.bam', 'test.bam', CLI)
    expect(result.coverage).toHaveLength(1) // one empty split
    expect(result.genomeRecovery).toBe(0)
  })

  it('throws on CLI error', async () => {
    const CLI = createMockCLI({
      exec: vi.fn().mockRejectedValue(new Error('samtools failed')),
    })

    await expect(covDepth('/data/test.bam', 'test.bam', CLI)).rejects.toThrow('Coverage depth analysis failed')
  })
})

describe('snpMethod', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      text: () => Promise.resolve('>MN908947.3\nATGC'),
    })
  })

  it('returns 0 when no SNPs found', async () => {
    const CLI = createMockCLI({
      cat: vi.fn().mockResolvedValue('REGION\tPOS\tREF\tALT\tREF_DP\tALT_DP\tALT_FREQ\tPASS\n'),
    })

    const result = await snpMethod('/data/test.bam', 'test.bam', CLI)
    expect(result).toBe(0)
  })

  it('counts qualifying SNPs', async () => {
    // TSV header + data rows (14 columns, col[9]>=20, col[10]>=0.75, col[13]=TRUE, col[11]>=10)
    const header = 'REGION\tPOS\tREF\tALT\tREF_DP\tREF_RV\tREF_QUAL\tALT_DP\tALT_RV\tALT_QUAL\tALT_FREQ\tTOTAL_DP\tPVALUE\tPASS'
    const snpLine = 'MN908947.3\t100\tA\tT\t5\t2\t30\t50\t25\t25\t0.9\t55\t0.001\tTRUE'
    const failLine = 'MN908947.3\t200\tC\tG\t5\t2\t30\t50\t25\t10\t0.3\t55\t0.5\tFALSE'

    const CLI = createMockCLI({
      cat: vi.fn().mockResolvedValue(`${header}\n${snpLine}\n${failLine}`),
    })

    const result = await snpMethod('/data/test.bam', 'test.bam', CLI)
    expect(result).toBe(1)
  })

  it('throws on CLI error', async () => {
    const CLI = createMockCLI({
      exec: vi.fn().mockRejectedValue(new Error('mpileup failed')),
    })

    await expect(snpMethod('/data/test.bam', 'test.bam', CLI)).rejects.toThrow('SNP analysis failed')
  })
})

describe('mappedReads', () => {
  it('parses flagstat output', async () => {
    const flagstat = [
      '1000 + 0 in total',
      '0 + 0 secondary',
      '0 + 0 supplementary',
      '0 + 0 duplicates',
      '900 + 0 mapped',
      '1000 + 0 paired',
      '500 + 0 read1',
      '500 + 0 read2',
      '800 + 0 properly paired',
      '850 + 0 with itself and mate mapped',
    ].join('\n')

    const CLI = createMockCLI({
      exec: vi.fn()
        .mockResolvedValueOnce(flagstat)   // samtools flagstat
        .mockResolvedValueOnce('750\n'),   // samtools view -c
    })

    const [proper, onefoureight, total] = await mappedReads('/data/test.bam', 'test.bam', CLI)

    expect(total).toBe('1000')
    expect(proper).toBe('800')
    expect(onefoureight).toBe('750')
  })

  it('throws on CLI error', async () => {
    const CLI = createMockCLI({
      exec: vi.fn().mockRejectedValue(new Error('flagstat failed')),
    })

    await expect(mappedReads('/data/test.bam', 'test.bam', CLI)).rejects.toThrow('Mapped reads analysis failed')
  })
})

describe('amplicons', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('calculates amplicon coverage from depth and BED', async () => {
    // Simulate depth output: 200 positions, all with coverage 15
    const depthOutput = Array.from({ length: 200 }, (_, i) =>
      `MN908947.3\t${i + 1}\t15`
    ).join('\n')

    // BED file with 2 amplicons
    const bedContent = [
      'MN908947.3\t10\t100\tamp_1\t1\t+',
      'MN908947.3\t80\t180\tamp_2\t2\t+',
    ].join('\n')

    mockFetch.mockResolvedValue({
      text: () => Promise.resolve(bedContent),
    })

    const CLI = createMockCLI({
      exec: vi.fn().mockResolvedValue(depthOutput),
    })

    const [ampList, ampNames, rawCoverage] = await amplicons('/data/test.bam', 'test.bam', CLI, 'nCov-2019.v3.insert.bed')

    expect(ampList).toHaveLength(2)
    expect(ampNames).toEqual(['amp_1', 'amp_2'])
    // All positions have coverage > 9, so amplicon coverage should be 1.0
    expect(ampList[0]).toBe(1)
    expect(ampList[1]).toBe(1)
    // Raw coverage should be returned
    expect(rawCoverage).toHaveLength(200)
    expect(rawCoverage[0]).toBe(15)
  })

  it('returns partial coverage when some positions are below threshold', async () => {
    // 100 positions, first 50 have coverage 15, rest have 5
    const depthOutput = Array.from({ length: 100 }, (_, i) =>
      `MN908947.3\t${i + 1}\t${i < 50 ? 15 : 5}`
    ).join('\n')

    const bedContent = 'MN908947.3\t0\t100\tamp_1\t1\t+'
    mockFetch.mockResolvedValue({
      text: () => Promise.resolve(bedContent),
    })

    const CLI = createMockCLI({
      exec: vi.fn().mockResolvedValue(depthOutput),
    })

    const [ampList] = await amplicons('/data/test.bam', 'test.bam', CLI, 'v3')
    expect(ampList[0]).toBe(0.5) // 50 out of 100 positions above threshold
  })

  it('throws on CLI error', async () => {
    mockFetch.mockResolvedValue({
      text: () => Promise.resolve(''),
    })

    const CLI = createMockCLI({
      exec: vi.fn().mockRejectedValue(new Error('depth failed')),
    })

    await expect(amplicons('/data/test.bam', 'test.bam', CLI, 'v3')).rejects.toThrow('Amplicon analysis failed')
  })
})
