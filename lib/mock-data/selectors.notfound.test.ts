import { describe, it, expect } from "vitest";
import fc from "fast-check";
import {
  getProductBySlug,
  getIngredientBySlug,
  getAdditiveBySlug,
  getRecallBySlug,
  listProducts,
  listRecalls,
  ingredients,
  additives,
} from "@/lib/mock-data";

/**
 * Property 6: Unknown slugs resolve to not-found.
 *
 * The dynamic route pages (`/products/[slug]`, `/ingredients/[slug]`,
 * `/additives/[slug]`, `/recalls/[slug]`) resolve their slug through the
 * matching `get*BySlug` selector and call Next's `notFound()` — rendering the
 * Not_Found_Layout — whenever the selector returns `null`. The testable core of
 * the property is therefore the selector contract (R23.5): for any slug that is
 * NOT one of the known fixture slugs, every `get*BySlug` returns `null` rather
 * than partial or incorrect content. This drives the route to the not-found
 * layout instead of rendering a page for a non-existent entity.
 *
 * Validates: Requirements 2.3, 23.5
 */

/**
 * The complete set of slugs that resolve to a real fixture. Assembled from the
 * public listing helpers (products, recalls) and the exported fixture catalogs
 * (ingredients, additives) so it stays in sync with the fixtures. Any generated
 * string not in this set MUST resolve to `null` across all selectors.
 */
const knownSlugs = new Set<string>([
  ...listProducts().map((p) => p.slug),
  ...listRecalls().map((r) => r.slug),
  ...Object.values(ingredients).map((i) => i.slug),
  ...Object.values(additives).map((a) => a.slug),
]);

describe("mock-data selectors — Property 6: unknown slugs resolve to not-found", () => {
  it("returns null from every get*BySlug for any slug that is not a known fixture (>=100 runs)", () => {
    fc.assert(
      fc.property(fc.string(), (slug) => {
        // Skip the rare case where the generator happens to produce a real
        // fixture slug — the property only concerns *unknown* slugs. We also
        // compare against the normalised (trimmed) form because the selectors
        // trim before lookup, so e.g. " hazelnut " matches "hazelnut".
        const normalised = typeof slug === "string" ? slug.trim() : "";
        fc.pre(!knownSlugs.has(normalised));

        // An unknown slug must never yield partial/incorrect content: every
        // lookup selector returns null (which drives notFound() at the route).
        expect(getProductBySlug(slug)).toBeNull();
        expect(getIngredientBySlug(slug)).toBeNull();
        expect(getAdditiveBySlug(slug)).toBeNull();
        expect(getRecallBySlug(slug)).toBeNull();
      }),
      { numRuns: 200 }
    );
  });

  // --- Example-based assertions ------------------------------------------

  it("returns a non-null product for a known product slug", () => {
    const product = getProductBySlug("orchard-crunch-granola");
    expect(product).not.toBeNull();
    expect(product?.slug).toBe("orchard-crunch-granola");
  });

  it("resolves each known fixture slug to a non-null entity via its selector", () => {
    for (const p of listProducts()) {
      expect(getProductBySlug(p.slug)).not.toBeNull();
    }
    for (const r of listRecalls()) {
      expect(getRecallBySlug(r.slug)).not.toBeNull();
    }
    for (const i of Object.values(ingredients)) {
      expect(getIngredientBySlug(i.slug)).not.toBeNull();
    }
    for (const a of Object.values(additives)) {
      expect(getAdditiveBySlug(a.slug)).not.toBeNull();
    }
  });

  it("returns null for the empty string across all selectors", () => {
    expect(getProductBySlug("")).toBeNull();
    expect(getIngredientBySlug("")).toBeNull();
    expect(getAdditiveBySlug("")).toBeNull();
    expect(getRecallBySlug("")).toBeNull();
  });

  it("returns null for whitespace-only slugs across all selectors", () => {
    for (const ws of ["   ", "\t", "\n", " \t \n "]) {
      expect(getProductBySlug(ws)).toBeNull();
      expect(getIngredientBySlug(ws)).toBeNull();
      expect(getAdditiveBySlug(ws)).toBeNull();
      expect(getRecallBySlug(ws)).toBeNull();
    }
  });

  it("returns null for a clearly unknown slug that matches no fixture", () => {
    const unknown = "definitely-not-a-real-slug-xyz-123";
    expect(knownSlugs.has(unknown)).toBe(false);
    expect(getProductBySlug(unknown)).toBeNull();
    expect(getIngredientBySlug(unknown)).toBeNull();
    expect(getAdditiveBySlug(unknown)).toBeNull();
    expect(getRecallBySlug(unknown)).toBeNull();
  });
});
