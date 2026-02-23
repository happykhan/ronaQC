export default function Footer() {
  return (
    <footer className="mt-auto border-t border-gx-border bg-gx-bg-alt">
      <div className="mx-auto max-w-5xl px-4 py-6">
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gx-text-muted">
            RonaQC &mdash; Quality control for SARS-CoV-2 sequencing data
          </p>
          <div className="flex items-center gap-4">
            <a
              href="https://github.com/happykhan/ronaQC"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-gx-text-muted hover:text-gx-text transition-colors"
            >
              GitHub
            </a>
            <span className="text-xs text-gx-text-muted">
              GPL-3.0
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
