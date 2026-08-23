import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./pay.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // ---- Ink / neutrals ----
        sumi: { DEFAULT: "#1E1C1A", soft: "#3A3733", faint: "#6B665D" },
        rice: { DEFAULT: "#F4EFE6", deep: "#EAE2D3", raised: "#FBF8F2" },
        stone: { DEFAULT: "#8C8577", line: "rgba(30,28,26,0.12)", "line-strong": "rgba(30,28,26,0.22)" },
        // ---- Accents ----
        // moss = growth / cultivation (the farming half)
        moss: { DEFAULT: "#5F7052", deep: "#445039", soft: "#9AAA8B" },
        // indigo = precision / analysis (the security half) — traditional "ai-iro"
        indigo: { DEFAULT: "#33415C", deep: "#212C40", soft: "#7A88A3" },
        // earth = warmth, used sparingly for the farming metaphor
        earth: { DEFAULT: "#9C7A54", deep: "#78593C" },
      },
      fontFamily: {
        display: ["'Zen Old Mincho'", "serif"],
        body: ["'Zen Kaku Gothic New'", "sans-serif"],
        mono: ["'JetBrains Mono'", "ui-monospace", "monospace"],
      },
      maxWidth: {
        content: "1180px",
      },
      transitionTimingFunction: {
        zen: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      borderRadius: {
        pebble: "60% 40% 55% 45% / 45% 55% 45% 55%",
      },
      boxShadow: {
        soft: "0 20px 60px -35px rgba(30,28,26,0.35)",
        lift: "0 30px 80px -30px rgba(30,28,26,0.45)",
      },
    },
  },
  plugins: [],
} satisfies Config;
