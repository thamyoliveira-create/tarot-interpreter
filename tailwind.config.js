/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        tarot: {
          bg: '#09090b',
          card: '#121118',
          gold: '#d4af37',
          goldLight: '#f6e05e',
          accent: '#b45309',
        },
      },
      fontFamily: {
        serif: ['Cinzel', 'serif', 'Georgia'],
        sans: ['Plus Jakarta Sans', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
