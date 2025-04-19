/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary': "#a9f9ab",
        'secondary': "#0D0842",
        'blackbg': "#F3F3F3",
        'favourite': "#FF5841",
      },
      fontFamily: {
        'primary': ["Montserrat", "sans-serif"],
        'secondary': ["Nunito Sans", "sans-serif"],
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
}

