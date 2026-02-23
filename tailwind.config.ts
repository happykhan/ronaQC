import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['selector', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        gx: {
          bg: 'var(--gx-bg)',
          'bg-alt': 'var(--gx-bg-alt)',
          surface: 'var(--gx-surface)',
          'surface-hover': 'var(--gx-surface-hover)',
          border: 'var(--gx-border)',
          text: 'var(--gx-text)',
          'text-muted': 'var(--gx-text-muted)',
          'text-inverted': 'var(--gx-text-inverted)',
          accent: 'var(--gx-accent)',
          'accent-hover': 'var(--gx-accent-hover)',
          success: 'var(--gx-success)',
          warning: 'var(--gx-warning)',
          error: 'var(--gx-error)',
          info: 'var(--gx-info)',
        },
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      boxShadow: {
        card: '0 6px 18px rgba(19, 31, 63, 0.06)',
      },
    },
  },
  plugins: [],
}

export default config
