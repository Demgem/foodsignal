import { describe, it, expect } from "vitest";

import {
  tokens,
  cssVariableMap,
  renderRootCssVariables,
} from "@/lib/tokens";

/**
 * Unit tests for the design-token system (Task 2.2).
 *
 * Covers:
 *  - Status color families are DISTINCT from the neutral confidence family
 *    (Requirements 4.3, 4.4).
 *  - The focus-ring token is present and non-empty (Requirement 4.5).
 *  - Reduced-motion token resolves to no motion (Requirement 4.6).
 *  - The CSS-variable map / rendered `:root` block exposes the key tokens
 *    (Requirements 4.2, 4.5, 4.6).
 */

describe("status color families are distinct from the confidence family", () => {
  const { color } = tokens;

  const statusValues = [
    color.statusSafe,
    color.statusSafeSurface,
    color.statusSafeBorder,
    color.statusSafeForeground,
    color.statusCaution,
    color.statusCautionSurface,
    color.statusCautionBorder,
    color.statusCautionForeground,
    color.statusAvoid,
    color.statusAvoidSurface,
    color.statusAvoidBorder,
    color.statusAvoidForeground,
  ];

  const confidenceValues = [
    color.confidenceNeutral,
    color.confidenceNeutralSurface,
    color.confidenceNeutralBorder,
    color.confidenceNeutralForeground,
  ];

  it("shares no color value between any status family and the confidence family", () => {
    for (const statusColor of statusValues) {
      expect(confidenceValues).not.toContain(statusColor);
    }
  });

  it("uses distinct values for each confidence shade vs. the status palette", () => {
    for (const confidenceColor of confidenceValues) {
      expect(statusValues).not.toContain(confidenceColor);
    }
  });

  it("keeps each status family's core color distinct from the neutral confidence color", () => {
    expect(color.statusSafe).not.toBe(color.confidenceNeutral);
    expect(color.statusCaution).not.toBe(color.confidenceNeutral);
    expect(color.statusAvoid).not.toBe(color.confidenceNeutral);
  });
});

describe("focus-ring token", () => {
  it("is present and non-empty", () => {
    expect(tokens.color.focusRing).toBeTruthy();
    expect(typeof tokens.color.focusRing).toBe("string");
    expect(tokens.color.focusRing.trim().length).toBeGreaterThan(0);
  });

  it("is exposed as a CSS variable", () => {
    expect(cssVariableMap["--color-focus-ring"]).toBe(tokens.color.focusRing);
  });
});

describe("reduced-motion resolution", () => {
  it("resolves the reduced-motion token to no motion", () => {
    expect(tokens.motion.reducedMotionDuration).toBe("0ms");
  });
});

describe("cssVariableMap exposes the key tokens", () => {
  it("exposes the focus-ring color", () => {
    expect(cssVariableMap).toHaveProperty("--color-focus-ring");
  });

  it("exposes the status color families", () => {
    const statusVars = [
      "--color-status-safe",
      "--color-status-safe-surface",
      "--color-status-safe-border",
      "--color-status-safe-foreground",
      "--color-status-caution",
      "--color-status-caution-surface",
      "--color-status-caution-border",
      "--color-status-caution-foreground",
      "--color-status-avoid",
      "--color-status-avoid-surface",
      "--color-status-avoid-border",
      "--color-status-avoid-foreground",
    ];
    for (const name of statusVars) {
      expect(cssVariableMap).toHaveProperty(name);
      expect(cssVariableMap[name]).toBeTruthy();
    }
  });

  it("exposes the confidence color family", () => {
    const confidenceVars = [
      "--color-confidence-neutral",
      "--color-confidence-neutral-surface",
      "--color-confidence-neutral-border",
      "--color-confidence-neutral-foreground",
    ];
    for (const name of confidenceVars) {
      expect(cssVariableMap).toHaveProperty(name);
      expect(cssVariableMap[name]).toBeTruthy();
    }
  });

  it("exposes the motion/duration variables, including the reduced-motion duration", () => {
    expect(cssVariableMap["--motion-duration-fast"]).toBe(
      tokens.motion.durationFast,
    );
    expect(cssVariableMap["--motion-duration-base"]).toBe(
      tokens.motion.durationBase,
    );
    expect(cssVariableMap["--motion-reduced-duration"]).toBe(
      tokens.motion.reducedMotionDuration,
    );
    expect(cssVariableMap["--motion-reduced-duration"]).toBe("0ms");
  });
});

describe("renderRootCssVariables output", () => {
  const css = renderRootCssVariables();

  it("wraps the declarations in a :root block", () => {
    expect(css.startsWith(":root {")).toBe(true);
    expect(css.trimEnd().endsWith("}")).toBe(true);
  });

  it("contains the key token declarations", () => {
    expect(css).toContain(`--color-focus-ring: ${tokens.color.focusRing};`);
    expect(css).toContain(`--color-status-safe: ${tokens.color.statusSafe};`);
    expect(css).toContain(
      `--color-status-caution: ${tokens.color.statusCaution};`,
    );
    expect(css).toContain(`--color-status-avoid: ${tokens.color.statusAvoid};`);
    expect(css).toContain(
      `--color-confidence-neutral: ${tokens.color.confidenceNeutral};`,
    );
    expect(css).toContain(
      `--motion-reduced-duration: ${tokens.motion.reducedMotionDuration};`,
    );
    expect(css).toContain("--motion-reduced-duration: 0ms;");
  });
});
