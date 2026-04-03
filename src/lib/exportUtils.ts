import { saveAs } from 'file-saver'

export function exportTableAsCSV(
  headers: string[],
  rows: string[][],
  filename: string,
  delimiter: '\t' | ',' = ','
) {
  const ext = delimiter === '\t' ? 'tsv' : 'csv'
  const headerLine = headers.join(delimiter)
  const dataLines = rows.map((row) =>
    row.map((cell) => {
      // Escape cells that contain delimiter or quotes
      if (cell.includes(delimiter) || cell.includes('"') || cell.includes('\n')) {
        return `"${cell.replace(/"/g, '""')}"`
      }
      return cell
    }).join(delimiter)
  )
  const content = [headerLine, ...dataLines].join('\n')
  const blob = new Blob([content], { type: `text/${ext};charset=utf-8` })
  saveAs(blob, `${filename}.${ext}`)
}
