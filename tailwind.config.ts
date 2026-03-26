import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cyber: {
          dark: 'rgb(var(--cyber-dark) / <alpha-value>)',
          darker: 'rgb(var(--cyber-darker) / <alpha-value>)',
          light: 'rgb(var(--cyber-light) / <alpha-value>)',
          border: 'rgb(var(--cyber-border) / <alpha-value>)',
          glow: 'rgb(var(--cyber-glow) / <alpha-value>)',
          glowAlt: 'rgb(var(--cyber-glowAlt) / <alpha-value>)',
          text: 'rgb(var(--cyber-text) / <alpha-value>)',
          textDim: 'rgb(var(--cyber-textDim) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
      },
      animation: {
        'glow-pulse': 'glow-pulse 2s ease-in-out infinite',
        'glitch': 'glitch 0.3s infinite',
        'float': 'float 6s ease-in-out infinite',
      },
      keyframes: {
        'glow-pulse': {
          '0%, 100%': { opacity: '1', filter: 'brightness(1)' },
          '50%': { opacity: '0.8', filter: 'brightness(1.2)' },
        },
        'glitch': {
          '0%': { transform: 'translate(0)' },
          '20%': { transform: 'translate(-2px, 2px)' },
          '40%': { transform: 'translate(-2px, -2px)' },
          '60%': { transform: 'translate(2px, 2px)' },
          '80%': { transform: 'translate(2px, -2px)' },
          '100%': { transform: 'translate(0)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glow': '0 0 20px rgb(var(--cyber-glow) / 0.5)',
        'glow-lg': '0 0 40px rgb(var(--cyber-glow) / 0.6)',
        'glow-pink': '0 0 20px rgb(var(--cyber-glowAlt) / 0.5)',
      },
    },
  },
  plugins: [],
}
export default config

