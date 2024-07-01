import { url } from "inspector";
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        constructionCartoon: "url('/images/mainPage/constructionCartoon.svg')",
        cartoonConstructionSkyLine:
          "url('/images/mainPage/cartoonConstructionSkyLine.svg')",
        topography: "url('/images/mainPage/topography.svg')",
      },
      colors: {
        "button-primary-one": "#243040",
        "button-primary-two": "#182335",
        "button-secondary-one": "#687be2",
        "button-secondary-two": "#5F74df",
      },
    },
  },
  plugins: [],
};
export default config;
