/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        acti: {
          blue:    '#1B4D9B',
          red:     '#E1251B',
          dark:    '#1A1A1A',
          bg:      '#F5F6F8',
          muted:   '#6B7280',
          sidebar: '#1E2530',
        },
      },
      borderRadius: {
        card: '12px',
      },
      boxShadow: {
        card: '0 2px 12px rgba(0,0,0,0.06)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
