import { describe, it, expect } from 'vitest'
import { validateBAM } from '../bamValidator'

function createFile(name: string, content: Uint8Array, size?: number): File {
  const blob = new Blob([content])
  const file = new File([blob], name)
  if (size !== undefined) {
    Object.defineProperty(file, 'size', { value: size })
  }
  return file
}

describe('validateBAM', () => {
  it('accepts a valid BAM file', async () => {
    // BAM magic bytes: "BAM\1"
    const content = new Uint8Array([0x42, 0x41, 0x4d, 0x01, 0, 0, 0, 0])
    const file = createFile('test.bam', content)
    const result = await validateBAM(file)
    expect(result.valid).toBe(true)
    expect(result.error).toBeUndefined()
  })

  it('rejects a file without .bam extension', async () => {
    const content = new Uint8Array([0x42, 0x41, 0x4d, 0x01])
    const file = createFile('test.sam', content)
    const result = await validateBAM(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('does not have a .bam extension')
  })

  it('rejects a file with invalid magic bytes', async () => {
    const content = new Uint8Array([0x00, 0x00, 0x00, 0x00])
    const file = createFile('test.bam', content)
    const result = await validateBAM(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('not a valid BAM file')
  })

  it('rejects files over 2GB', async () => {
    const content = new Uint8Array([0x42, 0x41, 0x4d, 0x01])
    const file = createFile('test.bam', content, 3 * 1024 * 1024 * 1024) // 3GB
    const result = await validateBAM(file)
    expect(result.valid).toBe(false)
    expect(result.error).toContain('too large')
  })

  it('warns for files over 500MB', async () => {
    const content = new Uint8Array([0x42, 0x41, 0x4d, 0x01])
    const file = createFile('test.bam', content, 600 * 1024 * 1024) // 600MB
    const result = await validateBAM(file)
    expect(result.valid).toBe(true)
    expect(result.warning).toContain('may take several minutes')
  })

  it('handles empty files', async () => {
    const content = new Uint8Array([])
    const file = createFile('test.bam', content)
    const result = await validateBAM(file)
    expect(result.valid).toBe(false)
  })
})
