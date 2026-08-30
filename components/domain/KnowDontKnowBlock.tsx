import { Card } from "@/components/primitives";

/**
 * KnowDontKnowBlock (Requirements 10.1, 10.2, 10.6)
 *
 * Transparency block that renders two clearly-headed lists side by side:
 * "What we know" and "What we don't know" (see design.md — "KnowDontKnowBlock").
 * This honest framing of the limits of the available evidence is a core
 * FoodSignal content pattern.
 *
 * Invariant (Requirement 10.6): renders BOTH a "what we know" list and a
 * "what we don't know" list, each under a clear heading. When a list is empty,
 * a plain-language placeholder is shown so the section is never silently blank
 * and the two-column framing stays intact.
 *
 * Standalone domain component — it composes only the `Card` primitive and reads
 * all content via props (Requirement 10.2).
 */
export interface KnowDontKnowBlockProps {
  /** Statements the evidence supports ("what we know"). */
  known: string[];
  /** Open questions / gaps ("what we don't know"). */
  unknown: string[];
  /**
   * Heading level for the two column headings so they slot into a page's
   * heading outline. Defaults to `h3`.
   */
  headingLevel?: "h2" | "h3" | "h4";
  className?: string;
}

function EvidenceList({
  items,
  emptyText,
}: {
  items: string[];
  emptyText: string;
}) {
  if (!Array.isArray(items) || items.length === 0) {
    return <p className="text-body text-text-secondary">{emptyText}</p>;
  }
  return (
    <ul className="flex list-disc flex-col gap-xs pl-md text-body">
      {items.map((item, index) => (
        <li key={`${index}-${item}`}>{item}</li>
      ))}
    </ul>
  );
}

export function KnowDontKnowBlock({
  known,
  unknown,
  headingLevel = "h3",
  className,
}: KnowDontKnowBlockProps) {
  const Heading = headingLevel;

  return (
    <Card
      as="section"
      padding="md"
      bordered
      className={["grid gap-md sm:grid-cols-2", className]
        .filter(Boolean)
        .join(" ")}
    >
      {/* "What we know" list (Requirement 10.6). */}
      <div className="flex flex-col gap-sm">
        <Heading className="text-h3 font-display">What we know</Heading>
        <EvidenceList
          items={known}
          emptyText="No confirmed findings are available in the sources checked."
        />
      </div>

      {/* "What we don't know" list (Requirement 10.6). */}
      <div className="flex flex-col gap-sm">
        <Heading className="text-h3 font-display">What we don&apos;t know</Heading>
        <EvidenceList
          items={unknown}
          emptyText="No outstanding evidence gaps were noted in the sources checked."
        />
      </div>
    </Card>
  );
}

export default KnowDontKnowBlock;
