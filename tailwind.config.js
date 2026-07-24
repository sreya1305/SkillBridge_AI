/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0A1020',
        navy: '#101A33',
        mint: '#B8F2D0',
        violet: '#7668FF',
      },
      boxShadow: {
        glow: '0 20px 70px rgba(118, 104, 255, 0.28)',
      },
    },
  },
  plugins: [],
}
