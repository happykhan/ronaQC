'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import PlotExportButtons from './PlotExportButtons'
import { GX_COLORS } from '@/lib/colorScales'

interface CoveragePlotProps {
  coverage: number[]
  chunkSize?: number
}

function getCovAve(coverage: number[], perChunk: number) {
  const result: number[][] = []
  for (let i = 0; i < coverage.length; i++) {
    const chunkIndex = Math.floor(i / perChunk)
    if (!result[chunkIndex]) result[chunkIndex] = []
    result[chunkIndex].push(coverage[i])
  }

  return result.map((chunk, index) => ({
    position: perChunk * index,
    depth: chunk.reduce((sum, v) => sum + v, 0) / chunk.length,
  }))
}

export default function CoveragePlot({ coverage, chunkSize = 500 }: CoveragePlotProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isDark = useCallback(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark'
  }, [])

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || coverage.length === 0) return

    const containerWidth = containerRef.current.clientWidth
    const width = Math.max(containerWidth, 400)
    const height = 350
    const margin = { top: 20, right: 30, bottom: 60, left: 60 }

    const covAve = getCovAve(coverage, chunkSize)
    const maxPosition = d3.max(covAve, (d) => d.position) ?? 0
    const maxDepth = d3.max(covAve, (d) => d.depth) ?? 0

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const dark = isDark()
    const textColor = dark ? GX_COLORS.textMutedDark : GX_COLORS.textMuted
    const accentColor = dark ? GX_COLORS.accentDark : GX_COLORS.accent
    const errorColor = dark ? GX_COLORS.errorDark : GX_COLORS.error

    const plotWidth = width - margin.left - margin.right
    const plotHeight = height - margin.top - margin.bottom

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const xScale = d3.scaleLinear().domain([0, maxPosition]).range([0, plotWidth]).nice()
    const yScale = d3.scaleLinear().domain([0, maxDepth]).range([plotHeight, 0]).nice()

    // Bars
    g.selectAll('rect.bar')
      .data(covAve)
      .join('rect')
      .attr('class', 'bar')
      .attr('x', (d) => xScale(d.position))
      .attr('y', (d) => yScale(d.depth))
      .attr('width', Math.max(2, plotWidth / covAve.length - 1))
      .attr('height', (d) => plotHeight - yScale(d.depth))
      .attr('fill', accentColor)
      .attr('opacity', 0.8)

    // 10x threshold line
    if (maxDepth >= 10) {
      g.append('line')
        .attr('x1', 0)
        .attr('y1', yScale(10))
        .attr('x2', plotWidth)
        .attr('y2', yScale(10))
        .attr('stroke', errorColor)
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '6,3')

      g.append('text')
        .attr('x', plotWidth - 5)
        .attr('y', yScale(10) - 5)
        .attr('text-anchor', 'end')
        .attr('fill', errorColor)
        .attr('font-size', '11px')
        .text('10x threshold')
    }

    // X axis
    g.append('g')
      .attr('transform', `translate(0,${plotHeight})`)
      .call(d3.axisBottom(xScale).ticks(6))
      .selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '10px')

    g.append('text')
      .attr('x', plotWidth / 2)
      .attr('y', plotHeight + 45)
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .style('font-size', '12px')
      .text('Genome Position')

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale).ticks(6))
      .selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '10px')

    g.append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', -45)
      .attr('x', -plotHeight / 2)
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .style('font-size', '12px')
      .text('Coverage Depth')

    // Style axis lines
    svg.selectAll('.domain, .tick line').attr('stroke', textColor).attr('opacity', 0.3)

    // Tooltip overlay
    const tooltip = d3
      .select(containerRef.current)
      .append('div')
      .style('position', 'absolute')
      .style('pointer-events', 'none')
      .style('opacity', 0)
      .style('background', dark ? GX_COLORS.surfaceDark : GX_COLORS.surface)
      .style('border', `1px solid ${dark ? GX_COLORS.borderDark : GX_COLORS.border}`)
      .style('border-radius', '6px')
      .style('padding', '6px 10px')
      .style('font-size', '12px')
      .style('color', dark ? GX_COLORS.textMutedDark : GX_COLORS.textMuted)

    g.append('rect')
      .attr('width', plotWidth)
      .attr('height', plotHeight)
      .attr('fill', 'transparent')
      .on('mousemove', function (event) {
        const [mx] = d3.pointer(event)
        const position = Math.round(xScale.invert(mx))
        const nearest = covAve.reduce((prev, curr) =>
          Math.abs(curr.position - position) < Math.abs(prev.position - position) ? curr : prev
        )
        tooltip
          .style('opacity', 1)
          .style('left', `${event.offsetX + 12}px`)
          .style('top', `${event.offsetY - 10}px`)
          .html(`Position: ${nearest.position.toLocaleString()}<br>Depth: ${nearest.depth.toFixed(1)}`)
      })
      .on('mouseleave', () => tooltip.style('opacity', 0))

    return () => {
      tooltip.remove()
    }
  }, [coverage, chunkSize, isDark])

  if (coverage.length === 0) {
    return (
      <p className="text-sm text-gx-text-muted text-center py-8">
        No coverage data available.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gx-text-muted">Coverage across SARS-CoV-2 genome</h3>
        <PlotExportButtons svgRef={svgRef} filename="coverage_plot" />
      </div>
      <div ref={containerRef} className="relative overflow-x-auto">
        <svg ref={svgRef} className="block" />
      </div>
    </div>
  )
}
