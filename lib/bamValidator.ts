const BAM_MAGIC = new Uint8Array([0x42, 0x41, 0x4d, 0x01]) // "BAM\1"
const MAX_FILE_SIZE = 2 * 1024 * 1024 * 1024 // 2GB
const WARN_FILE_SIZE = 500 * 1024 * 1024 // 500MB

export interface ValidationResult {
  valid: boolean
  warning?: string
  error?: string
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

  // Check BAM magic bytes
  try {
    const slice = file.slice(0, 4)
    let header: Uint8Array

    if (typeof slice.arrayBuffer === 'function') {
      try {
        header = new Uint8Array(await slice.arrayBuffer())
      } catch {
        // Fallback: use FileReader for environments where arrayBuffer() fails
        header = await new Promise<Uint8Array>((resolve, reject) => {
          const reader = new FileReader()
          reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer))
          reader.onerror = () => reject(reader.error)
          reader.readAsArrayBuffer(slice)
        })
      }
    } else {
      header = await new Promise<Uint8Array>((resolve, reject) => {
        const reader = new FileReader()
        reader.onload = () => resolve(new Uint8Array(reader.result as ArrayBuffer))
        reader.onerror = () => reject(reader.error)
        reader.readAsArrayBuffer(slice)
      })
    }

    const isBAM = header.length >= 4 &&
      header[0] === BAM_MAGIC[0] &&
      header[1] === BAM_MAGIC[1] &&
      header[2] === BAM_MAGIC[2] &&
      header[3] === BAM_MAGIC[3]

    if (!isBAM) {
      return {
        valid: false,
        error: `File "${file.name}" is not a valid BAM file (invalid magic bytes).`,
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
