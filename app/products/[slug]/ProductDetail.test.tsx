import { render, cleanup } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import fc from "fast-check";

import type { Product } from "@/lib/mock-data/types";
import { listProducts, getMockProfile } from "@/lib/mock-data";

import { ProductDetail } from "./ProductDetail";

/**
 * Property 4: Product page section order is invariant.
 *
 * For any product, `ProductDetail` renders the 17 sections in the exact
 * specified order (Requirement 13.1). Each section is wrapped in a
 * `<section data-section="…">`, so we render the component, read every
 * `[data-section]` element in DOM order, extract its `data-section` value, and
 * assert the resulting sequence equals the expected 17-section order exactly.
 *
 * The invariant must hold regardless of a product's optional content — whether
 * it has an active recall or not, whether the profile matches a declared
 * allergen or not, and whether ingredients / additives / nutrition / allergens
 * / sources are populated or empty. The generator therefore exercises the real
 * mock products AND transformed variants that toggle those fields, since some
 * sections render conditional "empty state" copy that must NOT change the set
 * or order of rendered sections.
 *
 * Validates: Requirements 13.1
 */

/**
 * The expected 17-section order. This mirrors `SECTION_ORDER` in
 * `ProductDetail.tsx`; the test asserts the rendered DOM matches it exactly.
 * Kept as a literal here (rather than imported) so the test independently
 * pins the contract.
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

const baseProducts = listProducts();
const profile = getMockProfile();

/**
 * Build a varied `Product` by starting from a real mock product and applying a
 * set of independent toggles that flip the optional content driving the
 * conditional branches inside `ProductDetail`. None of these toggles should
 * ever add, remove, or reorder a `data-section` — that is exactly the invariant
 * under test.
 */
function makeVariant(
  base: Product,
  toggles: {
    clearRecalls: boolean;
    activateRecalls: boolean;
    clearIngredients: boolean;
    clearAdditives: boolean;
    clearNutrition: boolean;
    clearAllergens: boolean;
    declareAllProfileAllergens: boolean;
    clearSources: boolean;
    clearReasons: boolean;
    clearKnownUnknown: boolean;
    dropAlternatives: boolean;
    dropOptionalIdentity: boolean;
  },
): Product {
  let recalls = base.recalls;
  if (toggles.clearRecalls) {
    recalls = [];
  } else if (toggles.activateRecalls) {
    recalls = base.recalls.map((r) => ({ ...r, active: true }));
  }

  let allergens = toggles.clearAllergens ? [] : base.allergens;
  if (toggles.declareAllProfileAllergens && !toggles.clearAllergens) {
    // Force a profile allergen match so the personalized WarningPanel renders
    // inside the Allergens section (must not change section order). Any of the
    // profile's allergens already present on the product are re-declared in
    // place; the rest are appended. This keeps allergen names unique so React
    // keys stay distinct.
    const wanted = new Set(
      (profile.allergies ?? []).map((a) => a.trim().toLowerCase()),
    );
    const existing = new Set(
      base.allergens.map((a) => a.name.trim().toLowerCase()),
    );
    const reDeclared = base.allergens.map((a) =>
      wanted.has(a.name.trim().toLowerCase()) ? { ...a, declared: true } : a,
    );
    const additions = (profile.allergies ?? [])
      .filter((name) => !existing.has(name.trim().toLowerCase()))
      .map((name) => ({ name, declared: true }));
    allergens = [...reDeclared, ...additions];
  }

  return {
    ...base,
    barcode: toggles.dropOptionalIdentity ? undefined : base.barcode,
    imageUrl: toggles.dropOptionalIdentity ? undefined : base.imageUrl,
    ingredients: toggles.clearIngredients ? [] : base.ingredients,
    additives: toggles.clearAdditives ? [] : base.additives,
    nutrition: toggles.clearNutrition ? [] : base.nutrition,
    allergens,
    recalls,
    sources: toggles.clearSources ? [] : base.sources,
    known: toggles.clearKnownUnknown ? [] : base.known,
    unknown: toggles.clearKnownUnknown ? [] : base.unknown,
    alternatives: toggles.dropAlternatives ? undefined : base.alternatives,
    assessment: {
      ...base.assessment,
      reasons: toggles.clearReasons ? [] : base.assessment.reasons,
    },
  };
}

/** Arbitrary yielding varied products: a real mock product + independent toggles. */
const productArb: fc.Arbitrary<Product> = fc
  .record({
    base: fc.constantFrom(...baseProducts),
    clearRecalls: fc.boolean(),
    activateRecalls: fc.boolean(),
    clearIngredients: fc.boolean(),
    clearAdditives: fc.boolean(),
    clearNutrition: fc.boolean(),
    clearAllergens: fc.boolean(),
    declareAllProfileAllergens: fc.boolean(),
    clearSources: fc.boolean(),
    clearReasons: fc.boolean(),
    clearKnownUnknown: fc.boolean(),
    dropAlternatives: fc.boolean(),
    dropOptionalIdentity: fc.boolean(),
  })
  .map(({ base, ...toggles }) => makeVariant(base, toggles));

describe("ProductDetail — Property 4: product page section order is invariant", () => {
  it("renders exactly the 17 sections in the specified order for any product variant", () => {
    fc.assert(
      fc.property(productArb, (product) => {
        const { container } = render(
          <ProductDetail product={product} profile={profile} />,
        );
        try {
          const rendered = Array.from(
            container.querySelectorAll("[data-section]"),
          ).map((el) => el.getAttribute("data-section"));

          expect(rendered).toEqual([...EXPECTED_SECTION_ORDER]);
        } finally {
          cleanup();
        }
      }),
      { numRuns: 200 },
    );
  });

  it("renders the 17 sections in order for each real mock product (spot check)", () => {
    for (const product of baseProducts) {
      const { container } = render(
        <ProductDetail product={product} profile={profile} />,
      );
      try {
        const rendered = Array.from(
          container.querySelectorAll("[data-section]"),
        ).map((el) => el.getAttribute("data-section"));

        expect(rendered).toEqual([...EXPECTED_SECTION_ORDER]);
      } finally {
        cleanup();
      }
    }
  });
});
