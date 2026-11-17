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
      // 🎯 ADD THIS ANIMATION
      animation: {
        'border-slide': 'border-slide 2.5s linear infinite',
      },
      keyframes: {
        'border-slide': {
          '0%': { backgroundPosition: '200% 50%' },
          '100%': { backgroundPosition: '-200% 50%' },
        },
      },
    },
  },
  plugins: [],
}