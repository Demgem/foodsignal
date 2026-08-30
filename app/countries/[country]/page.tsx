import type { Metadata } from "next";
import Link from "next/link";

import { StatusIndicator } from "@/components/domain/StatusIndicator";
import { Card } from "@/components/primitives";
import { listProducts, type Product } from "@/lib/mock-data";

interface CountryPageProps {
  params: { country: string };
}

/**
 * Country / market view — `/countries/[country]` (Requirements 17.6, 22.1).
 *
 * Renders, from mock data only (no network, no computation):
 *  - a market overview for the `[country]` param (e.g. "US", "EU"),
 *  - a plain-language explanation of how regulatory context differs by market,
 *  - the sample products authored for that market (filtered from
 *    `listProducts()` by `market`, case-insensitive), each linking to its
 *    product page.
 *
 * Per the design's internationalization guidance, "market" (regulatory market)
 * is a first-class, independent concept. This page accepts any market string
 * param and renders the overview even when no sample products match that
 * market — an empty product catalog is an informative state, not a 404.
 */

/** Normalise a raw route param into a display market label. */
function normaliseMarketParam(raw: string): string {
  const decoded = safeDecode(raw).trim();
  // Short codes (US, EU, UK) read best uppercased; longer names are left as-is.
  if (decoded.length > 0 && decoded.length <= 3) {
    return decoded.toUpperCase();
  }
  return decoded;
}

function safeDecode(raw: string): string {
  try {
    return decodeURIComponent(raw);
  } catch {
    return raw;
  }
}

/** Products authored for a given market, matched case-insensitively. */
function findProductsForMarket(market: string): Product[] {
  const target = market.trim().toLowerCase();
  return listProducts().filter(
    (product) => product.market.trim().toLowerCase() === target,
  );
}

export function generateMetadata({ params }: CountryPageProps): Metadata {
  const market = normaliseMarketParam(params.country);

  return {
    title: `${market} market — Countries — FoodSignal`,
    description: `Market overview, how regulatory context differs, and sample products for the ${market} market. Rendered from sample data in this prototype.`,
  };
}

export default function CountryMarketPage({ params }: CountryPageProps) {
  const market = normaliseMarketParam(params.country);
  const products = findProductsForMarket(market);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-xl px-lg py-xl">
      {/* Overview (single H1 per page) */}
      <header className="flex flex-col gap-sm">
        <p className="text-label uppercase tracking-wide text-text-secondary">
          Market overview
        </p>
        <h1 className="text-h1 text-text-primary">
          Food assessments for the {market} market
        </h1>
        <p className="text-body text-text-secondary">
          FoodSignal presents assessments against a specific regulatory market.
          The {market} market is one such context. What is permitted, restricted,
          or subject to a use-level limit can differ from one market to another,
          so the same product may read differently depending on the market it is
          assessed against.
        </p>
      </header>

      {/* How regulatory context differs by market */}
      <section
        aria-labelledby="market-context-heading"
        className="flex flex-col gap-md"
      >
        <h2 id="market-context-heading" className="text-h2 text-text-primary">
          How regulatory context differs by market
        </h2>
        <p className="text-body text-text-secondary">
          Each market maintains its own rules for which ingredients and additives
          are permitted, and under what conditions. An additive that is permitted
          with a use-level limit in one market may be permitted subject to
          labeling in another, or evaluated differently again elsewhere.
        </p>
        <ul className="flex list-disc flex-col gap-xs pl-lg text-body text-text-secondary">
          <li>
            The applicable rule and any use-level limit are identified per market,
            not assumed to be the same everywhere.
          </li>
          <li>
            Recalls are tracked against the market in which they were issued, so a
            recall in one market does not automatically apply to another.
          </li>
          <li>
            Your interface language and your regulatory market are independent:
            changing the language you read in does not change which market&rsquo;s
            rules an assessment is compared against.
          </li>
        </ul>
        <p className="text-caption text-text-secondary">
          This prototype renders regulatory context from sample data only; it
          performs no regulatory computation.
        </p>
      </section>

      {/* Sample products for this market */}
      <section
        aria-labelledby="market-products-heading"
        className="flex flex-col gap-md"
      >
        <h2 id="market-products-heading" className="text-h2 text-text-primary">
          Sample products assessed for the {market} market
        </h2>
        {products.length > 0 ? (
          <ul className="flex list-none flex-col gap-sm p-0">
            {products.map((product) => (
              <li key={product.slug}>
                <Card as="article" padding="md">
                  <div className="flex flex-col gap-sm">
                    <div className="flex flex-col gap-xs">
                      <Link
                        href={`/products/${product.slug}`}
                        className="rounded-md text-body font-semibold text-text-primary underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                      >
                        {product.name}
                      </Link>
                      <p className="text-caption text-text-secondary">
                        {product.brand} &middot; {product.market} market
                      </p>
                    </div>
                    <StatusIndicator
                      status={product.assessment.status}
                      size="sm"
                    />
                  </div>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body text-text-secondary">
            No sample products have been authored for the {market} market in this
            prototype yet. You can browse products assessed for other markets
            from the Explore navigation.
          </p>
        )}
      </section>
    </div>
  );
}
