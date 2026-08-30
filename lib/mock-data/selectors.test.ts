import { describe, it, expect } from "vitest";

import {
  getProductBySlug,
  getIngredientBySlug,
  getAdditiveBySlug,
  getRecallBySlug,
  listRecalls,
  listProducts,
  getMockProfile,
  productWithActiveRecall,
  productWithAllergenMatch,
  productWithAlternative,
  mockProfile,
} from "@/lib/mock-data";
import type {
  Product,
  Ingredient,
  Additive,
  Recall,
  UserProfile,
} from "@/lib/mock-data/types";

/**
 * Unit tests for the mock-data selectors and the three REQUIRED fixtures.
 *
 * Coverage:
 *  - Each `get*BySlug` returns typed data for a known slug and `null` for an
 *    unknown slug (R23.3, R23.5).
 *  - The three required fixtures satisfy their documented guarantees (R23.2).
 *  - `listRecalls()` returns all recalls including at least one active, and
 *    `getMockProfile()` returns the mock profile (R23.3).
 *
 * Requirements: 23.2, 23.3, 23.5
 */

describe("get*BySlug selectors (R23.3, R23.5)", () => {
  describe("getProductBySlug", () => {
    it("returns a typed Product for a known slug", () => {
      const product = getProductBySlug("orchard-crunch-granola");
      expect(product).not.toBeNull();
      // Narrow and assert the shape is a typed Product.
      const p = product as Product;
      expect(p.slug).toBe("orchard-crunch-granola");
      expect(typeof p.name).toBe("string");
      expect(typeof p.brand).toBe("string");
      expect(Array.isArray(p.ingredients)).toBe(true);
      expect(p.assessment).toBeDefined();
    });

    it("returns null for an unknown slug", () => {
      expect(getProductBySlug("does-not-exist")).toBeNull();
    });
  });

  describe("getIngredientBySlug", () => {
    it("returns a typed Ingredient for a known slug", () => {
      const ingredient = getIngredientBySlug("hazelnut");
      expect(ingredient).not.toBeNull();
      const i = ingredient as Ingredient;
      expect(i.slug).toBe("hazelnut");
      expect(typeof i.name).toBe("string");
      expect(typeof i.explanation).toBe("string");
      expect(Array.isArray(i.sources)).toBe(true);
    });

    it("returns null for an unknown slug", () => {
      expect(getIngredientBySlug("unknown-ingredient")).toBeNull();
    });
  });

  describe("getAdditiveBySlug", () => {
    it("returns a typed Additive for a known slug", () => {
      const additive = getAdditiveBySlug("aspartame");
      expect(additive).not.toBeNull();
      const a = additive as Additive;
      expect(a.slug).toBe("aspartame");
      expect(typeof a.name).toBe("string");
      expect(typeof a.explanation).toBe("string");
      expect(Array.isArray(a.sources)).toBe(true);
    });

    it("returns null for an unknown slug", () => {
      expect(getAdditiveBySlug("unknown-additive")).toBeNull();
    });
  });

  describe("getRecallBySlug", () => {
    it("returns a typed Recall for a known slug", () => {
      const recall = getRecallBySlug("orchard-crunch-granola-2024");
      expect(recall).not.toBeNull();
      const r = recall as Recall;
      expect(r.slug).toBe("orchard-crunch-granola-2024");
      expect(typeof r.productName).toBe("string");
      expect(typeof r.reason).toBe("string");
      expect(typeof r.active).toBe("boolean");
    });

    it("returns null for an unknown slug", () => {
      expect(getRecallBySlug("unknown-recall")).toBeNull();
    });
  });
});

describe("required fixtures satisfy their guarantees (R23.2)", () => {
  it("productWithActiveRecall exists and has at least one active recall", () => {
    expect(productWithActiveRecall).toBeDefined();
    expect(Array.isArray(productWithActiveRecall.recalls)).toBe(true);
    const activeRecalls = productWithActiveRecall.recalls.filter(
      (r) => r.active === true,
    );
    expect(activeRecalls.length).toBeGreaterThanOrEqual(1);
  });

  it("productWithAllergenMatch declares an allergen matching mockProfile.allergies (case-insensitive)", () => {
    expect(productWithAllergenMatch).toBeDefined();

    const profileAllergies = mockProfile.allergies.map((a) => a.toLowerCase());
    const declaredMatches = productWithAllergenMatch.allergens.filter(
      (allergen) =>
        allergen.declared === true &&
        profileAllergies.includes(allergen.name.toLowerCase()),
    );

    expect(declaredMatches.length).toBeGreaterThanOrEqual(1);
  });

  it("productWithAlternative has a non-empty alternatives array", () => {
    expect(productWithAlternative).toBeDefined();
    expect(Array.isArray(productWithAlternative.alternatives)).toBe(true);
    expect(productWithAlternative.alternatives?.length ?? 0).toBeGreaterThanOrEqual(
      1,
    );
  });
});

describe("listing and profile selectors (R23.3)", () => {
  it("listRecalls() returns all recalls including at least one active", () => {
    const recalls = listRecalls();
    expect(Array.isArray(recalls)).toBe(true);
    expect(recalls.length).toBeGreaterThanOrEqual(1);
    // Every known recall slug is resolvable, confirming completeness.
    for (const recall of recalls) {
      expect(getRecallBySlug(recall.slug)).not.toBeNull();
    }
    const activeCount = recalls.filter((r) => r.active).length;
    expect(activeCount).toBeGreaterThanOrEqual(1);
  });

  it("listProducts() returns all products and each is resolvable by slug", () => {
    const products = listProducts();
    expect(Array.isArray(products)).toBe(true);
    expect(products.length).toBeGreaterThanOrEqual(1);
    for (const product of products) {
      expect(getProductBySlug(product.slug)).not.toBeNull();
    }
  });

  it("getMockProfile() returns the mock profile", () => {
    const profile = getMockProfile();
    expect(profile).toBe(mockProfile);
    const p = profile as UserProfile;
    expect(typeof p.displayName).toBe("string");
    expect(Array.isArray(p.allergies)).toBe(true);
    expect(p.allergies.length).toBeGreaterThanOrEqual(1);
    expect(p.locale).toBeDefined();
  });
});
