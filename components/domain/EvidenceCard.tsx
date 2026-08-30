import type { ConfidenceLevel, Source } from "@/lib/mock-data/types";
import { Card } from "@/components/primitives";
import { ConfidenceIndicator } from "./ConfidenceIndicator";
import { SourceChip } from "./SourceChip";

/**
 * EvidenceCard (Requirements 10.1, 10.2, 10.5)
 *
 * A self-contained evidence unit that presents a claim, its plain-language
 * explanation, the confidence in that evidence, and the associated sources
 * (see design.md — "EvidenceCard"). Composed from the domain-agnostic `Card`
 * primitive plus the `ConfidenceIndicator` and `SourceChip` domain components.
 *
 * Invariants (Requirement 10.5): when rendered, an EvidenceCard shows its
 * claim (title), explanation (body), confidence, and associated sources. The
 * confidence is optional per the design prop contract; when provided it uses
 * the neutral confidence treatment (never a status family) via
 * `ConfidenceIndicator`, keeping evidence quality separate from danger.
 *
 * Data is read via props only (Requirement 10.2); no fetching or state.
 */
export interface EvidenceCardProps {
  /** The claim / headline of the evidence unit. */
  title: string;
  /** Plain-language explanation supporting the claim. */
  body: string;
  /** Optional confidence in the evidence quality. */
  confidence?: ConfidenceLevel;
  /** Provenance for the claim. May be empty. */
  sources: Source[];
  /**
   * Heading level for the card title so it slots into a page's heading
   * outline. Defaults to `h3`.
   */
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
}

export function EvidenceCard({
  title,
  body,
  confidence,
  sources,
  headingLevel = "h3",
  className,
}: EvidenceCardProps) {
  const Heading = headingLevel;
  const hasSources = Array.isArray(sources) && sources.length > 0;

  return (
    <Card
      as="article"
      padding="md"
      bordered
      className={["flex flex-col gap-sm", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Claim (Requirement 10.5). */}
      <Heading className="text-h3 font-display">{title}</Heading>

      {/* Explanation (Requirement 10.5), plain-language first. */}
      <p className="text-body text-text-primary">{body}</p>

      {/* Confidence (Requirement 10.5) — neutral treatment via the indicator. */}
      {confidence != null ? (
        <ConfidenceIndicator level={confidence} showDescription />
      ) : null}

      {/* Associated sources (Requirement 10.5). */}
      {hasSources ? (
        <div className="flex flex-col gap-xs">
          <p className="text-label text-text-secondary">Sources</p>
          <ul className="flex list-none flex-wrap gap-xs p-0">
            {sources.map((source, index) => (
              <li key={source.id ?? `${source.name}-${index}`}>
                <SourceChip source={source} />
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </Card>
  );
}

export default EvidenceCard;
