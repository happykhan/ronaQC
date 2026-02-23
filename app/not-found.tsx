import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold text-gx-accent">404</h1>
      <p className="mt-4 text-lg text-gx-text-muted">
        Page not found
      </p>
      <Link href="/import" className="btn-primary mt-6">
        Go to Import
      </Link>
    </div>
  )
}
