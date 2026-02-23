// BAM files are BGZF-compressed, so the first bytes are gzip magic (0x1f, 0x8b)
const GZIP_MAGIC = [0x1f, 0x8b]
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024 // 2GB
const WARN_FILE_SIZE = 500 * 1024 * 1024 // 500MB

export interface ValidationResult {
  valid: boolean
  warning?: string
  error?: string
}

async function readFileHeader(file: File, bytes: number): Promise<Uint8Array> {
  const slice = file.slice(0, bytes)
  try {
    return new Uint8Array(await slice.arrayBuffer())
  } catch {
    return new Promise<Uint8Array>((resolve, reject) => {
      const reader = new FileReader()
      reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer))
      reader.onerror = () => reject(reader.error)
      reader.readAsArrayBuffer(slice)
    })
  }
}

export async function validateBAM(file: File): Promise<ValidationResult> {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      valid: false,
      error: `File "${file.name}" is too large (${(file.size / 1024 / 1024 / 1024).toFixed(1)}GB). Maximum supported size is 2GB.`,
    }
  }

  // Check file extension
  if (!file.name.toLowerCase().endsWith('.bam')) {
    return {
      valid: false,
      error: `File "${file.name}" does not have a .bam extension.`,
    }
  }

  // Check for BGZF/gzip magic bytes (BAM is BGZF-compressed)
  try {
    const header = await readFileHeader(file, 4)

    if (header.length < 2) {
      return {
        valid: false,
        error: `File "${file.name}" is empty or too small to be a valid BAM file.`,
      }
    }

    const isGzip = header[0] === GZIP_MAGIC[0] && header[1] === GZIP_MAGIC[1]

    if (!isGzip) {
      return {
        valid: false,
        error: `File "${file.name}" is not a valid BAM file (not BGZF-compressed).`,
      }
    }
  } catch {
    return {
      valid: false,
      error: `Could not read file "${file.name}".`,
    }
  }

  // File size warning
  if (file.size > WARN_FILE_SIZE) {
    return {
      valid: true,
      warning: `File "${file.name}" is ${(file.size / 1024 / 1024).toFixed(0)}MB. Processing may take several minutes.`,
    }
  }

  return { valid: true }
}
