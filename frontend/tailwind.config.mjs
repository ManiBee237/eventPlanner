/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: '#2C3E50',
        secondary: '#18BC9C',
        accent: '#E74C3C',
        background: '#ECF0F1',
        text: '#34495E',
      },
    },
  },
}
