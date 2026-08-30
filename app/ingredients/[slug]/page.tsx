import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Import domain components from their module files directly (rather than the
// `@/components/domain` barrel) so this server component's module graph does
// not transitively include unrelated components.
import { ConfidenceIndicator } from "@/components/domain/ConfidenceIndicator";
import { IngredientExplanation } from "@/components/domain/IngredientExplanation";
import { RegulatoryComparisonTable } from "@/components/domain/RegulatoryComparisonTable";
import { SourceChip } from "@/components/domain/SourceChip";
import { Card } from "@/components/primitives";
import {
  getIngredientBySlug,
  listProducts,
  type ConfidenceLevel,
  type Ingredient,
  type Product,
} from "@/lib/mock-data";

interface IngredientPageProps {
  params: { slug: string };
}

/**
 * Ingredient detail page — `/ingredients/[slug]` (Requirements 17.1, 23.5).
 *
 * Renders, from the entity resolved via the mock-data selectors only
 * (no network, no computation):
 *  - identity (name + aliases),
 *  - a plain-language explanation,
 *  - a regulatory comparison table (or a plain-language note when the
 *    ingredient carries no regulatory records),
 *  - associated products (derived by scanning `listProducts()` for products
 *    whose ingredient list includes this slug; each links to its product page),
 *  - the backing sources as a SourceChip list,
 *  - a confidence indicator.
 *
 * Unknown slugs resolve to `null` from the selector and render the shared
 * Not_Found_Layout via `notFound()` (R23.5).
 */

/**
 * Derive a moderate-by-default confidence level for an ingredient. The
 * prototype performs no assessment computation (design "Non-Goals"), so this is
 * a simple, transparent heuristic over the mock data: ingredients backed by
 * more sources read as somewhat better-evidenced, but everything stays within a
 * calm, moderate band because no real evaluation is performed.
 */
function deriveIngredientConfidence(ingredient: Ingredient): ConfidenceLevel {
  const sourceCount = ingredient.sources.length;
  if (sourceCount >= 3) return "high";
  if (sourceCount >= 1) return "moderate";
  return "low";
}

/** Products whose ingredient list includes this ingredient slug. */
function findProductsWithIngredient(slug: string): Product[] {
  return listProducts().filter((product) =>
    product.ingredients.some((ingredient) => ingredient.slug === slug),
  );
}

export function generateMetadata({ params }: IngredientPageProps): Metadata {
  const ingredient = getIngredientBySlug(params.slug);

  if (!ingredient) {
    return {
      title: "Ingredient not found — FoodSignal",
      description:
        "This ingredient could not be found in the sample data for this prototype.",
    };
  }

  return {
    title: `${ingredient.name} — Ingredient — FoodSignal`,
    description: `Plain-language explanation, regulatory comparison, associated products, and sources for ${ingredient.name}. Rendered from sample data in this prototype.`,
  };
}

export default function IngredientDetailPage({ params }: IngredientPageProps) {
  const ingredient = getIngredientBySlug(params.slug);

  if (!ingredient) {
    notFound();
  }

  const aliases = ingredient.aliases ?? [];
  const regulatory = ingredient.regulatory ?? [];
  const associatedProducts = findProductsWithIngredient(ingredient.slug);
  const confidence = deriveIngredientConfidence(ingredient);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-xl px-lg py-xl">
      {/* Identity (single H1 per page) */}
      <header className="flex flex-col gap-sm">
        <p className="text-label uppercase tracking-wide text-text-secondary">
          Ingredient
        </p>
        <h1 className="text-h1 text-text-primary">{ingredient.name}</h1>
        {aliases.length > 0 ? (
          <p className="text-body text-text-secondary">
            Also known as: {aliases.join(", ")}
          </p>
        ) : null}
      </header>

      {/* Plain-language explanation */}
      <section aria-labelledby="ingredient-explanation-heading" className="flex flex-col gap-md">
        <h2
          id="ingredient-explanation-heading"
          className="text-h2 text-text-primary"
        >
          What this ingredient is
        </h2>
        <p className="text-body text-text-secondary">{ingredient.explanation}</p>
        <IngredientExplanation
          ingredient={ingredient}
          explanation={ingredient.explanation}
          sources={ingredient.sources}
        />
      </section>

      {/* Regulatory comparison */}
      <section aria-labelledby="ingredient-regulatory-heading" className="flex flex-col gap-md">
        <h2
          id="ingredient-regulatory-heading"
          className="text-h2 text-text-primary"
        >
          How markets treat it
        </h2>
        {regulatory.length > 0 ? (
          <RegulatoryComparisonTable
            records={regulatory}
            caption={`Regulatory status of ${ingredient.name} across markets, from the sources checked.`}
          />
        ) : (
          <p className="text-body text-text-secondary">
            No market-by-market regulatory records were provided for this
            ingredient in the sources checked.
          </p>
        )}
      </section>

      {/* Associated products */}
      <section aria-labelledby="ingredient-products-heading" className="flex flex-col gap-md">
        <h2
          id="ingredient-products-heading"
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
            None of the sample products include this ingredient.
          </p>
        )}
      </section>

      {/* Sources */}
      <section aria-labelledby="ingredient-sources-heading" className="flex flex-col gap-md">
        <h2
          id="ingredient-sources-heading"
          className="text-h2 text-text-primary"
        >
          Sources checked
        </h2>
        {ingredient.sources.length > 0 ? (
          <ul className="flex list-none flex-wrap gap-xs p-0">
            {ingredient.sources.map((source) => (
              <li key={source.id} className="inline-flex">
                <SourceChip source={source} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body text-text-secondary">
            No sources were listed for this ingredient.
          </p>
        )}
      </section>

      {/* Confidence */}
      <section aria-labelledby="ingredient-confidence-heading" className="flex flex-col gap-md">
        <h2
          id="ingredient-confidence-heading"
          className="text-h2 text-text-primary"
        >
          Evidence confidence
        </h2>
        <ConfidenceIndicator level={confidence} showDescription />
      </section>
    </div>
  );
}
