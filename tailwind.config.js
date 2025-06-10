/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx,mdx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Ronzino", "sans-serif"],
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};
