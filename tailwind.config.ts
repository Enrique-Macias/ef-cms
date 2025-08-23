import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        'metropolis': ['Metropolis', 'sans-serif'],
      },
      fontWeight: {
        'light': '300',
        'normal': '400',
        'semibold': '600',
        'bold': '700',
      },
      colors: {
        // Custom color palette
        'title': '#0D141C',        // Title and icons (sidebar)
        'text': '#4A739C',         // Main text color
        'button': '#5A6F80',       // Primary button color
        'button-delete': '#F43F5E', // Delete button color
        'stroke': '#CFDBE8',       // Stroke for tables, cards
        'button-text': '#FFFDF6',  // Text color when in buttons
        'background': '#F7FAFC',   // Background pages
      },
      backgroundColor: {
        'page': '#F7FAFC',
      },
      textColor: {
        'title': '#0D141C',
        'text': '#4A739C',
        'button-text': '#FFFDF6',
      },
      borderColor: {
        'stroke': '#CFDBE8',
      },
    },
  },
  plugins: [],
}

export default config
