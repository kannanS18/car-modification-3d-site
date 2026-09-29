/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        atelier: {
          bg: '#080A10',
          surface: '#0F131C',
          'surface-hover': '#161B26',
          primary: '#F59E0B',
          'primary-hover': '#FBBF24',
          secondary: '#D4AF37',
          accent: '#D97706',
          border: 'rgba(245, 158, 11, 0.25)',
        }
      },
      fontFamily: {
        heading: ['Rajdhani', 'sans-serif'],
        body: ['Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      }
    }
  },
  plugins: [],
};