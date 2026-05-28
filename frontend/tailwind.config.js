/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ac: {
          red:     '#E2231A',
          'red-dark': '#BC1A12',
          'red-deep': '#9A140D',
          'red-tint': '#FDECEA',
          'red-wash': '#FFF6F4',
          'red-line': '#F6C9C4',
        },
        ink:     '#1A1A1A',
        'ink-soft':  '#4B4B4B',
        'ink-muted': '#8A8A8A',
        'ink-faint': '#B5B5B5',
        surface: '#F6F6F4',
        'surface-warm': '#FBFAF8',
        card:    '#FFFFFF',
        border:  '#E7E5E1',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        sm: '6px', DEFAULT: '9px', md: '12px', lg: '16px', xl: '20px',
      },
      boxShadow: {
        sm:  '0 1px 2px rgba(20,18,16,.05)',
        DEFAULT: '0 1px 3px rgba(20,18,16,.05), 0 6px 18px rgba(20,18,16,.05)',
        lg:  '0 12px 40px rgba(20,18,16,.10)',
        red: '0 6px 20px rgba(226,35,26,.28)',
      },
    },
  },
  plugins: [],
}
