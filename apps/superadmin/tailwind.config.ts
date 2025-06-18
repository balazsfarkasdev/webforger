// tailwind.config.ts
import type { Config } from "tailwindcss"

const config: Config = {
  content: [
    "./apps/**/*.{ts,tsx}",
    "./packages/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["lofi"],
  } as any,
}

export default config
