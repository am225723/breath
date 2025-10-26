/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ember: {
          50: '#fff9e6',
          100: '#fff0b3',
          200: '#ffe680',
          300: '#ffdd4d',
          400: '#ffd31a',
          500: '#ffc800',
          600: '#e6b400',
          700: '#cc9f00',
          800: '#b38b00',
          900: '#997600',
        },
        bonfire: {
          50: '#fff5e6',
          100: '#ffe4b3',
          200: '#ffd380',
          300: '#ffc24d',
          400: '#ffb11a',
          500: '#ff9f00',
          600: '#e68f00',
          700: '#cc7f00',
          800: '#b36f00',
          900: '#995f00',
        },
        ash: {
          50: '#f5f5f5',
          100: '#e0e0e0',
          200: '#cccccc',
          300: '#b3b3b3',
          400: '#999999',
          500: '#808080',
          600: '#666666',
          700: '#4d4d4d',
          800: '#333333',
          900: '#1a1a1a',
        },
      },
    },
  },
  plugins: [],
}