import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        success: {
          DEFAULT: "hsl(var(--success))",
          foreground: "hsl(var(--success-foreground))",
        },
        warning: {
          DEFAULT: "hsl(var(--warning))",
          foreground: "hsl(var(--warning-foreground))",
        },
        hazard: {
          DEFAULT: "hsl(var(--hazard))",
          foreground: "hsl(var(--hazard-foreground))",
        },
        finance: {
          mint: '#E6F7F0',
          light: '#82E2B9',
          medium: '#4EBFA8',
          emerald: '#299E8F',
          deep: '#037A6B',
        },
        luxe: {
          forest: "hsl(var(--luxe-forest))",
          emerald: "hsl(var(--luxe-emerald))",
          copper: "hsl(var(--luxe-copper))",
          bronze: "hsl(var(--luxe-bronze))",
          ivory: "hsl(var(--luxe-ivory))",
        },
        bgBase: "var(--bg-base)",
        silkHighlight: "var(--silk-highlight)",
        silkShadow: "var(--silk-shadow)",
        accentCopper: "var(--accent-copper)",
        accentCopperGlow: "var(--accent-copper-glow)",
        textPrimary: "var(--text-primary)",
        textSecondary: "var(--text-secondary)",
        gridLine: "var(--grid-line)",
        "bg-base": "var(--bg-base)",
        "silk-highlight": "var(--silk-highlight)",
        "silk-shadow": "var(--silk-shadow)",
        "accent-copper": "var(--accent-copper)",
        "accent-copper-glow": "var(--accent-copper-glow)",
        "text-primary": "var(--text-primary)",
        "text-secondary": "var(--text-secondary)",
        "grid-line": "var(--grid-line)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "Segoe UI", "Roboto", "sans-serif"],
        header: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        display: ["var(--font-fraunces)", "Fraunces", "Georgia", "serif"],
        script: ["var(--font-script)", "cursive"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      keyframes: {
        "slide-in-right": {
          from: { opacity: "0", transform: "translateX(12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
        "slide-in-left": {
          from: { opacity: "0", transform: "translateX(-12px)" },
          to: { opacity: "1", transform: "translateX(0)" },
        },
      },
      animation: {
        "slide-in-right": "slide-in-right 0.25s ease-out",
        "slide-in-left": "slide-in-left 0.25s ease-out",
      },
    },
  },
  plugins: [],
};

export default config;
