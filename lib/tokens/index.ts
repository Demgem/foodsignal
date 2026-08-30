/**
 * FoodSignal design-token system.
 *
 * Single source of truth for color, typography, spacing, radius, shadow, motion,
 * and breakpoint values. Tokens are surfaced two ways (Requirement 4.2):
 *   1. As CSS variables declared in `app/globals.css`.
 *   2. Through the Tailwind theme in `tailwind.config.ts`, which references the
 *      CSS variables so Tailwind utilities and raw CSS stay in lockstep.
 */
export * from "./types";
export { tokens, default as designTokens } from "./values";
export { cssVariableMap, renderRootCssVariables } from "./cssVariables";
