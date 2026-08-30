/**
 * FoodSignal — synchronous mock-data selectors (task 3.3).
 *
 * These helpers are the ONLY sanctioned way for the route/page layer to read
 * mock content. They read from the typed fixtures in `./fixtures` and return
 * typed data SYNCHRONOUSLY. They perform no network requests and no
 * persistence (R23.4, R24.2, R24.3).
 *
 * Unknown-slug policy (R23.5): lookup selectors return `null` for slugs that do
 * not match any fixture. Callers (dynamic routes) use this to render the
 * Not_Found_Layout rather than throwing or rendering partial content.
 *
 * Requirements: 23.3, 23.4, 23.5, 24.1, 24.2, 24.3, 24.5, 24.8
 */

import {
  additives,
  allProducts,
  allRecalls,
  allSources,
  ingredients,
  mockProfile,
  products,
  recalls,
} from './fixtures';
import type {
  Additive,
  Ingredient,
  Product,
  Recall,
  Source,
  UserProfile,
} from './types';

// ---------------------------------------------------------------------------
// Internal lookup indexes — built once from the fixtures, keyed by slug.
// Building these synchronously at module load keeps every selector O(1) and
// free of any I/O.
// ---------------------------------------------------------------------------

/**
 * Build a prototype-less lookup index keyed by slug. Using `Object.create(null)`
 * (rather than an object literal or `Object.fromEntries`, which both inherit
 * from `Object.prototype`) ensures a lookup for a slug that collides with an
 * inherited member — e.g. `"__proto__"`, `"constructor"`, `"valueOf"`,
 * `"toString"`, `"hasOwnProperty"` — resolves to `undefined` instead of the
 * inherited prototype value. Without this, `map[key] ?? null` would return
 * prototype junk for such unknown slugs instead of `null`, driving a dynamic
 * route to render partial/incorrect content rather than the Not_Found_Layout
 * (R23.5, Property 6).
 */
function buildSlugIndex<T>(items: readonly T[], slugOf: (item: T) => string): Record<string, T> {
  const index: Record<string, T> = Object.create(null);
  for (const item of items) {
    index[slugOf(item)] = item;
  }
  return index;
}

const productBySlug: Record<string, Product> = buildSlugIndex(
  Object.values(products),
  (p) => p.slug,
);

const ingredientBySlug: Record<string, Ingredient> = buildSlugIndex(
  Object.values(ingredients),
  (i) => i.slug,
);

const additiveBySlug: Record<string, Additive> = buildSlugIndex(
  Object.values(additives),
  (a) => a.slug,
);

const recallBySlug: Record<string, Recall> = buildSlugIndex(
  Object.values(recalls),
  (r) => r.slug,
);

/**
 * Normalise a slug for lookup. Guards against `undefined`/non-string params
 * (e.g. from dynamic route segments) so selectors never throw on bad input and
 * instead fall through to the not-found path (R23.5).
 */
function normaliseSlug(slug: unknown): string | null {
  if (typeof slug !== 'string') return null;
  const trimmed = slug.trim();
  return trimmed.length > 0 ? trimmed : null;
}

// ---------------------------------------------------------------------------
// Lookup selectors — return the fixture for a known slug, or null (R23.5).
// ---------------------------------------------------------------------------

/** Resolve a product by slug, or `null` when no fixture matches (R23.3, R23.5). */
export function getProductBySlug(slug: string): Product | null {
  const key = normaliseSlug(slug);
  if (key === null) return null;
  return productBySlug[key] ?? null;
}

/** Resolve an ingredient by slug, or `null` when no fixture matches (R23.3, R23.5). */
export function getIngredientBySlug(slug: string): Ingredient | null {
  const key = normaliseSlug(slug);
  if (key === null) return null;
  return ingredientBySlug[key] ?? null;
}

/** Resolve an additive by slug, or `null` when no fixture matches (R23.3, R23.5). */
export function getAdditiveBySlug(slug: string): Additive | null {
  const key = normaliseSlug(slug);
  if (key === null) return null;
  return additiveBySlug[key] ?? null;
}

/** Resolve a recall by slug, or `null` when no fixture matches (R23.3, R23.5). */
export function getRecallBySlug(slug: string): Recall | null {
  const key = normaliseSlug(slug);
  if (key === null) return null;
  return recallBySlug[key] ?? null;
}

// ---------------------------------------------------------------------------
// Listing selectors — return typed arrays for listing pages (R23.3).
// Fresh array copies are returned so callers can sort/filter without mutating
// the shared fixtures.
// ---------------------------------------------------------------------------

/** List all recalls (R23.3). Powers the `/recalls` listing page. */
export function listRecalls(): Recall[] {
  return [...allRecalls];
}

/** List only the currently ACTIVE recalls, for recall-precedence surfaces. */
export function listActiveRecalls(): Recall[] {
  return allRecalls.filter((r) => r.active);
}

/** List all products. Powers listing / search surfaces. */
export function listProducts(): Product[] {
  return [...allProducts];
}

/** List all sources. Powers the `/sources` transparency catalog. */
export function listSources(): Source[] {
  return [...allSources];
}

// ---------------------------------------------------------------------------
// Profile selector — the single mock UserProfile (R23.3).
// ---------------------------------------------------------------------------

/**
 * Return the single mock `UserProfile` (R23.3). Prototype-only; there is no
 * auth or persistence (R24.4).
 */
export function getMockProfile(): UserProfile {
  return mockProfile;
}
