"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import type { Product } from "@/lib/mock-data";
import { Card, Field } from "@/components/primitives";
import { ScoreDisplay, StatusIndicator } from "@/components/domain";

/**
 * SearchClient (`/search`) — interactive search UI. Task 14.3.
 *
 * Requirements:
 * - 16.1 — a search field supporting products, ingredients and barcodes,
 *   filtered against the mock catalog passed in via props.
 * - 16.2 — each result card includes the `StatusIndicator` and `ScoreDisplay`
 *   domain components and links to the product page.
 * - 16.3 — an empty query renders an empty state with plain-language guidance
 *   that suggests scanning or browsing Explore.
 * - 16.4 — a non-empty query with no matches renders a "no results found"
 *   message with the same plain-language guidance.
 *
 * All content is filtered purely in memory over the mock `products` prop; there
 * is no network, persistence, or computation (R24.2). Language follows the
 * Content & Language Guidelines: plain-language first, calm and non-alarmist.
 */

export interface SearchClientProps {
  /** The mock product catalog, resolved on the server via `listProducts()`. */
  products: Product[];
}

/** Why a product matched a query — surfaced so ingredient/barcode hits are clear. */
type MatchReason =
  | { kind: "name" }
  | { kind: "brand" }
  | { kind: "barcode" }
  | { kind: "ingredient"; label: string }
  | { kind: "additive"; label: string };

interface SearchResult {
  product: Product;
  reasons: MatchReason[];
}

function normalise(value: string): string {
  return value.trim().toLowerCase();
}

/**
 * Build the match reasons for a single product against a normalised query.
 * Matches product name/brand/barcode (R16.1) and additionally surfaces
 * ingredient and additive matches so those searches resolve to the product
 * that contains them.
 */
function matchProduct(product: Product, query: string): MatchReason[] {
  const reasons: MatchReason[] = [];

  if (product.name.toLowerCase().includes(query)) {
    reasons.push({ kind: "name" });
  }
  if (product.brand.toLowerCase().includes(query)) {
    reasons.push({ kind: "brand" });
  }
  if (product.barcode != null && product.barcode.toLowerCase().includes(query)) {
    reasons.push({ kind: "barcode" });
  }

  for (const ingredient of product.ingredients) {
    const aliasHit = (ingredient.aliases ?? []).some((alias) =>
      alias.toLowerCase().includes(query),
    );
    if (ingredient.name.toLowerCase().includes(query) || aliasHit) {
      reasons.push({ kind: "ingredient", label: ingredient.name });
    }
  }

  for (const additive of product.additives) {
    const codeHit =
      additive.code != null && additive.code.toLowerCase().includes(query);
    if (additive.name.toLowerCase().includes(query) || codeHit) {
      reasons.push({ kind: "additive", label: additive.name });
    }
  }

  return reasons;
}

function describeReason(reason: MatchReason): string {
  switch (reason.kind) {
    case "name":
      return "Matches product name";
    case "brand":
      return "Matches brand";
    case "barcode":
      return "Matches barcode";
    case "ingredient":
      return `Contains ingredient: ${reason.label}`;
    case "additive":
      return `Contains additive: ${reason.label}`;
    default:
      return "";
  }
}

/** Shared plain-language guidance for the empty and no-results states (R16.3, R16.4). */
function SearchGuidance() {
  return (
    <p className="text-body text-text-secondary">
      You can{" "}
      <Link
        href="/scan"
        className="text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        scan a product
      </Link>{" "}
      or browse{" "}
      <Link
        href="/products"
        className="text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
      >
        Explore
      </Link>{" "}
      to find products, ingredients and additives.
    </p>
  );
}

function ResultCard({ result }: { result: SearchResult }) {
  const { product, reasons } = result;
  return (
    <Card as="li" padding="md" className="list-none">
      <div className="flex flex-wrap items-start justify-between gap-md">
        <div className="min-w-0">
          <h3 className="text-h3 text-text-primary">
            <Link
              href={`/products/${product.slug}`}
              className="rounded-md underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              {product.name}
            </Link>
          </h3>
          <p className="mt-xs text-label text-text-secondary">
            {product.brand}
            {product.barcode != null ? (
              <>
                {" · "}
                <span className="tabular-nums">{product.barcode}</span>
              </>
            ) : null}
          </p>
        </div>
        {/*
          R16.2: every result card includes the StatusIndicator (text + icon,
          never color-only) and the ScoreDisplay (tabular figures). They are
          independent domain components composed side by side.
        */}
        <div className="flex items-center gap-md">
          <StatusIndicator status={product.assessment.status} />
          <ScoreDisplay
            score={product.assessment.score}
            label="FoodSignal score"
          />
        </div>
      </div>

      {reasons.length > 0 ? (
        <ul className="mt-sm flex flex-wrap gap-x-md gap-y-xs">
          {reasons.map((reason, index) => (
            <li
              key={`${reason.kind}-${index}`}
              className="text-caption text-text-secondary"
            >
              {describeReason(reason)}
            </li>
          ))}
        </ul>
      ) : null}
    </Card>
  );
}

export function SearchClient({ products }: SearchClientProps) {
  const [query, setQuery] = useState("");

  const trimmedQuery = query.trim();
  const isEmptyQuery = trimmedQuery.length === 0;

  const results = useMemo<SearchResult[]>(() => {
    if (isEmptyQuery) return [];
    const normalised = normalise(trimmedQuery);
    return products
      .map((product) => ({ product, reasons: matchProduct(product, normalised) }))
      .filter((result) => result.reasons.length > 0);
  }, [products, trimmedQuery, isEmptyQuery]);

  const hasResults = results.length > 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-lg py-xl">
      <h1 className="text-h1 text-text-primary">Search</h1>
      <p className="mt-md text-body text-text-secondary">
        Search products, ingredients and barcodes. Results are drawn from the
        prototype&rsquo;s sample catalogue.
      </p>

      <div className="mt-lg max-w-xl">
        <Field
          label="Search products, ingredients or barcodes"
          hint="Try a product name, a brand, an ingredient, or a barcode number."
        >
          {({ inputId, describedBy }) => (
            <input
              id={inputId}
              aria-describedby={describedBy}
              type="search"
              inputMode="search"
              autoComplete="off"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="e.g. granola, hazelnut, or 5010000000017"
              className="w-full rounded-md border border-border bg-surface px-md py-sm text-body text-text-primary placeholder:text-text-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            />
          )}
        </Field>
      </div>

      <section className="mt-xl" aria-label="Search results">
        {isEmptyQuery ? (
          // R16.3: empty-state guidance for an empty query.
          <div className="flex flex-col gap-sm">
            <h2 className="text-h2 text-text-primary">Start your search</h2>
            <p className="text-body text-text-secondary">
              Enter a product, ingredient or barcode above to see assessments,
              evidence and any recalls found in the sources checked.
            </p>
            <SearchGuidance />
          </div>
        ) : hasResults ? (
          <div className="flex flex-col gap-md">
            <h2 className="text-h2 text-text-primary">
              Results for &ldquo;{trimmedQuery}&rdquo;
            </h2>
            <p className="text-label text-text-secondary" role="status">
              {results.length}{" "}
              {results.length === 1 ? "result" : "results"} found.
            </p>
            <ul className="flex flex-col gap-md">
              {results.map((result) => (
                <ResultCard key={result.product.slug} result={result} />
              ))}
            </ul>
          </div>
        ) : (
          // R16.4: no-results message with the same plain-language guidance.
          <div className="flex flex-col gap-sm" role="status">
            <h2 className="text-h2 text-text-primary">No results found</h2>
            <p className="text-body text-text-secondary">
              We couldn&rsquo;t find anything matching &ldquo;{trimmedQuery}
              &rdquo; in the prototype&rsquo;s sample catalogue.
            </p>
            <SearchGuidance />
          </div>
        )}
      </section>
    </div>
  );
}

export default SearchClient;
