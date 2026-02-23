'use client'

import { useEffect, useRef, useCallback } from 'react'
import * as d3 from 'd3'
import PlotExportButtons from './PlotExportButtons'
import { GX_COLORS, getHeatmapScale } from '@/lib/colorScales'

interface AmpliconData {
  name: string
  coverage: number[]
}

interface AmpliconHeatmapProps {
  amplicons: AmpliconData[]
  labels?: string[]
}

export default function AmpliconHeatmap({ amplicons, labels }: AmpliconHeatmapProps) {
  const svgRef = useRef<SVGSVGElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const isDark = useCallback(() => {
    return document.documentElement.getAttribute('data-theme') === 'dark'
  }, [])

  useEffect(() => {
    if (!svgRef.current || !containerRef.current || amplicons.length === 0) return

    const containerWidth = containerRef.current.clientWidth
    const width = Math.max(containerWidth, 600)
    const height = Math.max(200, amplicons.length * 40 + 160)
    const margin = { top: 20, right: 100, bottom: 80, left: 120 }

    const indexList = labels ?? Array.from(
      { length: amplicons[0]?.coverage.length ?? 0 },
      (_, i) => i.toString()
    )

    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    svg.attr('width', width).attr('height', height)

    const dark = isDark()
    const textColor = dark ? GX_COLORS.textMutedDark : GX_COLORS.textMuted

    const plotWidth = width - margin.left - margin.right
    const plotHeight = height - margin.top - margin.bottom

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`)

    const maxCoverage = d3.max(amplicons, (d) => d3.max(d.coverage)) ?? 1
    const covScale = getHeatmapScale(maxCoverage)

    const xScale = d3.scaleBand()
      .range([0, plotWidth])
      .domain(indexList)
      .padding(0.05)

    const yScale = d3.scaleBand()
      .range([plotHeight, 0])
      .domain(amplicons.map((d) => d.name))
      .padding(0.05)

    // Flatten data for cells
    const cells = amplicons.flatMap((sample) =>
      sample.coverage.map((cov, i) => ({
        name: sample.name,
        index: indexList[i] ?? i.toString(),
        cov: cov ?? 0,
      }))
    )

    // Tooltip
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

    // Heatmap cells
    g.selectAll('rect.cell')
      .data(cells)
      .join('rect')
      .attr('class', 'cell')
      .attr('x', (d) => xScale(d.index) ?? 0)
      .attr('y', (d) => yScale(d.name) ?? 0)
      .attr('rx', 2)
      .attr('ry', 2)
      .attr('width', xScale.bandwidth())
      .attr('height', yScale.bandwidth())
      .style('fill', (d) => covScale(d.cov))
      .style('opacity', 0.85)
      .on('mouseover', function (event, d) {
        d3.select(this).style('opacity', 1).style('stroke', textColor).style('stroke-width', '1px')
        tooltip
          .style('opacity', 1)
          .style('left', `${event.offsetX + 12}px`)
          .style('top', `${event.offsetY - 10}px`)
          .html(`Sample: ${d.name}<br>Amplicon: ${d.index}<br>Coverage: ${(d.cov * 100).toFixed(1)}%`)
      })
      .on('mouseleave', function () {
        d3.select(this).style('opacity', 0.85).style('stroke', 'none')
        tooltip.style('opacity', 0)
      })

    // X axis
    const xAxis = d3.axisBottom(xScale).tickValues(
      xScale.domain().filter((_, i) => !(i % 5))
    )
    g.append('g')
      .attr('transform', `translate(0,${plotHeight})`)
      .call(xAxis)
      .selectAll('text')
      .attr('transform', 'rotate(-90) translate(0, -5)')
      .style('text-anchor', 'end')
      .attr('fill', textColor)
      .style('font-size', '9px')

    // Y axis
    g.append('g')
      .call(d3.axisLeft(yScale))
      .selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '10px')

    // Axis label
    g.append('text')
      .attr('x', plotWidth / 2)
      .attr('y', plotHeight + 65)
      .attr('text-anchor', 'middle')
      .attr('fill', textColor)
      .style('font-size', '12px')
      .text('Amplicon')

    // Style axis lines
    svg.selectAll('.domain, .tick line').attr('stroke', textColor).attr('opacity', 0.3)

    // Color legend
    const legendWidth = 15
    const legendHeight = plotHeight
    const legendScale = d3.scaleLinear().domain([0, maxCoverage]).range([legendHeight, 0])

    const legendGroup = g.append('g')
      .attr('transform', `translate(${plotWidth + 20}, 0)`)

    const defs = svg.append('defs')
    const gradient = defs.append('linearGradient')
      .attr('id', 'heatmap-gradient')
      .attr('x1', '0%').attr('y1', '100%')
      .attr('x2', '0%').attr('y2', '0%')

    gradient.append('stop').attr('offset', '0%').attr('stop-color', covScale(0))
    gradient.append('stop').attr('offset', '50%').attr('stop-color', covScale(maxCoverage / 2))
    gradient.append('stop').attr('offset', '100%').attr('stop-color', covScale(maxCoverage))

    legendGroup.append('rect')
      .attr('width', legendWidth)
      .attr('height', legendHeight)
      .style('fill', 'url(#heatmap-gradient)')

    const legendAxis = d3.axisRight(legendScale).ticks(5).tickFormat((d) => `${(+d * 100).toFixed(0)}%`)
    legendGroup.append('g')
      .attr('transform', `translate(${legendWidth}, 0)`)
      .call(legendAxis)
      .selectAll('text')
      .attr('fill', textColor)
      .style('font-size', '10px')

    legendGroup.selectAll('.domain, .tick line').attr('stroke', textColor).attr('opacity', 0.3)

    return () => {
      tooltip.remove()
    }
  }, [amplicons, labels, isDark])

  if (amplicons.length === 0) {
    return (
      <p className="text-sm text-gx-text-muted text-center py-8">
        No amplicon data available.
      </p>
    )
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium text-gx-text-muted">Amplicon coverage heatmap</h3>
        <PlotExportButtons svgRef={svgRef} filename="amplicon_heatmap" />
      </div>
      <div ref={containerRef} className="relative overflow-x-auto">
        <svg ref={svgRef} className="block" />
      </div>
    </div>
  )
}
