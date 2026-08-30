import type { Ingredient, Source } from "@/lib/mock-data/types";
import { Disclosure, Chip, Icon } from "@/components/primitives";

/**
 * IngredientExplanation (expandable) — Requirements 10.1, 10.2, 20.11
 *
 * Expandable plain-language explanation for a single ingredient, built on the
 * accessible `Disclosure` primitive (see design.md — "IngredientExplanation
 * (expandable)"). All content arrives via props (Requirement 10.2); the
 * component holds the FoodSignal domain shape but performs no I/O.
 *
 * Accessibility / no-color-or-animation posture (Requirement 20.11 spirit):
 * - The expand/collapse affordance is the `Disclosure` primitive, which is
 *   keyboard operable, exposes `aria-expanded`/`aria-controls`, and shows a
 *   visible focus ring. A non-color chevron `Icon` reinforces open/closed
 *   state so it is legible without relying on color.
 * - Sources are rendered as provenance chips; when a source has a URL it
 *   becomes a focusable link, otherwise it renders as a static chip.
 *
 * The `explanation` prop is passed explicitly (rather than always reading
 * `ingredient.explanation`) so callers can supply a market- or context-specific
 * plain-language explanation while still identifying the ingredient by its
 * domain object.
 */
export interface IngredientExplanationProps {
  ingredient: Ingredient;
  /** Plain-language explanation to reveal when expanded. */
  explanation: string;
  /** Sources backing the explanation. */
  sources: Source[];
  /** Uncontrolled initial open state. Defaults to collapsed. */
  defaultOpen?: boolean;
  className?: string;
}

/** A simple chevron that rotates via className only (no animation required). */
function ChevronIcon({ open }: { open: boolean }) {
  return (
    <Icon decorative size="1.25em" viewBox="0 0 24 24">
      <path
        d={open ? "M6 15l6-6 6 6" : "M6 9l6 6 6-6"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Icon>
  );
}

export function IngredientExplanation({
  ingredient,
  explanation,
  sources,
  defaultOpen = false,
  className,
}: IngredientExplanationProps) {
  const hasSources = Array.isArray(sources) && sources.length > 0;

  return (
    <Disclosure
      className={className}
      defaultOpen={defaultOpen}
      label={ingredient.name}
      indicator={(open) => <ChevronIcon open={open} />}
    >
      <div className="flex flex-col gap-sm">
        <p className="text-body text-text-secondary">{explanation}</p>

        {hasSources ? (
          <div className="flex flex-col gap-xs">
            <p className="text-label text-text-secondary">Sources</p>
            <ul className="flex list-none flex-wrap gap-xs p-0">
              {sources.map((source) => (
                <li key={source.id} className="inline-flex">
                  {source.url ? (
                    <Chip
                      href={source.url}
                      rel="noreferrer"
                      target="_blank"
                    >
                      {source.name}
                    </Chip>
                  ) : (
                    <Chip>{source.name}</Chip>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </Disclosure>
  );
}

export default IngredientExplanation;
