import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./pages/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./app/**/*.{ts,tsx}", "./src/**/*.{ts,tsx}"],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      fontFamily: {
        sans: ["'DM Sans'", "system-ui", "sans-serif"],
      },
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
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        sidebar: {
          DEFAULT: "hsl(var(--sidebar-background))",
          foreground: "hsl(var(--sidebar-foreground))",
          primary: "hsl(var(--sidebar-primary))",
          "primary-foreground": "hsl(var(--sidebar-primary-foreground))",
          accent: "hsl(var(--sidebar-accent))",
          "accent-foreground": "hsl(var(--sidebar-accent-foreground))",
          border: "hsl(var(--sidebar-border))",
          ring: "hsl(var(--sidebar-ring))",
        },
        nomi: {
          yellow: "hsl(var(--nomi-yellow))",
          "yellow-soft": "hsl(var(--nomi-yellow-soft))",
          blue: "hsl(var(--nomi-blue))",
          "blue-soft": "hsl(var(--nomi-blue-soft))",
          "blue-dark": "hsl(var(--nomi-blue-dark))",
          red: "hsl(var(--nomi-red))",
          "red-soft": "hsl(var(--nomi-red-soft))",
          green: "hsl(var(--nomi-green))",
          "green-soft": "hsl(var(--nomi-green-soft))",
          amber: "hsl(var(--nomi-amber))",
        },
        nutrient: {
          carbs: "hsl(var(--nutrient-carbs))",
          protein: "hsl(var(--nutrient-protein))",
          fat: "hsl(var(--nutrient-fat))",
          fibre: "hsl(var(--nutrient-fibre))",
          sugar: "hsl(var(--nutrient-sugar))",
        },
        rag: {
          green: "hsl(var(--rag-green))",
          amber: "hsl(var(--rag-amber))",
          red: "hsl(var(--rag-red))",
        },
        ai: {
          card: "hsl(var(--ai-card))",
          "card-foreground": "hsl(var(--ai-card-foreground))",
        },
        "log-action": {
          DEFAULT: "hsl(var(--log-action))",
          foreground: "hsl(var(--log-action-foreground))",
        },
        nav: {
          bg: "hsl(var(--nav-bg))",
          active: "hsl(var(--nav-active))",
          inactive: "hsl(var(--nav-inactive))",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "ring-fill": {
          "0%": { strokeDashoffset: "var(--ring-circumference)" },
          "100%": { strokeDashoffset: "var(--ring-target)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.4s ease-out forwards",
        "ring-fill": "ring-fill 1s ease-out forwards",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;
