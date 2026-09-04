import type { Config } from 'tailwindcss'
import { defaultTheme } from './src/configs/themeConfigs'

const config: Config = {
  content: ['./src/components/**/*.{js,ts,jsx,tsx,mdx}', './src/app/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      backgroundImage: {
        image: `var(--partner-config-backgroundImage, url('${defaultTheme.backgroundImage}'))`,
      },
      colors: {
        config: {
          primary: `var(--partner-config-primaryColor, ${defaultTheme.primaryColor})`,
          text: `var(--partner-config-systemTextColor, ${defaultTheme.systemTextColor})`,
          'text-btn': `var(--partner-config-textButtonColor, ${defaultTheme.textButtonColor})`,
          background: `var(--partner-config-backgroundColor, ${defaultTheme.backgroundColor})`,
        },
        turquoise: {
          100: '#42D3CB',
          200: '#9BE4E0',
          300: '#8BC7CC',
          400: '#38B2AC',
          500: '#1e7a75',
        },
        darkgrey: {
          100: '#021110',
          300: '#0A3331',
          400: '#031a18',
          500: '#9ca3af',
        },
        // Earthy wedding palette
        terracotta: '#C4714A',
        parchment: '#F5EDD6',
        sage: '#7A8C6E',
        mushroom: '#5C4033',
        'dusty-rose': '#C9A99A',
        taupe: '#A89070',
        ivory: '#FAF6EE',
        espresso: '#3B2A22',
        linen: '#E8DFC8',
        kraft: '#D4B896',
      },
      fontFamily: {
        cormorant: ['var(--font-cormorant)', 'serif'],
        vibes: ['var(--font-vibes)', 'cursive'],
        lato: ['var(--font-lato)', 'sans-serif'],
      },
      keyframes: {
        flip: {
          '0%': { transform: 'rotateY(180deg)', transition: '1s', opacity: '0' },
          '100%': { transform: 'rotateY(0deg)', transition: '1s', opacity: '1' },
        },
        breathe: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        sealShimmer: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.75' },
        },
        sealCrack: {
          '0%': { transform: 'scale(1)' },
          '30%': { transform: 'scale(1.15)' },
          '60%': { transform: 'scale(0.9)' },
          '100%': { transform: 'scale(1)', opacity: '0' },
        },
        flapOpen: {
          '0%': { transform: 'rotateX(0deg)' },
          '100%': { transform: 'rotateX(-175deg)' },
        },
        cardRise: {
          '0%': { transform: 'translateY(70%)', opacity: '0' },
          '60%': { opacity: '1' },
          '100%': { transform: 'translateY(-12%)', opacity: '1' },
        },
        fadeInUp: {
          '0%': { transform: 'translateY(12px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      animation: {
        flip: 'flip 1s ease-in-out',
        breathe: 'breathe 3s ease-in-out infinite',
        sealShimmer: 'sealShimmer 2.5s ease-in-out infinite',
        sealCrack: 'sealCrack 400ms ease-out forwards',
        flapOpen: 'flapOpen 500ms cubic-bezier(0.4, 0, 0.2, 1) forwards',
        cardRise: 'cardRise 600ms cubic-bezier(0.34, 1.3, 0.64, 1) forwards',
        fadeInUp: 'fadeInUp 500ms ease-out forwards',
        fadeIn: 'fadeIn 600ms ease-out forwards',
      },
      whiteSpace: {
        'pre-line': 'pre-line',
      },
    },
  },
  plugins: [],
}
export default config

