/**
 * Design-token contract for the FoodSignal prototype.
 *
 * These types describe the SHAPE of the design-token system. Concrete values
 * are defined in `values.ts`. Tokens are the single source of truth for visual
 * style and are surfaced both as CSS variables (see `app/globals.css`, generated
 * via `cssVariables.ts`) and through the Tailwind theme (see `tailwind.config.ts`).
 *
 * Requirements: 4.1 (token categories), 4.2 (Tailwind + CSS vars),
 * 4.3 (distinct status families), 4.4 (neutral confidence family),
 * 4.5 (focus-ring tokens), 4.6 (reduced-motion resolution), 5.1 (type scale).
 */

/** Spacing scale keys. */
export type SpaceKey = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

/** Border-radius keys. */
export type RadiusKey = "sm" | "md" | "lg" | "full";

/** Shadow keys. */
export type ShadowKey = "sm" | "md";

/** Responsive breakpoint keys. */
export type BreakpointKey = "sm" | "md" | "lg" | "xl";

/** Roles in the typographic scale (Requirement 5.1). */
export type TypeScaleRole =
  | "display"
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "label"
  | "caption";

/** Which font family a type role resolves to. */
export type FontFamilyRole = "sans" | "display" | "mono";

/**
 * A single typographic style. Numeric contexts opt into tabular figures so that
 * digits align (Requirement 5.3).
 */
export interface TypeStyle {
  fontSize: string;
  lineHeight: string;
  fontWeight: number;
  fontFamily: FontFamilyRole;
  /** Letter spacing (optional; e.g. tightened display headings). */
  letterSpacing?: string;
  /** When true, this role renders numbers with tabular figures. */
  tabularNums?: boolean;
}

/** The full typographic scale keyed by role. */
export type TypeScaleTokens = Record<TypeScaleRole, TypeStyle>;

/**
 * Color tokens.
 *
 * Status families (Safe / Caution / Avoid) MUST be visually distinct from the
 * neutral confidence family (Requirements 4.3, 4.4). Each status family exposes
 * a surface, border, and foreground shade so it can satisfy WCAG 2.2 AA contrast
 * (4.5:1 text, 3:1 large text / UI) regardless of how it is composed.
 */
export interface ColorTokens {
  // Neutral editorial palette.
  background: string;
  surface: string;
  surfaceMuted: string;
  border: string;
  textPrimary: string;
  textSecondary: string;
  textMuted: string;

  // Brand / interactive.
  brand: string;
  brandHover: string;
  onBrand: string;
  /** Focus-ring color used to render a visible focus indicator (Requirement 4.5). */
  focusRing: string;

  // Status families — reinforcement only, never the sole signal (Requirement 4.3).
  statusSafe: string;
  statusSafeSurface: string;
  statusSafeBorder: string;
  statusSafeForeground: string;

  statusCaution: string;
  statusCautionSurface: string;
  statusCautionBorder: string;
  statusCautionForeground: string;

  statusAvoid: string;
  statusAvoidSurface: string;
  statusAvoidBorder: string;
  statusAvoidForeground: string;

  // Confidence — neutral, distinct from status (evidence quality, not danger).
  confidenceNeutral: string;
  confidenceNeutralSurface: string;
  confidenceNeutralBorder: string;
  confidenceNeutralForeground: string;
}

export interface TypographyTokens {
  fontSans: string;
  fontDisplay: string;
  fontMono: string;
  scale: TypeScaleTokens;
  /** Numeric values use tabular figures (Requirement 5.3). */
  numeric: "tabular-nums";
}

/**
 * Motion tokens.
 *
 * Under `prefers-reduced-motion`, durations resolve to `0ms` (Requirement 4.6).
 * The CSS-variable layer handles this at runtime via a media query; the values
 * here are the "full motion" defaults.
 */
export interface MotionTokens {
  durationFast: string;
  durationBase: string;
  easing: string;
  /** Duration value applied when reduced motion is preferred (resolves to no motion). */
  reducedMotionDuration: string;
}

export interface DesignTokens {
  color: ColorTokens;
  typography: TypographyTokens;
  space: Record<SpaceKey, string>;
  radius: Record<RadiusKey, string>;
  shadow: Record<ShadowKey, string>;
  motion: MotionTokens;
  breakpoints: Record<BreakpointKey, string>;
}
