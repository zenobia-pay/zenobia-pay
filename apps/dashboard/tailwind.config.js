/** @type {import('tailwindcss').Config} */
export default {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#101410",
        secondary: "#26330d",
        accent: "#26330d",
        cream: "#ffffff",
        dark: "#333333",
        light: "#f5f5f5",
        mediumgrey: "#999999",
      },
      fontFamily: {
        body: ["'Red Hat Display'", "sans-serif"],
        headline: ["'EB Garamond'", "serif"],
      },
      maxWidth: {
        "8xl": "90rem",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
    darkTheme: "dark",
    base: true,
    styled: true,
    utils: true,
    logs: true,
    rtl: false,
    prefix: "",
  },
}
