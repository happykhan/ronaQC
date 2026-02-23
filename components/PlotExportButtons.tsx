'use client'

import { useCallback } from 'react'
import { saveAs } from 'file-saver'
import { getSVGString, svgString2Image } from '@/lib/exportPlot'

interface PlotExportButtonsProps {
  svgRef: React.RefObject<SVGSVGElement | null>
  filename?: string
}

export default function PlotExportButtons({ svgRef, filename = 'plot' }: PlotExportButtonsProps) {
  const exportPNG = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return
    const svgString = getSVGString(svg)
    const { width, height } = svg.getBoundingClientRect()
    svgString2Image(svgString, width * 2, height * 2, (blob) => {
      saveAs(blob, `${filename}.png`)
    })
  }, [svgRef, filename])

  const exportSVG = useCallback(() => {
    const svg = svgRef.current
    if (!svg) return
    const svgString = getSVGString(svg)
    const blob = new Blob([svgString], { type: 'image/svg+xml' })
    saveAs(blob, `${filename}.svg`)
  }, [svgRef, filename])

  return (
    <div className="flex gap-2">
      <button onClick={exportPNG} className="btn-secondary text-xs" aria-label="Export as PNG">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        PNG
      </button>
      <button onClick={exportSVG} className="btn-secondary text-xs" aria-label="Export as SVG">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
          <polyline points="7,10 12,15 17,10" />
          <line x1="12" y1="15" x2="12" y2="3" />
        </svg>
        SVG
      </button>
    </div>
  )
}
