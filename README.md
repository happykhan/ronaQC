# RonaQC

[![CI](https://github.com/happykhan/ronaQC/actions/workflows/ci.yml/badge.svg)](https://github.com/happykhan/ronaQC/actions/workflows/ci.yml)

Quality control tool for SARS-CoV-2 sequencing data. RonaQC processes BAM files entirely in the browser using WebAssembly — **no data leaves your computer**.

## Features

- **Browser-based analysis** — Runs samtools and ivar via WebAssembly (biowasm)
- **Negative control QC** — SNP detection, genome coverage, mapped reads, amplicon analysis
- **Sample QC** — Consensus generation, QC thresholds, ambiguous base detection, N-run analysis
- **Interactive visualizations** — D3.js coverage plots and amplicon heatmaps with tooltips and export
- **ARTIC primer support** — V1 through V4.1 primer schemes
- **Optional subsampling** — Subsample to 30K reads for faster consensus generation
- **Privacy-first** — All processing happens locally in the browser

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

## Architecture

- **Framework**: Next.js 15 + React 19 + TypeScript
- **Styling**: Tailwind CSS with GenomicX design tokens
- **Bioinformatics**: @biowasm/aioli (samtools 1.10 + ivar 1.3.1)
- **Visualizations**: D3.js v7
- **Testing**: Vitest + Testing Library + Playwright
- **Deployment**: Vercel

## Project Structure

```
app/           → Next.js pages (import, control, report, help)
components/    → Reusable UI components
lib/           → Core logic (pipeline, validators, contexts, types)
public/        → Reference genome, primer schemes, test data
e2e/           → Playwright end-to-end tests
```

## Testing

```bash
npm test              # Unit + component tests (Vitest)
npm run test:watch    # Watch mode
npm run test:coverage # Coverage report
npm run test:e2e      # End-to-end tests (Playwright)
```

## Test Data

### Simple dataset (30MB)
Included in `public/ronaqc_small_test.zip` — contains mapped reads of three sequenced controls and two genuine SARS-CoV-2 samples.

### Exhaustive dataset (1GB)
[![DOI](https://zenodo.org/badge/DOI/10.5281/zenodo.7018405.svg)](https://doi.org/10.5281/zenodo.7018405)

Available at https://zenodo.org/record/7018405 — includes VOC reads, known-failure samples, and the simple dataset above.

## Citation

```
Alikhan, N-F. (2022). RonaQC: Quality control of SARS-CoV-2 genomic data.
https://github.com/happykhan/ronaQC
```

## License

GPL-3.0
