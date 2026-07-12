/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sage: "#8CA496",
        sageDark: "#5C7266",
        sand: "#D9CDC3",
        cream: "#FAF8F5",
        clay: "#A8815F",
        mist: "#F0F5F0",
      },
      fontFamily: {
        display: ["Fraunces", "serif"],
        sans: ["Inter", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "1rem",
      },
      keyframes: {
        "splash-in": {
          "0%": { opacity: "0", transform: "scale(0.85)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
      },
      animation: {
        "splash-in": "splash-in 500ms ease-out forwards",
      },
    },
  },
  plugins: [],
};
