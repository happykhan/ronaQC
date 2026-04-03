# RonaQC

> Browser-based quality control for SARS-CoV-2 sequencing data — no data upload required.

RonaQC processes BAM files from ARTIC and similar pipelines entirely in the browser using WebAssembly. It assesses cross-contamination, primer contamination, and consensus sequence quality to determine whether samples are suitable for phylogenetic analysis and submission to public databases (GISAID / INSDC). Your BAM files are never uploaded to any server.

## Features

- ARTIC primer scheme support (V1 through V5.4.2)
- Negative control QC — detects cross-contamination via SNP and amplicon analysis
- Sample QC — genome completeness, ambiguous bases, longest N run
- Amplicon coverage heatmap for visual QC across samples
- Per-sample genome-wide coverage plots
- Actionable judgements aligned with PHA4GE QC guidelines (Upload / Use only / Discard)
- CSV/TSV export for all reports
- Optional subsampling (30K reads) for faster processing

## Tech Stack

- **samtools** — BAM processing and coverage statistics (via biowasm WebAssembly)
- **ivar** — primer trimming and consensus calling (via biowasm WebAssembly)
- **D3.js** — interactive coverage plots and amplicon heatmaps
- **React + Vite** — frontend framework
- **Cloudflare Pages** — global CDN hosting

## Getting Started

```bash
npm install
npm run dev
```

Open http://localhost:5173

## Running Tests

```bash
npm test           # unit tests
npm run test:e2e   # end-to-end tests (requires build first)
```

## Citation

```
Alikhan, N-F. (2022). RonaQC: Quality control of SARS-CoV-2 genomic data.
https://github.com/happykhan/ronaQC
```

## Contributing

Contributions welcome. Please open an issue first to discuss changes.

## License

GPL-3.0 — see [LICENSE](LICENSE)
