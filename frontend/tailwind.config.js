/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        inter: ['Inter', 'sans-serif'],
      },
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'border-pulse': 'border-pulse 2s ease-in-out infinite',
        'float': 'float 4s ease-in-out infinite',
        'flicker': 'flicker 2s step-end infinite',
        'glow-red': 'glow-red 2s ease-in-out infinite',
        'slide-in': 'slide-in 0.3s ease-out',
      },
      keyframes: {
        'border-pulse': {
          '0%, 100%': { 'border-color': 'rgba(239, 68, 68, 0.35)', 'box-shadow': '0 0 8px rgba(239, 68, 68, 0.15)' },
          '50%': { 'border-color': 'rgba(239, 68, 68, 0.8)', 'box-shadow': '0 0 20px rgba(239, 68, 68, 0.4)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-8px)' },
        },
        'flicker': {
          '0%, 100%': { opacity: '1' },
          '45%': { opacity: '1' },
          '50%': { opacity: '0.1' },
          '55%': { opacity: '1' },
        },
        'glow-red': {
          '0%, 100%': { 'box-shadow': '0 0 5px rgba(239,68,68,0.4), 0 0 20px rgba(239,68,68,0.2)' },
          '50%': { 'box-shadow': '0 0 20px rgba(239,68,68,0.8), 0 0 60px rgba(239,68,68,0.4)' },
        },
        'slide-in': {
          from: { opacity: '0', transform: 'translateY(-8px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
}
