import { render, cleanup, within } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";

import {
  productWithAllergenMatch,
  mockProfile,
  getMockProfile,
} from "@/lib/mock-data";

import { ProductDetail } from "./ProductDetail";

/**
 * Task 13.3 — Example-based component test for `ProductDetail`.
 *
 * Where the sibling `ProductDetail.test.tsx` (Task 13.2) proves the
 * section-order invariant holds for *any* product via property-based testing,
 * this file pins the same contract with a concrete, representative example and
 * additionally verifies the personalized allergen warning behaviour:
 *
 *   1. Rendering `ProductDetail` with a representative product
 *      (`productWithAllergenMatch`) and the mock profile shows exactly the 17
 *      sections in the specified order (Requirement 13.1).
 *   2. Because `productWithAllergenMatch` declares an allergen that matches
 *      `mockProfile.allergies`, the personalized `WarningPanel` renders inside
 *      the Allergens section with its "Personalized allergen warning" heading
 *      (Requirement 13.4).
 *
 * Validates: Requirements 13.1, 13.4
 */

/**
 * The expected 17-section order (Requirement 13.1). Pinned as a literal here so
 * this example test independently asserts the contract rather than importing
 * `SECTION_ORDER` from the component under test.
 */
const EXPECTED_SECTION_ORDER = [
  "product-identity",
  "market-country",
  "assessment-status",
  "score",
  "key-reasons",
  "ingredients",
  "ingredient-explanations",
  "additives",
  "nutrition",
  "allergens",
  "safety-regulatory-checks",
  "recalls",
  "potential-health-concerns",
  "evidence-confidence",
  "sources",
  "data-freshness",
  "report-correction",
] as const;

afterEach(() => {
  cleanup();
});

describe("ProductDetail — 17-section order and personalized allergen warning (example-based)", () => {
  it("renders exactly the 17 sections in the specified order for a representative product", () => {
    const { container } = render(
      <ProductDetail product={productWithAllergenMatch} profile={getMockProfile()} />,
    );

    const rendered = Array.from(
      container.querySelectorAll("[data-section]"),
    ).map((el) => el.getAttribute("data-section"));

    expect(rendered).toEqual([...EXPECTED_SECTION_ORDER]);
  });

  it("shows the personalized WarningPanel in the Allergens section when the profile matches a declared allergen", () => {
    // Sanity-check the fixture premise: the product declares an allergen that
    // matches the mock profile (case-insensitive). This is what should trigger
    // the personalized WarningPanel (Requirement 13.4).
    const profileAllergies = mockProfile.allergies.map((a) =>
      a.trim().toLowerCase(),
    );
    const declaredMatch = productWithAllergenMatch.allergens.some(
      (allergen) =>
        allergen.declared &&
        profileAllergies.includes(allergen.name.trim().toLowerCase()),
    );
    expect(declaredMatch).toBe(true);

    const { container } = render(
      <ProductDetail product={productWithAllergenMatch} profile={mockProfile} />,
    );

    // The WarningPanel lives inside the Allergens section.
    const allergensSection = container.querySelector(
      '[data-section="allergens"]',
    );
    expect(allergensSection).not.toBeNull();

    const heading = within(allergensSection as HTMLElement).getByText(
      "Personalized allergen warning",
    );
    expect(heading).toBeTruthy();

    // The panel surfaces the confirmed declared-allergen match wording. There
    // may be more than one declared match, so allow one or more.
    const matchItems = within(allergensSection as HTMLElement).getAllByText(
      /is a\s+declared allergen in this product and matches your profile/i,
    );
    expect(matchItems.length).toBeGreaterThan(0);
  });
});
