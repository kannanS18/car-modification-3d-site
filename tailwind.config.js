/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        atelier: {
          bg: '#0B0B0C',
          surface: '#141416',
          'surface-hover': '#1D1F24',
          primary: '#FF4D00',
          'primary-hover': '#FF6E2E',
          secondary: '#D4AF37',
          accent: '#FF3300',
          border: 'rgba(255, 77, 0, 0.25)',
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