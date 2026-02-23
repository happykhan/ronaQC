'use client'

import { AppProviders } from '@/lib/context'
import { Toaster } from 'react-hot-toast'

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <AppProviders>
      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            background: 'var(--gx-surface)',
            color: 'var(--gx-text)',
            border: '1px solid var(--gx-border)',
          },
        }}
      />
      {children}
    </AppProviders>
  )
}
