/** @type {import('tailwindcss').Config} */

module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        default: ["'Open Sans'", "sans-serif"],
        heading: ["'Montserrat'", "sans-serif"],
      }
    },
  },
  plugins: [require('prettier-plugin-tailwindcss')],
};
