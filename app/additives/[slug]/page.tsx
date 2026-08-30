import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Import domain components from their module files directly (rather than the
// `@/components/domain` barrel) so this server component's module graph does
// not transitively include unrelated components.
import { ConfidenceIndicator } from "@/components/domain/ConfidenceIndicator";
import { RegulatoryComparisonTable } from "@/components/domain/RegulatoryComparisonTable";
import { SourceChip } from "@/components/domain/SourceChip";
import { Card } from "@/components/primitives";
import {
  getAdditiveBySlug,
  listProducts,
  type Additive,
  type ConfidenceLevel,
  type Product,
} from "@/lib/mock-data";

interface AdditivePageProps {
  params: { slug: string };
}

/**
 * Additive detail page — `/additives/[slug]` (Requirements 17.2, 23.5).
 *
 * Renders, from the entity resolved via the mock-data selectors only
 * (no network, no computation):
 *  - identity (name, code, aliases-equivalent purpose),
 *  - a plain-language explanation,
 *  - a regulatory comparison table (or a plain-language note when the additive
 *    carries no regulatory records),
 *  - associated products (derived by scanning `listProducts()` for products
 *    whose additive list includes this slug; each links to its product page),
 *  - the backing sources as a SourceChip list,
 *  - a confidence indicator.
 *
 * Unknown slugs resolve to `null` from the selector and render the shared
 * Not_Found_Layout via `notFound()` (R23.5).
 */

/**
 * Derive a moderate-by-default confidence level for an additive. The prototype
 * performs no assessment computation (design "Non-Goals"), so this is a simple,
 * transparent heuristic over the mock data: additives backed by more sources
 * read as somewhat better-evidenced, but everything stays within a calm,
 * moderate band because no real evaluation is performed.
 */
function deriveAdditiveConfidence(additive: Additive): ConfidenceLevel {
  const sourceCount = additive.sources.length;
  if (sourceCount >= 3) return "high";
  if (sourceCount >= 1) return "moderate";
  return "low";
}

/** Products whose additive list includes this additive slug. */
function findProductsWithAdditive(slug: string): Product[] {
  return listProducts().filter((product) =>
    product.additives.some((additive) => additive.slug === slug),
  );
}

export function generateMetadata({ params }: AdditivePageProps): Metadata {
  const additive = getAdditiveBySlug(params.slug);

  if (!additive) {
    return {
      title: "Additive not found — FoodSignal",
      description:
        "This additive could not be found in the sample data for this prototype.",
    };
  }

  const codeSuffix = additive.code ? ` (${additive.code})` : "";
  return {
    title: `${additive.name}${codeSuffix} — Additive — FoodSignal`,
    description: `Plain-language explanation, regulatory comparison, associated products, and sources for ${additive.name}. Rendered from sample data in this prototype.`,
  };
}

export default function AdditiveDetailPage({ params }: AdditivePageProps) {
  const additive = getAdditiveBySlug(params.slug);

  if (!additive) {
    notFound();
  }

  const regulatory = additive.regulatory ?? [];
  const associatedProducts = findProductsWithAdditive(additive.slug);
  const confidence = deriveAdditiveConfidence(additive);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-xl px-lg py-xl">
      {/* Identity (single H1 per page) */}
      <header className="flex flex-col gap-sm">
        <p className="text-label uppercase tracking-wide text-text-secondary">
          Additive
        </p>
        <h1 className="text-h1 text-text-primary">{additive.name}</h1>
        {additive.code ? (
          <p className="text-body text-text-secondary">
            Code: <span className="font-semibold">{additive.code}</span>
          </p>
        ) : null}
        {additive.purpose ? (
          <p className="text-body text-text-secondary">{additive.purpose}</p>
        ) : null}
      </header>

      {/* Plain-language explanation */}
      <section aria-labelledby="additive-explanation-heading" className="flex flex-col gap-md">
        <h2
          id="additive-explanation-heading"
          className="text-h2 text-text-primary"
        >
          What this additive is
        </h2>
        <p className="text-body text-text-secondary">{additive.explanation}</p>
      </section>

      {/* Regulatory comparison */}
      <section aria-labelledby="additive-regulatory-heading" className="flex flex-col gap-md">
        <h2
          id="additive-regulatory-heading"
          className="text-h2 text-text-primary"
        >
          How markets treat it
        </h2>
        {regulatory.length > 0 ? (
          <RegulatoryComparisonTable
            records={regulatory}
            caption={`Regulatory status of ${additive.name} across markets, from the sources checked.`}
          />
        ) : (
          <p className="text-body text-text-secondary">
            No market-by-market regulatory records were provided for this
            additive in the sources checked.
          </p>
        )}
      </section>

      {/* Associated products */}
      <section aria-labelledby="additive-products-heading" className="flex flex-col gap-md">
        <h2
          id="additive-products-heading"
          className="text-h2 text-text-primary"
        >
          Products that include it
        </h2>
        {associatedProducts.length > 0 ? (
          <ul className="flex list-none flex-col gap-sm p-0">
            {associatedProducts.map((product) => (
              <li key={product.slug}>
                <Card as="article" padding="md">
                  <Link
                    href={`/products/${product.slug}`}
                    className="rounded-md text-body font-semibold text-text-primary underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                  >
                    {product.name}
                  </Link>
                  <p className="mt-xs text-caption text-text-secondary">
                    {product.brand} · {product.market}
                  </p>
                </Card>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body text-text-secondary">
            None of the sample products include this additive.
          </p>
        )}
      </section>

      {/* Sources */}
      <section aria-labelledby="additive-sources-heading" className="flex flex-col gap-md">
        <h2
          id="additive-sources-heading"
          className="text-h2 text-text-primary"
        >
          Sources checked
        </h2>
        {additive.sources.length > 0 ? (
          <ul className="flex list-none flex-wrap gap-xs p-0">
            {additive.sources.map((source) => (
              <li key={source.id} className="inline-flex">
                <SourceChip source={source} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body text-text-secondary">
            No sources were listed for this additive.
          </p>
        )}
      </section>

      {/* Confidence */}
      <section aria-labelledby="additive-confidence-heading" className="flex flex-col gap-md">
        <h2
          id="additive-confidence-heading"
          className="text-h2 text-text-primary"
        >
          Evidence confidence
        </h2>
        <ConfidenceIndicator level={confidence} showDescription />
      </section>
    </div>
  );
}
