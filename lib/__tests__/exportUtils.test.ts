import { describe, it, expect, vi, beforeEach } from 'vitest'

// Mock file-saver
vi.mock('file-saver', () => ({
  saveAs: vi.fn(),
}))

import { exportTableAsCSV } from '../exportUtils'
import { saveAs } from 'file-saver'

describe('exportTableAsCSV', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('exports CSV with correct headers and data', () => {
    const headers = ['Name', 'Value', 'Status']
    const rows = [
      ['SNPs', '0', 'pass'],
      ['Coverage', '500', 'warn'],
    ]

    exportTableAsCSV(headers, rows, 'test_report', ',')

    expect(saveAs).toHaveBeenCalledTimes(1)
    const blob = (saveAs as ReturnType<typeof vi.fn>).mock.calls[0][0] as Blob
    const filename = (saveAs as ReturnType<typeof vi.fn>).mock.calls[0][1]

    expect(filename).toBe('test_report.csv')
    expect(blob.type).toBe('text/csv;charset=utf-8')
  })

  it('exports TSV with tab delimiter', () => {
    const headers = ['Name', 'Value']
    const rows = [['test', '42']]

    exportTableAsCSV(headers, rows, 'output', '\t')

    const filename = (saveAs as ReturnType<typeof vi.fn>).mock.calls[0][1]
    expect(filename).toBe('output.tsv')
  })

  it('escapes cells containing commas in CSV', () => {
    const headers = ['Name', 'Value']
    const rows = [['has,comma', 'normal']]

    exportTableAsCSV(headers, rows, 'test', ',')

    expect(saveAs).toHaveBeenCalledTimes(1)
    const blob = (saveAs as ReturnType<typeof vi.fn>).mock.calls[0][0] as Blob
    expect(blob.type).toBe('text/csv;charset=utf-8')
  })

  it('escapes cells containing quotes', () => {
    const headers = ['Name']
    const rows = [['has"quote']]

    exportTableAsCSV(headers, rows, 'test', ',')

    expect(saveAs).toHaveBeenCalledTimes(1)
  })

  it('handles empty rows', () => {
    const headers = ['Name', 'Value']
    const rows: string[][] = []

    exportTableAsCSV(headers, rows, 'empty', ',')

    expect(saveAs).toHaveBeenCalledTimes(1)
  })
})
