import type { DesignTokens } from "./types";

/**
 * Concrete design-token values for the FoodSignal prototype.
 *
 * Color choices target WCAG 2.2 AA (Requirements 5.5, 5.6): the `*Foreground`
 * shades are dark enough to reach 4.5:1 against their light `*Surface`, and the
 * saturated status/border shades reach 3:1 for large text and UI boundaries.
 *
 * The three status families are deliberately different HUES so they remain
 * distinguishable independent of color — Safe (green), Caution (amber),
 * Avoid (red) — but per Requirement 6.x color is only ever reinforcement; the
 * StatusIndicator component always adds text + icon/shape.
 *
 * The confidence family uses a cool slate/indigo neutral (Requirement 4.4) that
 * is intentionally distinct from every status hue so "evidence quality" never
 * reads as "danger".
 */
export const tokens: DesignTokens = {
  color: {
    // Neutral editorial palette (calm, trustworthy, high-contrast).
    background: "#ffffff",
    surface: "#ffffff",
    surfaceMuted: "#f5f6f7",
    border: "#d8dbe0",
    textPrimary: "#16181d", // ~15:1 on white
    textSecondary: "#464b54", // ~8.6:1 on white
    textMuted: "#5f656f", // ~6:1 on white

    // Brand / interactive — deep teal-blue, distinct from all status hues.
    brand: "#0f6f8c",
    brandHover: "#0b596f",
    onBrand: "#ffffff", // white on brand ≈ 4.9:1
    focusRing: "#0f6f8c",

    // Status: Safe (green).
    statusSafe: "#1f7a44",
    statusSafeSurface: "#eef7f1",
    statusSafeBorder: "#3f9e64",
    statusSafeForeground: "#0f5a30", // ≈ 6.7:1 on safe surface

    // Status: Caution (amber).
    statusCaution: "#b06a00",
    statusCautionSurface: "#fdf3e3",
    statusCautionBorder: "#d08a1f",
    statusCautionForeground: "#7a4a00", // ≈ 7.1:1 on caution surface

    // Status: Avoid (red).
    statusAvoid: "#c0342b",
    statusAvoidSurface: "#fdeeed",
    statusAvoidBorder: "#d75048",
    statusAvoidForeground: "#8f2019", // ≈ 6.9:1 on avoid surface

    // Confidence: neutral slate/indigo — NOT a status hue.
    confidenceNeutral: "#4b5563",
    confidenceNeutralSurface: "#f1f3f6",
    confidenceNeutralBorder: "#9aa2af",
    confidenceNeutralForeground: "#333a45", // ≈ 9:1 on confidence surface
  },

  typography: {
    fontSans:
      'ui-sans-serif, system-ui, -apple-system, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
    fontDisplay:
      'Georgia, "Times New Roman", ui-serif, serif',
    fontMono:
      'ui-monospace, SFMono-Regular, Menlo, Consolas, "Liberation Mono", monospace',
    numeric: "tabular-nums",
    scale: {
      display: {
        fontSize: "3rem",
        lineHeight: "1.08",
        fontWeight: 700,
        fontFamily: "display",
        letterSpacing: "-0.02em",
      },
      h1: {
        fontSize: "2.25rem",
        lineHeight: "1.15",
        fontWeight: 700,
        fontFamily: "sans",
        letterSpacing: "-0.015em",
      },
      h2: {
        fontSize: "1.5rem",
        lineHeight: "1.25",
        fontWeight: 600,
        fontFamily: "sans",
        letterSpacing: "-0.01em",
      },
      h3: {
        fontSize: "1.25rem",
        lineHeight: "1.3",
        fontWeight: 600,
        fontFamily: "sans",
      },
      body: {
        fontSize: "1rem",
        lineHeight: "1.6",
        fontWeight: 400,
        fontFamily: "sans",
      },
      label: {
        fontSize: "0.875rem",
        lineHeight: "1.4",
        fontWeight: 600,
        fontFamily: "sans",
      },
      caption: {
        fontSize: "0.8125rem",
        lineHeight: "1.4",
        fontWeight: 400,
        fontFamily: "sans",
      },
    },
  },

  space: {
    xs: "0.25rem",
    sm: "0.5rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
  },

  radius: {
    sm: "0.25rem",
    md: "0.5rem",
    lg: "0.75rem",
    full: "9999px",
  },

  shadow: {
    sm: "0 1px 2px 0 rgba(16, 24, 40, 0.06), 0 1px 3px 0 rgba(16, 24, 40, 0.1)",
    md: "0 4px 8px -2px rgba(16, 24, 40, 0.1), 0 2px 4px -2px rgba(16, 24, 40, 0.06)",
  },

  motion: {
    durationFast: "120ms",
    durationBase: "220ms",
    easing: "cubic-bezier(0.4, 0, 0.2, 1)",
    // Under prefers-reduced-motion, durations resolve to no motion (Requirement 4.6).
    reducedMotionDuration: "0ms",
  },

  breakpoints: {
    sm: "640px",
    md: "768px",
    lg: "1024px",
    xl: "1280px",
  },
};

export default tokens;
