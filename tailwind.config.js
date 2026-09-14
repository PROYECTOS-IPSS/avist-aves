/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./app/**/*.{js,jsx,ts,tsx}', './src/**/*.{js,jsx,ts,tsx}'],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        field: {
          paper: '#F6F3E9',
          white: '#FFFDF8',
          ink: '#14231D',
          pine: '#16352B',
          moss: '#426B57',
          muted: '#5F7066',
          sage: '#DCE8DA',
          sky: '#D7E7E8',
          amber: '#E2B65D',
          'amber-dark': '#C89535',
          line: '#D7DED5',
        },
      },
      borderRadius: {
        '3xl': '24px',
      },
    },
  },
  plugins: [],
};
