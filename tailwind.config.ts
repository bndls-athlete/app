import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // fontSize: {
      //   base: '0.875rem'
      // },
      colors: {
        primary: "#C6B624",
        sidebar: "#F0F0F0",
        subtitle: "#475467",
        dark: "#101828",
        success: "#067647",
      },
      screens: {
        "3xl": { min: "1836px" },
      },
    },
  },
  safelist: [{ pattern: /alert-+/ }],
  plugins: [require("daisyui")],
  daisyui: {
    themes: [
      {
        mytheme: {
          primary: "#C6B624",
          "primary-content": "#ffffff",
          secondary: "#F0F0F0",
          "secondary-content": "#101828",
          accent: "#475467",
          "accent-content": "#ffffff",
          neutral: "#101828",
          "neutral-content": "#ffffff",
          "base-100": "#ffffff",
          "base-200": "#f4f4f5",
          "base-300": "#e4e4e7",
          "base-content": "#101828",
          info: "#3ABFF8",
          "info-content": "#ffffff",
          success: "#067647",
          "success-content": "#ffffff",
          warning: "#FBBD23",
          "warning-content": "#101828",
          error: "#F87272",
          "error-content": "#ffffff",
        },
      },
    ],
  },
};
export default config;
