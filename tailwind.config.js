/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: '#1E3A8A',
        sky: '#3B9EE5',
        emerald: '#10B981',
        charcoal: '#1F2937',
        amber: '#F59E0B',
        cream: '#F8FAFC',
      },
    },
  },
  plugins: [],
}