import type { Config } from "tailwindcss";

/**
 * Tailwind theme wired to the design-token CSS variables (Requirement 4.2).
 *
 * Every value below references a CSS variable declared in `app/globals.css`,
 * whose values are the single source of truth mirrored in `lib/tokens`. This
 * keeps Tailwind utilities and raw CSS in lockstep: change a token value in one
 * place (globals.css / lib/tokens/values.ts) and both consumers update.
 */
const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    // Breakpoints mirror the design-token breakpoint values.
    screens: {
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {
      colors: {
        background: "var(--color-background)",
        surface: "var(--color-surface)",
        "surface-muted": "var(--color-surface-muted)",
        border: "var(--color-border)",
        "text-primary": "var(--color-text-primary)",
        "text-secondary": "var(--color-text-secondary)",
        "text-muted": "var(--color-text-muted)",

        brand: {
          DEFAULT: "var(--color-brand)",
          hover: "var(--color-brand-hover)",
          fg: "var(--color-on-brand)",
        },
        "focus-ring": "var(--color-focus-ring)",

        // Status families (reinforcement only — never the sole signal).
        "status-safe": {
          DEFAULT: "var(--color-status-safe)",
          surface: "var(--color-status-safe-surface)",
          border: "var(--color-status-safe-border)",
          fg: "var(--color-status-safe-foreground)",
        },
        "status-caution": {
          DEFAULT: "var(--color-status-caution)",
          surface: "var(--color-status-caution-surface)",
          border: "var(--color-status-caution-border)",
          fg: "var(--color-status-caution-foreground)",
        },
        "status-avoid": {
          DEFAULT: "var(--color-status-avoid)",
          surface: "var(--color-status-avoid-surface)",
          border: "var(--color-status-avoid-border)",
          fg: "var(--color-status-avoid-foreground)",
        },

        // Confidence: neutral family, distinct from every status hue.
        confidence: {
          DEFAULT: "var(--color-confidence-neutral)",
          surface: "var(--color-confidence-neutral-surface)",
          border: "var(--color-confidence-neutral-border)",
          fg: "var(--color-confidence-neutral-foreground)",
        },
      },

      fontFamily: {
        sans: ["var(--font-sans)"],
        display: ["var(--font-display)"],
        mono: ["var(--font-mono)"],
      },

      // Typographic scale roles: [fontSize, { lineHeight, fontWeight, letterSpacing }].
      fontSize: {
        display: [
          "3rem",
          { lineHeight: "1.08", fontWeight: "700", letterSpacing: "-0.02em" },
        ],
        h1: [
          "2.25rem",
          { lineHeight: "1.15", fontWeight: "700", letterSpacing: "-0.015em" },
        ],
        h2: [
          "1.5rem",
          { lineHeight: "1.25", fontWeight: "600", letterSpacing: "-0.01em" },
        ],
        h3: ["1.25rem", { lineHeight: "1.3", fontWeight: "600" }],
        body: ["1rem", { lineHeight: "1.6", fontWeight: "400" }],
        label: ["0.875rem", { lineHeight: "1.4", fontWeight: "600" }],
        caption: ["0.8125rem", { lineHeight: "1.4", fontWeight: "400" }],
      },

      spacing: {
        xs: "var(--space-xs)",
        sm: "var(--space-sm)",
        md: "var(--space-md)",
        lg: "var(--space-lg)",
        xl: "var(--space-xl)",
        "2xl": "var(--space-2xl)",
      },

      borderRadius: {
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
        full: "var(--radius-full)",
      },

      boxShadow: {
        sm: "var(--shadow-sm)",
        md: "var(--shadow-md)",
      },

      // Motion durations consume the reduced-motion-aware effective tokens
      // (Requirement 4.6): under prefers-reduced-motion these resolve to 0ms.
      transitionDuration: {
        fast: "var(--duration-fast)",
        base: "var(--duration-base)",
      },
      transitionTimingFunction: {
        base: "var(--motion-easing)",
      },

      // Token-driven focus ring color (Requirement 4.5).
      ringColor: {
        focus: "var(--color-focus-ring)",
      },
    },
  },
  plugins: [],
};

export default config;
