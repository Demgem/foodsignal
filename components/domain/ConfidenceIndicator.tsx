import type { ConfidenceLevel } from "@/lib/mock-data";
import { Badge } from "@/components/primitives";

/**
 * ConfidenceIndicator (Requirements 7.1, 7.2, 7.3, 7.4, 10.1, 10.2)
 *
 * Renders a `ConfidenceLevel` (Very High / High / Moderate / Low / Insufficient)
 * as a domain component composed from the domain-agnostic `Badge` primitive.
 *
 * Invariants enforced here:
 * - Supports all five confidence levels (R7.1).
 * - Uses the NEUTRAL confidence treatment (`tone="confidence"`) and never a
 *   status color family (R7.2) — confidence is "evidence quality, not danger".
 * - Always renders a human-readable label (R7.3).
 * - When the description is shown, includes copy stating confidence describes
 *   evidence quality, not danger (R7.4).
 *
 * Data is read via props only (R10.2).
 */
export interface ConfidenceIndicatorProps {
  level: ConfidenceLevel;
  /** When true, render the explanatory evidence-quality-not-danger caption. */
  showDescription?: boolean;
  className?: string;
}

/**
 * The shared clarifying sentence reinforcing that confidence is about how much
 * is known (evidence quality), NOT about how dangerous the product is (R7.4).
 * Exported so pages/tests can reference the exact copy.
 */
export const CONFIDENCE_MEANING_TEXT =
  "Confidence describes the quality of the available evidence, not how dangerous the product is.";

/** Human-readable labels for each level (R7.3). */
const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  very_high: "Very high confidence",
  high: "High confidence",
  moderate: "Moderate confidence",
  low: "Low confidence",
  insufficient: "Insufficient evidence",
};

/**
 * Per-level descriptive copy. Each phrasing is framed around evidence quality
 * (what is known), keeping confidence clearly separated from danger (R7.4).
 */
const CONFIDENCE_DETAIL: Record<ConfidenceLevel, string> = {
  very_high:
    "The available evidence is consistent and well-corroborated across sources.",
  high: "The available evidence is strong and largely consistent.",
  moderate:
    "There is a reasonable amount of evidence, with some gaps or variation.",
  low: "The available evidence is limited or mixed.",
  insufficient:
    "There is not enough evidence yet to characterise this with confidence.",
};

export function ConfidenceIndicator({
  level,
  showDescription = false,
  className,
}: ConfidenceIndicatorProps) {
  const label = CONFIDENCE_LABELS[level];

  return (
    <div
      className={["flex flex-col gap-xs", className].filter(Boolean).join(" ")}
      data-confidence={level}
    >
      {/* Neutral confidence treatment — never a status family (R7.2). */}
      <Badge tone="confidence">{label}</Badge>

      {showDescription ? (
        <p className="text-caption text-text-secondary">
          {CONFIDENCE_DETAIL[level]} {CONFIDENCE_MEANING_TEXT}
        </p>
      ) : null}
    </div>
  );
}

export default ConfidenceIndicator;
