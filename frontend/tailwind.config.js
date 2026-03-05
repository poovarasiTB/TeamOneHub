/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          950: 'var(--color-bg-950)',
          900: 'var(--color-bg-900)',
          800: 'var(--color-bg-800)',
          700: 'var(--color-bg-700)',
          600: 'var(--color-bg-600)',
        },
        surface: {
          800: 'var(--color-surface-800)',
          750: 'var(--color-surface-750)',
          700: 'var(--color-surface-700)',
          650: 'var(--color-surface-650)',
          600: 'var(--color-surface-600)',
        },
        text: {
          100: 'var(--color-text-100)',
          80: 'var(--color-text-80)',
          60: 'var(--color-text-60)',
          40: 'var(--color-text-40)',
          30: 'var(--color-text-30)',
        },
        border: {
          12: 'var(--color-border-12)',
          20: 'var(--color-border-20)',
        },
        primary: {
          900: 'var(--color-primary-900)',
          800: 'var(--color-primary-800)',
          700: 'var(--color-primary-700)',
          600: 'var(--color-primary-600)',
          500: 'var(--color-primary-500)',
          400: 'var(--color-primary-400)',
        },
        success: 'var(--color-success)',
        warning: 'var(--color-warning)',
        error: 'var(--color-error)',
        info: 'var(--color-info)',
      },
    },
  },
  plugins: [],
}
