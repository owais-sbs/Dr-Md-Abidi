/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        // Brand palette — Deep Blue / Light Blue / Orange
        primary: {
          50:  '#e6eeff',
          100: '#c0d2ff',
          200: '#94b1ff',
          300: '#6690ff',
          400: '#3d72ff',
          500: '#1a56f5',
          600: '#0c3fd4',
          700: '#0830b0',
          800: '#05238a',
          900: '#02298E', // ← Deep Blue (logo)
          950: '#011a60',
        },
        sky: {
          50:  '#edfaff',
          100: '#d0f3ff',
          200: '#a8ebff',
          300: '#59C7F0', // ← Light Blue (logo)
          400: '#2ab5e8',
          500: '#0e9fd0',
          600: '#0881ac',
          700: '#0b678c',
          800: '#0f5572',
          900: '#114760',
        },
        orange: {
          50:  '#fff5e6',
          100: '#ffe4bf',
          200: '#ffd099',
          300: '#ffb866',
          400: '#ffa040',
          500: '#F28A24', // ← Orange (logo)
          600: '#d4720f',
          700: '#b05a08',
          800: '#8c4505',
          900: '#6e3304',
        },
        ink: {
          50:  '#f6f7f9',
          100: '#eceef2',
          200: '#d4d9e2',
          300: '#aeb8c9',
          400: '#8291ab',
          500: '#647491',
          600: '#4f5d78',
          700: '#414b61',
          800: '#394052',
          900: '#1f2533',
          950: '#0d1320',
        },
      },
      fontFamily: {
        sans:  ['Inter', 'system-ui', 'sans-serif'],
        serif: ['"Merriweather"', 'Georgia', 'serif'],
      },
      boxShadow: {
        soft: '0 4px 20px -4px rgba(2, 41, 142, 0.10)',
        card: '0 8px 32px -8px rgba(2, 41, 142, 0.14)',
        lift: '0 16px 48px -12px rgba(2, 41, 142, 0.22)',
      },
      borderRadius: {
        xl:   '0.875rem',
        '2xl':'1.25rem',
        '3xl':'1.75rem',
      },
      container: {
        center: true,
        padding: { DEFAULT: '1rem', sm: '1.5rem', lg: '2rem' },
        screens: { '2xl': '1280px' },
      },
    },
  },
  plugins: [],
};
