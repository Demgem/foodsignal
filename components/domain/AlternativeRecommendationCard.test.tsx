import { render, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import fc from "fast-check";
import type { Product, AssessmentResult } from "@/lib/mock-data/types";
import {
  AlternativeRecommendationCard,
  ALTERNATIVE_DISCLOSURE,
} from "./AlternativeRecommendationCard";

/**
 * Task 6.5 — Property-based test for the alternative-disclosure invariant.
 *
 * Property 3: Alternative recommendation always discloses.
 * For ANY rendered alternative, the mandatory disclosure sentence
 * (`ALTERNATIVE_DISCLOSURE`) is present in the output. The component renders an
 * alternative only when it has a non-empty slug, so the generator constrains to
 * that renderable input space and asserts the disclosure is always present.
 *
 * Validates: Requirements 11.1, 11.2
 */

// A minimal-but-valid AssessmentResult so the generated Product is structurally
// complete. Its contents are irrelevant to this component (it reads only
// name/brand/slug), so a fixed minimal object keeps the generator focused.
const MINIMAL_ASSESSMENT: AssessmentResult = {
  product_id: "gen",
  market: "gen",
  status: "safe",
  score: 0,
  confidence: "insufficient",
  reasons: [],
  data_freshness: "1970-01-01",
  sources: [],
};

// Generator for a renderable alternative Product: arbitrary but valid
// name/brand/slug (slug non-empty so the card renders), empty arrays for all
// collection fields, and a minimal assessment object.
const ALTERNATIVE_ARBITRARY: fc.Arbitrary<Product> = fc.record({
  slug: fc.string({ minLength: 1 }).map((s) => s.trim() || "a"),
  name: fc.string({ minLength: 1 }),
  brand: fc.string(),
  market: fc.string(),
  ingredients: fc.constant([]),
  additives: fc.constant([]),
  nutrition: fc.constant([]),
  allergens: fc.constant([]),
  recalls: fc.constant([]),
  assessment: fc.constant(MINIMAL_ASSESSMENT),
  known: fc.constant([]),
  unknown: fc.constant([]),
  sources: fc.constant([]),
});

describe("AlternativeRecommendationCard — Property 3: alternative always discloses", () => {
  afterEach(() => {
    // Clean up the DOM between iterations so 100+ renders don't leak nodes.
    cleanup();
  });

  it("always renders the mandatory disclosure sentence for any rendered alternative", () => {
    fc.assert(
      fc.property(ALTERNATIVE_ARBITRARY, (alternative) => {
        const { container } = render(
          <AlternativeRecommendationCard alternative={alternative} />
        );

        const text = container.textContent ?? "";
        // R11.1 / R11.2: the exact disclosure sentence is ALWAYS present.
        expect(text).toContain(ALTERNATIVE_DISCLOSURE);

        // Clean up this iteration's render before the next run.
        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("renders the alternative's name alongside the disclosure (example)", () => {
    const alternative: Product = {
      slug: "oat-milk-original",
      name: "Oat Milk Original",
      brand: "Sample Brand",
      market: "eu",
      ingredients: [],
      additives: [],
      nutrition: [],
      allergens: [],
      recalls: [],
      assessment: MINIMAL_ASSESSMENT,
      known: [],
      unknown: [],
      sources: [],
    };

    const { container } = render(
      <AlternativeRecommendationCard alternative={alternative} />
    );

    const text = container.textContent ?? "";
    expect(text).toContain(ALTERNATIVE_DISCLOSURE);
    expect(text).toContain("Oat Milk Original");
  });
});
