import type { Metadata } from "next";
import { notFound } from "next/navigation";

import {
  getProductBySlug,
  getMockProfile,
  listProducts,
} from "@/lib/mock-data";
import { JsonLd } from "@/components/JsonLd";
import { buildProductStub, buildBrandStub } from "@/lib/seo";

import { ProductDetail } from "./ProductDetail";

/**
 * Product page (`/products/[slug]`) — 17 sections in order (Task 13.1).
 *
 * Server entry for the product detail route. It resolves the slug via
 * `getProductBySlug` from the typed mock-data layer and calls Next.js
 * `notFound()` for unknown slugs, which renders the shared accessible
 * Not_Found_Layout (Requirements 23.5, 2.3). It reads content only via
 * selectors (design "Layering Rules") and performs no I/O, computation, or
 * submission (Requirements 24.2, 24.8).
 *
 * The resolved, serializable `product` and mock `profile` are handed to the
 * `ProductDetail` client component, which renders the 17 sections in exact
 * order (Requirement 13.1). The composition lives in a client component
 * because it uses `IngredientExplanation`, which passes a render-function
 * prop into the client `Disclosure` primitive — a function prop that cannot be
 * serialized across the server→client boundary during static export.
 */

interface ProductPageProps {
  params: { slug: string };
}

/**
 * Pre-render the known product slugs from the mock catalog (optional; keeps
 * the prototype fully static). Unknown slugs still fall back to `notFound()`.
 */
export function generateStaticParams(): Array<{ slug: string }> {
  return listProducts().map((product) => ({ slug: product.slug }));
}

/**
 * Factual, snippet-style metadata (Requirements 22.1, 22.3).
 *
 * The description follows the design's factual snippet style
 * "Ingredients, allergens, nutrition, recalls and evidence for [product] in
 * [market]." (R22.3). Locale-aware URL / hreflang alternates are NOTED via the
 * metadata `alternates` note rather than implemented (R22.4).
 */
export function generateMetadata({ params }: ProductPageProps): Metadata {
  const product = getProductBySlug(params.slug);
  if (!product) {
    return { title: "Product not found — FoodSignal" };
  }
  return {
    title: `${product.name} — ${product.brand} — FoodSignal`,
    description: `Ingredients, allergens, nutrition, recalls and evidence for ${product.name} by ${product.brand} in ${product.market}.`,
    // Locale-aware URLs / hreflang are noted but not implemented (R22.4).
    alternates: {
      // NOTE: hreflang alternates (per interface language + regulatory market)
      // are intentionally left as a placeholder note in this prototype.
      languages: {
        "x-default": `/products/${product.slug}`,
      },
    },
  };
}

export default function ProductPage({ params }: ProductPageProps) {
  const product = getProductBySlug(params.slug);

  // Unknown slug -> render the shared accessible Not_Found_Layout (R23.5, R2.3).
  if (!product) {
    notFound();
  }

  const profile = getMockProfile();

  // Structured-data placeholder stubs (R22.2): a Product node (with a nested
  // Brand) plus a standalone Brand node, built from mock product content in
  // lib/seo.ts. Rendered as <script type="application/ld+json">. Locale-aware
  // URL / hreflang considerations are noted via `LOCALE_URL_NOTE` in lib/seo.ts
  // and the metadata `alternates` note above; they are not implemented here
  // (R22.4).
  const structuredData = [buildProductStub(product), buildBrandStub(product)];

  return (
    <>
      <JsonLd stubs={structuredData} />
      <ProductDetail product={product} profile={profile} />
    </>
  );
}
