import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        mainGreen: "#419743",
        mainBg: "#DBD9D5",
        stateCompleted: "#00b2ff",
        mainBgLight: "#EFEFEF",
        cardGradient: "#419b43",
      },
      container: {
        padding: {
          DEFAULT: "1rem",
          sm: "1rem",
          lg: "4rem",
          xl: "5rem",
          "2xl": "6rem",
        },
        center: true,
        screens: {
          sm: "100%",
          md: "100%",
          lg: "1024px", // Set a larger default max-width for large screens
          xl: "1520px", // Set an even larger max-width for extra large screens
          "2xl": "1800px", // Adjust for screens larger than 1536px
        },
      },
      backgroundImage: {
        match_bg: "url('/assets/imgs/icons/arrow-left.svg')",
        matchCardBg: "url('/assets/imgs/bg/CommonCard.png')",
        coverBg: "url('/assets/imgs/bg/bg1.png')",
      },
      boxShadow: {
        "right-only": "10px 0 10px -10px rgba(0, 0, 0, 0.5)",
      },
    },
  },
  plugins: [],
};
export default config;
