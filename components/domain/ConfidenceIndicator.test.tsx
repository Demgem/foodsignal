import { cleanup, render } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import fc from "fast-check";

import {
  ConfidenceIndicator,
  CONFIDENCE_MEANING_TEXT,
} from "./ConfidenceIndicator";
import type { ConfidenceLevel } from "@/lib/mock-data";

/**
 * Property 5: Confidence is visually separated from status.
 *
 * For any ConfidenceLevel, the rendered ConfidenceIndicator uses the neutral
 * confidence treatment (never a status color family) and, when described,
 * includes copy stating confidence describes evidence quality, not danger.
 *
 * Validates: Requirements 7.2, 7.4
 */

// Generator constrained to the exact ConfidenceLevel input space.
const confidenceLevel = (): fc.Arbitrary<ConfidenceLevel> =>
  fc.constantFrom<ConfidenceLevel>(
    "very_high",
    "high",
    "moderate",
    "low",
    "insufficient",
  );

// Status color families that confidence must NEVER use.
const STATUS_CLASS_FRAGMENTS = ["status-safe", "status-caution", "status-avoid"];

afterEach(() => {
  cleanup();
});

describe("ConfidenceIndicator — Property 5: separated from status", () => {
  it("never uses a status color family for any confidence level", () => {
    fc.assert(
      fc.property(confidenceLevel(), (level) => {
        const { container } = render(<ConfidenceIndicator level={level} />);
        try {
          const html = container.innerHTML;

          // No status color family classes anywhere in the rendered markup.
          for (const fragment of STATUS_CLASS_FRAGMENTS) {
            expect(html).not.toContain(fragment);
          }

          // Uses the neutral confidence treatment (confidence-* token classes
          // and/or the data-confidence attribute).
          const confidenceEl = container.querySelector('[class*="confidence"]');
          expect(confidenceEl).not.toBeNull();
          expect(
            container.querySelector(`[data-confidence="${level}"]`),
          ).not.toBeNull();
        } finally {
          cleanup();
        }
      }),
      { numRuns: 150 },
    );
  });

  it("includes evidence-quality-not-danger copy when described", () => {
    fc.assert(
      fc.property(confidenceLevel(), (level) => {
        const { container } = render(
          <ConfidenceIndicator level={level} showDescription />,
        );
        try {
          // Still neutral, never a status family.
          const html = container.innerHTML;
          for (const fragment of STATUS_CLASS_FRAGMENTS) {
            expect(html).not.toContain(fragment);
          }

          // The exact clarifying copy is present in the rendered output.
          expect(container.textContent ?? "").toContain(CONFIDENCE_MEANING_TEXT);
        } finally {
          cleanup();
        }
      }),
      { numRuns: 150 },
    );
  });
});
