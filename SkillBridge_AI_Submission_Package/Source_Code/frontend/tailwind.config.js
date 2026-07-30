/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: { colors: { ink: '#081225', violet: '#7267FF', mint: '#B9F4D1' }, boxShadow: { glow: '0 24px 80px rgba(114,103,255,.28)' } } },
  plugins: [],
}
