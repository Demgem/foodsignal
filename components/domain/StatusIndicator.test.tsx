import { render, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import fc from "fast-check";
import type { AssessmentStatus } from "@/lib/mock-data";
import { StatusIndicator } from "./StatusIndicator";

/**
 * Task 5.2 — Property-based test for the status text + icon invariant.
 *
 * Property 1: Status is never color-only.
 * For any `AssessmentStatus`, the rendered `StatusIndicator` output contains a
 * non-empty visible text label AND a non-color icon/shape (an SVG) indicator,
 * so status is distinguishable without relying on color.
 *
 * Validates: Requirements 6.1, 6.2, 6.3, 6.4, 20.6
 */

const STATUS_ARBITRARY = fc.constantFrom<AssessmentStatus>(
  "safe",
  "caution",
  "avoid"
);

// Every status must present a non-empty, human-readable label.
const EXPECTED_LABELS: Record<AssessmentStatus, RegExp> = {
  safe: /^Safe$/,
  caution: /^Caution$/,
  avoid: /^Avoid$/,
};

describe("StatusIndicator — Property 1: status is never color-only", () => {
  afterEach(() => {
    // Clean up the DOM between iterations so 100 renders don't leak nodes.
    cleanup();
  });

  it("always renders a non-empty text label AND an SVG shape for any status", () => {
    fc.assert(
      fc.property(STATUS_ARBITRARY, (status) => {
        const { container } = render(<StatusIndicator status={status} />);

        // 1) A non-color SHAPE indicator is present (SVG element).
        const svg = container.querySelector("svg");
        expect(svg).not.toBeNull();

        // 2) A non-empty, visible TEXT label is present, and it names one of
        //    the three statuses (Safe / Caution / Avoid).
        const text = container.textContent ?? "";
        expect(text.trim().length).toBeGreaterThan(0);
        expect(text).toMatch(/Safe|Caution|Avoid/);
        expect(text).toMatch(EXPECTED_LABELS[status]);

        // Clean up this iteration's render before the next run.
        cleanup();
      }),
      { numRuns: 100 }
    );
  });
});
