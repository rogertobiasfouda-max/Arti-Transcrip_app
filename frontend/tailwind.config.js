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
          bg:      '#F0F2F5',
          muted:   '#6B7280',
          sidebar: '#1E2530',
        },
      },
      borderRadius: {
        card: '14px',
        xl2: '18px',
      },
      boxShadow: {
        card:    '0 2px 16px rgba(0,0,0,0.07)',
        lifted:  '0 8px 30px rgba(0,0,0,0.10)',
        blue:    '0 4px 20px rgba(27,77,155,0.25)',
        'blue-lg': '0 8px 40px rgba(27,77,155,0.30)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      animation: {
        'wave':      'wave 1.2s ease-in-out infinite',
        'float':     'float 3s ease-in-out infinite',
        'fade-in-up':'fadeInUp 0.4s ease-out forwards',
        'fade-in':   'fadeIn 0.3s ease-out forwards',
        'slide-in':  'slideIn 0.3s ease-out forwards',
      },
      keyframes: {
        wave: {
          '0%, 100%': { transform: 'scaleY(0.35)' },
          '50%':      { transform: 'scaleY(1.0)' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%':      { transform: 'translateY(-6px)' },
        },
        fadeInUp: {
          from: { opacity: '0', transform: 'translateY(14px)' },
          to:   { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          from: { opacity: '0' },
          to:   { opacity: '1' },
        },
        slideIn: {
          from: { opacity: '0', transform: 'translateX(-8px)' },
          to:   { opacity: '1', transform: 'translateX(0)' },
        },
      },
      backgroundImage: {
        'grid-pattern': "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.03'%3E%3Cpath d='M0 0h40v40H0V0zm1 1v38h38V1H1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
}
