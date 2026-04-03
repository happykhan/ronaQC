import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock @biowasm/aioli
vi.mock('@biowasm/aioli', () => ({
  default: vi.fn().mockImplementation(() => ({
    mount: vi.fn().mockResolvedValue(['/data/test.bam']),
    exec: vi.fn().mockResolvedValue(''),
    cat: vi.fn().mockResolvedValue(''),
    fs: {
      writeFile: vi.fn().mockResolvedValue(undefined),
    },
  })),
}))

// Mock fetch for reference files
const mockFetch = vi.fn()
global.fetch = mockFetch

describe('pipeline', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockFetch.mockResolvedValue({
      text: () => Promise.resolve('>MN908947.3\nATGC'),
    })
  })

  it('processNegativeControl rejects non-BAM extension', async () => {
    const { processNegativeControl } = await import('../pipeline')
    // File with wrong extension
    const file = new File([new Uint8Array([0, 0, 0, 0])], 'test.txt')
    const onProgress = vi.fn()
    const dispatch = vi.fn()

    await expect(
      processNegativeControl(file, 'nCov-2019.v4.1.insert.bed', onProgress, dispatch)
    ).rejects.toThrow('does not have a .bam extension')
  })

  it('processSample rejects non-BAM extension', async () => {
    const { processSample } = await import('../pipeline')
    const file = new File([new Uint8Array([0, 0, 0, 0])], 'test.txt')
    const dispatch = vi.fn()

    await expect(
      processSample(file, 'nCov-2019.v4.1.insert.bed', true, dispatch)
    ).rejects.toThrow('does not have a .bam extension')
  })

  it('processSample dispatches initial status', async () => {
    const { processSample } = await import('../pipeline')
    const bamContent = new Uint8Array([0x1f, 0x8b, 0x08, 0x04, 0, 0, 0, 0])
    const file = new File([bamContent], 'sample.bam')
    const dispatch = vi.fn()

    mockFetch.mockResolvedValue({
      text: () => Promise.resolve(''),
    })

    try {
      await processSample(file, 'nCov-2019.v4.1.insert.bed', true, dispatch)
    } catch {
      // Expected - Aioli mock doesn't fully work
    }

    // Should have dispatched at least the initial EDIT_SAMPLE with 'Initializing...'
    expect(dispatch).toHaveBeenCalledWith(
      expect.objectContaining({
        type: 'EDIT_SAMPLE',
        name: 'sample.bam',
        updates: expect.objectContaining({ comments: 'Initializing...' }),
      })
    )
  })
})
