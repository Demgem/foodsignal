import { render, cleanup } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import fc from "fast-check";
import type { Recall } from "@/lib/mock-data/types";
import { RecallBanner } from "./RecallBanner";

/**
 * Property 2: Active recall is always surfaced.
 *
 * For any non-empty set of active recalls, the rendered RecallBanner surfaces a
 * visible recall notice — it is never suppressed. RecallBanner is a pure
 * presentational component, so this verifies the banner itself always renders
 * for active recalls. The page-level "not suppressed by score" behaviour is
 * covered by the product-page test (13.x).
 *
 * Validates: Requirements 8.1, 8.2, 13.1
 */

/**
 * Arbitrary that builds a `Recall`-shaped object with `active: true` and
 * non-empty productName/market/reason strings. slug/date/sources are fixed to
 * simple valid values since they are not the subject of this property.
 */
const activeRecallArb: fc.Arbitrary<Recall> = fc.record({
  // Unique-per-item slug keeps React keys distinct; slug value is not the
  // subject of this property.
  slug: fc.uuid(),
  productName: fc.string({ minLength: 1 }),
  market: fc.string({ minLength: 1 }),
  reason: fc.string({ minLength: 1 }),
  active: fc.constant(true),
  date: fc.constant("2024-01-01"),
  sources: fc.constant([]),
});

describe("RecallBanner — Property 2: active recall is always surfaced", () => {
  it("always renders a visible recall notice for any non-empty set of active recalls", () => {
    fc.assert(
      fc.property(
        fc.array(activeRecallArb, { minLength: 1, maxLength: 6 }),
        (recalls) => {
          const { container } = render(<RecallBanner recalls={recalls} />);
          try {
            // Banner present: rendered output is non-empty (not null).
            expect(container.textContent).not.toBe("");
            expect(container.querySelector("section")).not.toBeNull();

            // The recall notice heading is surfaced (matches /recall/i). The
            // heading id is generated per-instance via React's useId(), so we
            // locate it via the region's aria-labelledby rather than a fixed id.
            const region = container.querySelector('[role="region"]');
            expect(region).not.toBeNull();
            const labelledBy = region?.getAttribute("aria-labelledby") ?? "";
            expect(labelledBy).not.toBe("");
            const heading = container.querySelector(
              `#${CSS.escape(labelledBy)}`,
            );
            expect(heading).not.toBeNull();
            expect(heading?.textContent ?? "").toMatch(/recall/i);

            // Each recall's product name appears in the rendered output.
            const text = container.textContent ?? "";
            for (const recall of recalls) {
              expect(text).toContain(recall.productName);
            }
          } finally {
            cleanup();
          }
        }
      ),
      { numRuns: 100 }
    );
  });

  it("renders nothing (null) for an empty array of recalls", () => {
    const { container } = render(<RecallBanner recalls={[]} />);
    try {
      expect(container.textContent).toBe("");
      expect(container.querySelector("section")).toBeNull();
    } finally {
      cleanup();
    }
  });
});
