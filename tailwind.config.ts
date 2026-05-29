import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--obsidian)",
        foreground: "var(--aged-cream)",
        obsidian: "var(--obsidian)",
        "aged-cream": "var(--aged-cream)",
        "kahlua-brown": "var(--kahlua-brown)",
        "amber-gold": "var(--amber-gold)",
        condensation: "var(--condensation-white)",
      },
      fontFamily: {
        display: ["var(--font-playfair)", "serif"],
        body: ["var(--font-dm-sans)", "sans-serif"],
        accent: ["var(--font-cormorant)", "serif"],
      },
      fontSize: {
        'h1': ['clamp(4.5rem, 8vw, 6rem)', { lineHeight: '1', letterSpacing: '-0.02em' }],
        'h2': ['3rem', { lineHeight: '1.2' }],
        'h3': ['1.75rem', { lineHeight: '1.3' }],
        'body': ['1rem', { lineHeight: '1.8' }],
        'label': ['0.6875rem', { lineHeight: '1.5', letterSpacing: '0.18em' }],
      },
      animation: {
        'shimmer': 'shimmer 2s infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' }
        }
      }
    },
  },
  plugins: [],
};
export default config;
