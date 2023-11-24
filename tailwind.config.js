/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        "catppuccin-mocha": {
          primary: "#a6e3a1", // green
          secondary: "#f5c2e7", // pink
          accent: "#89dceb", // sky
          neutral: "#11111b", // crust
          "base-100": "#1e1e2e", // base
          info: "#74c7ec", // sapphire
          success: "#94e2d5", // teal
          warning: "#f9e2af", // yellow
          error: "#f38ba8", // red
        },
      },
    ],
  },
};
