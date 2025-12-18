/** @type {import('tailwindcss').Config} */
import plugin from 'tailwindcss/plugin'

export default {
  content: ['./src/renderer/index.html', './src/renderer/src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['VT323', 'sans-serif'],
        digital: ['VT323', 'monospace']
      },
      colors: {
        'nixie-orange': '#ff7a00',
        'nixie-glow': '#ffc800',
        'cyan-accent': '#00ffff',
        'cyan-dark': '#003c3c',
        'metal-dark': '#1a1a1a',
        'metal-medium': '#2a2a2a',
        'metal-light': '#4a4a4a'
      },
      textShadow: {
        glow: '0 0 5px currentColor, 0 0 15px currentColor, 0 0 25px currentColor'
      },
      keyframes: {
        flicker: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.8 }
        },
        glitch: {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' }
        }
      },
      animation: {
        flicker: 'flicker 1.5s infinite',
        glitch: 'glitch 0.2s infinite'
      }
    }
  },
  plugins: [
    plugin(function ({ matchUtilities, theme }) {
      matchUtilities(
        { 'text-shadow': (value) => ({ textShadow: value }) },
        { values: theme('textShadow') }
      )
    })
  ]
}
