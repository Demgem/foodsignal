import Link from "next/link";
import type { Product } from "@/lib/mock-data/types";
import { Card } from "@/components/primitives";

/**
 * AlternativeRecommendationCard (Requirements 11.1, 11.2, 10.1, 10.2)
 *
 * Suggests an alternative product while carrying a MANDATORY, non-negotiable
 * disclosure. The disclosure clarifies that recommending an alternative does
 * not change the safety assessment of the original product.
 *
 * CRITICAL INVARIANT (R11.1 / R11.2):
 * - Whenever an alternative is rendered, the EXACT disclosure sentence
 *   (`ALTERNATIVE_DISCLOSURE`) is ALWAYS present in the output.
 * - If, for any reason, the disclosure sentence is not a renderable non-empty
 *   string, the component renders NOTHING (hides the alternative) rather than
 *   showing a recommendation without its disclosure.
 *
 * Content is read via props only (R10.1, R10.2 — evidence/transparency framing):
 * the alternative's identity (name/brand) and a link to its product page.
 */

/**
 * The exact, stable disclosure sentence required by R11.1. Exported so that
 * tests (task 6.5) and any composing surfaces can reference the single source
 * of truth rather than duplicating the literal string.
 */
export const ALTERNATIVE_DISCLOSURE =
  "Suggested alternative. This recommendation does not change the safety assessment of the original product." as const;

export interface AlternativeRecommendationCardProps {
  alternative: Product;
}

/**
 * Guard: confirms the mandatory disclosure is a renderable, non-empty string.
 * This backs the R11.2 fail-safe — if this ever returns false we hide the
 * alternative instead of rendering it without disclosure.
 */
function canRenderDisclosure(disclosure: unknown): disclosure is string {
  return typeof disclosure === "string" && disclosure.trim().length > 0;
}

export function AlternativeRecommendationCard({
  alternative,
}: AlternativeRecommendationCardProps) {
  // R11.2 fail-safe: never render an alternative without its disclosure.
  if (!canRenderDisclosure(ALTERNATIVE_DISCLOSURE)) {
    return null;
  }

  // Defensive: without an identifiable alternative there is nothing to link to.
  if (!alternative || !alternative.slug) {
    return null;
  }

  const href = `/products/${alternative.slug}`;

  return (
    <Card as="article" padding="md" bordered aria-label="Suggested alternative">
      {/* R11.1: the exact disclosure sentence is ALWAYS present. */}
      <p className="text-caption text-text-secondary">{ALTERNATIVE_DISCLOSURE}</p>

      <div className="mt-sm">
        <Link
          href={href}
          className="text-body font-semibold text-brand underline hover:text-brand-hover focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
        >
          {alternative.name}
        </Link>
        {alternative.brand ? (
          <p className="text-label text-text-secondary">{alternative.brand}</p>
        ) : null}
      </div>
    </Card>
  );
}

export default AlternativeRecommendationCard;
