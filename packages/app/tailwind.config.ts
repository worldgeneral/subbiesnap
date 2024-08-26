import { url } from "inspector";
import type { Config } from "tailwindcss";

const config: Config = {
  variants: {
    extend: {
      visibility: ["group-hover"],
    },
  },
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "construction-cartoon":
          "url('/images/main-page/construction-cartoon.svg')",
        "cartoon-construction-sky-line":
          "url('/images/main-page/cartoon-construction-sky-line.svg')",
        topography: "url('/images/main-page/topography.svg')",
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
