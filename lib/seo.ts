/**
 * SEO helpers — structured-data placeholder stubs (Design "SEO (Design-Level)").
 *
 * This module supports the prototype's SEO posture (Requirement 22):
 *  - Per-page metadata (title + factual-snippet-style description) is declared
 *    on each route via Next.js `metadata` / `generateMetadata`.
 *  - WHERE structured data genuinely applies, pages render a `StructuredDataStub`
 *    of type `Product`, `Brand`, or `FAQPage` (R22.2) as a JSON-LD
 *    `<script type="application/ld+json">` block.
 *
 * These are DESIGN-LEVEL PLACEHOLDERS only. The stub `data` uses a realistic
 * schema.org-shaped placeholder built from the mock product/page content
 * (e.g. name, brand, description). It deliberately does NOT fabricate ratings,
 * prices, offers, or review counts — those would imply data the prototype does
 * not have (R24.8: values come from authored mock data, never a computed
 * engine).
 *
 * Locale-aware URL / `hreflang` considerations are NOTED but not fully
 * implemented in the prototype (R22.4). Callers can attach a `hreflangNote`
 * to their `PageMetadata` and/or a metadata `alternates` note; see
 * `LOCALE_URL_NOTE` below and the product page for an example.
 */

import type { Product, StructuredDataStub } from './mock-data/types';

/**
 * Human-readable note describing the intended locale-aware URL / hreflang
 * strategy. Referenced from page metadata so the intent is discoverable
 * without being implemented (Requirement 22.4).
 */
export const LOCALE_URL_NOTE =
  'Locale-aware URLs and hreflang alternates (per interface language and ' +
  'regulatory market) are planned but not implemented in this prototype.';

/**
 * Build a `Product` JSON-LD placeholder stub from a mock product.
 *
 * Uses schema.org-shaped keys under a placeholder `data` object. The nested
 * brand is expressed as a `Brand` node (schema.org allows `brand` to be a
 * Brand). No ratings/offers/prices are fabricated (R24.8).
 */
export function buildProductStub(product: Product): StructuredDataStub {
  return {
    type: 'Product',
    data: {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: product.name,
      brand: {
        '@type': 'Brand',
        name: product.brand,
      },
      description: `Ingredients, allergens, nutrition, recalls and evidence for ${product.name} by ${product.brand} in ${product.market}.`,
      ...(product.barcode ? { gtin: product.barcode } : {}),
    },
  };
}

/**
 * Build a standalone `Brand` JSON-LD placeholder stub from a mock product's
 * brand. Kept separate so a page can emit a `Brand` node independently of the
 * `Product` node when that is more appropriate.
 */
export function buildBrandStub(product: Product): StructuredDataStub {
  return {
    type: 'Brand',
    data: {
      '@context': 'https://schema.org',
      '@type': 'Brand',
      name: product.brand,
    },
  };
}

/** A single question/answer pair for a `FAQPage` stub. */
export interface FaqEntry {
  question: string;
  answer: string;
}

/**
 * Build a `FAQPage` JSON-LD placeholder stub from a list of Q&A entries.
 *
 * Appropriate for pages framed as questions and answers (e.g. `/methodology`,
 * which explains "What Safe, Caution and Avoid mean", "Reading the score",
 * etc.). Empty questions/answers are dropped so the stub never emits blank
 * entries.
 */
export function buildFaqPageStub(entries: FaqEntry[]): StructuredDataStub {
  const mainEntity = entries
    .filter((entry) => entry.question.trim() !== '' && entry.answer.trim() !== '')
    .map((entry) => ({
      '@type': 'Question',
      name: entry.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: entry.answer,
      },
    }));

  return {
    type: 'FAQPage',
    data: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity,
    },
  };
}
