import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // the cover: logo blue, the gradient's deep and mid blues, the light-blue bar, the yellow
        brand: "#0D16C3",
        electric: "#0714D8",
        deep: "#010BCC",
        mid: "#4C53D8",
        sky: "#0E7CFC",
        sun: "#FDEC05",
        // the catalogue's charte: navy titles, lines, text
        navy: "#071F78",
        night: "#040B52",
        ink: "#0B1233",
        body: "#3B4458",
        line: "#D9DDE8",
        mist: "#F3F5FB",
      },
      fontFamily: {
        sans: ["var(--font-montserrat)", "system-ui", "sans-serif"],
      },
      maxWidth: {
        page: "1240px",
      },
    },
  },
  plugins: [],
};

export default config;
