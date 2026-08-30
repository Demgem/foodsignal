import { tokens } from "./values";

/**
 * Canonical CSS-variable names for the design tokens.
 *
 * Both `app/globals.css` (the declaration side) and `tailwind.config.ts` (the
 * consumption side) reference these names, so the two stay in lockstep and the
 * token values remain a single source of truth (Requirement 4.2).
 *
 * The map below is the source of truth for VALUES. The literal names used in
 * `tailwind.config.ts` must match the keys emitted here (kept in sync manually
 * because Tailwind config must be statically analyzable).
 */
export const cssVariableMap: Record<string, string> = {
  // Neutral palette
  "--color-background": tokens.color.background,
  "--color-surface": tokens.color.surface,
  "--color-surface-muted": tokens.color.surfaceMuted,
  "--color-border": tokens.color.border,
  "--color-text-primary": tokens.color.textPrimary,
  "--color-text-secondary": tokens.color.textSecondary,
  "--color-text-muted": tokens.color.textMuted,

  // Brand / interactive
  "--color-brand": tokens.color.brand,
  "--color-brand-hover": tokens.color.brandHover,
  "--color-on-brand": tokens.color.onBrand,
  "--color-focus-ring": tokens.color.focusRing,

  // Status: Safe
  "--color-status-safe": tokens.color.statusSafe,
  "--color-status-safe-surface": tokens.color.statusSafeSurface,
  "--color-status-safe-border": tokens.color.statusSafeBorder,
  "--color-status-safe-foreground": tokens.color.statusSafeForeground,

  // Status: Caution
  "--color-status-caution": tokens.color.statusCaution,
  "--color-status-caution-surface": tokens.color.statusCautionSurface,
  "--color-status-caution-border": tokens.color.statusCautionBorder,
  "--color-status-caution-foreground": tokens.color.statusCautionForeground,

  // Status: Avoid
  "--color-status-avoid": tokens.color.statusAvoid,
  "--color-status-avoid-surface": tokens.color.statusAvoidSurface,
  "--color-status-avoid-border": tokens.color.statusAvoidBorder,
  "--color-status-avoid-foreground": tokens.color.statusAvoidForeground,

  // Confidence: neutral
  "--color-confidence-neutral": tokens.color.confidenceNeutral,
  "--color-confidence-neutral-surface": tokens.color.confidenceNeutralSurface,
  "--color-confidence-neutral-border": tokens.color.confidenceNeutralBorder,
  "--color-confidence-neutral-foreground":
    tokens.color.confidenceNeutralForeground,

  // Typography — families
  "--font-sans": tokens.typography.fontSans,
  "--font-display": tokens.typography.fontDisplay,
  "--font-mono": tokens.typography.fontMono,

  // Spacing
  "--space-xs": tokens.space.xs,
  "--space-sm": tokens.space.sm,
  "--space-md": tokens.space.md,
  "--space-lg": tokens.space.lg,
  "--space-xl": tokens.space.xl,
  "--space-2xl": tokens.space["2xl"],

  // Radius
  "--radius-sm": tokens.radius.sm,
  "--radius-md": tokens.radius.md,
  "--radius-lg": tokens.radius.lg,
  "--radius-full": tokens.radius.full,

  // Shadow
  "--shadow-sm": tokens.shadow.sm,
  "--shadow-md": tokens.shadow.md,

  // Motion — full-motion defaults. Reduced-motion resolution happens in CSS.
  "--motion-duration-fast": tokens.motion.durationFast,
  "--motion-duration-base": tokens.motion.durationBase,
  "--motion-easing": tokens.motion.easing,
  "--motion-reduced-duration": tokens.motion.reducedMotionDuration,
};

/**
 * Render the `:root` CSS variable block as a string.
 *
 * Kept as a helper so the same declarations can be inspected in tests
 * (optional task 2.2) and, if desired, injected at build time. The values are
 * also mirrored statically in `app/globals.css`.
 */
export function renderRootCssVariables(): string {
  const lines = Object.entries(cssVariableMap)
    .map(([name, value]) => `  ${name}: ${value};`)
    .join("\n");
  return `:root {\n${lines}\n}`;
}

export default cssVariableMap;
