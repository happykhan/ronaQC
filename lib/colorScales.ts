import * as d3 from 'd3'

// GenomicX-themed color scales for D3 visualizations

export function getHeatmapScale(maxValue: number) {
  return d3.scaleSequential()
    .interpolator(d3.interpolateRgbBasis([
      '#1e293b',  // dark (gx-bg-alt dark)
      '#d97706',  // warning
      '#0d9488',  // accent
    ]))
    .domain([0, maxValue])
}

export const GX_COLORS = {
  accent: '#0d9488',
  accentDark: '#2dd4bf',
  error: '#dc2626',
  errorDark: '#f87171',
  warning: '#d97706',
  textMuted: '#64748b',
  textMutedDark: '#94a3b8',
  border: '#e2e8f0',
  borderDark: '#334155',
  bg: '#f8fafc',
  bgDark: '#0f172a',
  surface: '#ffffff',
  surfaceDark: '#1e293b',
} as const
