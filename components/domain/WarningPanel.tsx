import type { Product, UserProfile, Allergen } from "@/lib/mock-data/types";
import { Card, Icon } from "@/components/primitives";

/**
 * WarningPanel (personalized) — Requirements 10.1, 10.2, 20.11
 *
 * Surfaces personalized allergen matches derived from a mock `UserProfile`
 * compared against a `Product`. In the prototype, matches are computed from
 * mock data only (no I/O); all content arrives via props (Requirement 10.2).
 *
 * Design invariants (see design.md — "WarningPanel (personalized)",
 * "Personalization", "Accessibility"):
 * - Understandable WITHOUT color OR animation (Requirement 20.11): meaning is
 *   carried entirely by a clear heading, a non-color icon with an accessible
 *   name, and plain text. The token-driven surface colors are reinforcement
 *   only — stripping them leaves the message fully intelligible.
 *
 * Conservative matching (per the design's conservative posture):
 * - A profile allergy is matched case-insensitively against the product's
 *   declared allergens.
 * - `Allergen.declared === true`  -> a CONFIRMED declared-allergen match. This
 *   is stated plainly and unambiguously.
 * - `Allergen.declared === false` -> the allergen is present in the product's
 *   allergen list but NOT declared (e.g. a "may contain" / undeclared trace
 *   possibility). These are surfaced separately with more cautious wording so
 *   a confirmed match is never conflated with an undeclared possibility.
 *
 * Absence handling: when the profile has no allergies that intersect the
 * product's allergen list, the panel renders a neutral "no personalized
 * warnings" note rather than nothing, so the personalization state is always
 * legible on the page.
 */
export interface WarningPanelProps {
  profile: UserProfile;
  product: Product;
  /**
   * Optional heading level so the panel slots into a page's heading outline.
   * Defaults to `h3` (the Allergens section owns the `h2`).
   */
  headingLevel?: "h2" | "h3";
  className?: string;
}

interface AllergenMatch {
  /** The product allergen name as declared in the fixture. */
  allergenName: string;
  /** The profile allergy string that matched (original casing preserved). */
  profileAllergy: string;
  /** True when the product explicitly declares this allergen. */
  declared: boolean;
}

/**
 * Derive allergen matches by comparing the profile's allergies against the
 * product's allergen list, case-insensitively. Pure function — no side
 * effects, no I/O.
 */
function deriveAllergenMatches(
  profile: UserProfile,
  product: Product,
): AllergenMatch[] {
  const allergies = profile.allergies ?? [];
  const allergens: Allergen[] = product.allergens ?? [];

  const matches: AllergenMatch[] = [];
  for (const allergen of allergens) {
    const allergenLower = allergen.name.trim().toLowerCase();
    const matchedAllergy = allergies.find(
      (allergy) => allergy.trim().toLowerCase() === allergenLower,
    );
    if (matchedAllergy !== undefined) {
      matches.push({
        allergenName: allergen.name,
        profileAllergy: matchedAllergy,
        declared: allergen.declared,
      });
    }
  }
  return matches;
}

/**
 * A warning triangle whose accessible name means the icon carries meaning on
 * its own for assistive tech, so the panel stays understandable even when
 * color is stripped (Requirement 20.11).
 */
function WarningIcon() {
  return (
    <Icon label="Personalized warning" size="1.5rem" viewBox="0 0 24 24">
      <path
        d="M12 3.5a1.5 1.5 0 0 1 1.31.77l8.2 14.36A1.5 1.5 0 0 1 20.2 21H3.8a1.5 1.5 0 0 1-1.31-2.37l8.2-14.36A1.5 1.5 0 0 1 12 3.5Zm0 4.75a1 1 0 0 0-1 1v4.25a1 1 0 1 0 2 0V9.25a1 1 0 0 0-1-1Zm0 8.25a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Icon>
  );
}

export function WarningPanel({
  profile,
  product,
  headingLevel = "h3",
  className,
}: WarningPanelProps) {
  const Heading = headingLevel;
  const matches = deriveAllergenMatches(profile, product);

  // Neutral, non-alarmist note when there is nothing personalized to surface.
  if (matches.length === 0) {
    return (
      <Card
        as="section"
        role="region"
        aria-labelledby="warning-panel-title"
        padding="md"
        bordered
        className={["bg-surface text-text-primary", className]
          .filter(Boolean)
          .join(" ")}
      >
        <Heading id="warning-panel-title" className="text-h3 font-display">
          No personalized warnings
        </Heading>
        <p className="mt-sm text-body text-text-secondary">
          None of the allergens in your profile were found in this product&rsquo;s
          allergen information in the sources checked.
        </p>
      </Card>
    );
  }

  const confirmed = matches.filter((m) => m.declared);
  const undeclared = matches.filter((m) => !m.declared);

  return (
    <Card
      as="section"
      role="region"
      aria-labelledby="warning-panel-title"
      padding="md"
      bordered
      className={[
        // Color families are reinforcement only; the heading + icon + text
        // carry the meaning without them (Requirement 20.11).
        "border-status-caution-border bg-status-caution-surface text-status-caution-fg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-sm">
        <span className="mt-xs inline-flex shrink-0 items-center">
          <WarningIcon />
        </span>
        <div className="flex flex-col gap-sm">
          <Heading id="warning-panel-title" className="text-h3 font-display">
            Personalized allergen warning
          </Heading>
          <p className="text-body">
            Based on the allergies saved to your profile, this product&rsquo;s
            allergen information includes the following matches.
          </p>

          {confirmed.length > 0 ? (
            <div className="flex flex-col gap-xs">
              <p className="text-label">Declared in this product</p>
              <ul className="flex list-none flex-col gap-xs p-0">
                {confirmed.map((match) => (
                  <li key={`declared-${match.allergenName}`} className="text-body">
                    <span className="font-semibold">{match.allergenName}</span> is a
                    declared allergen in this product and matches your profile.
                  </li>
                ))}
              </ul>
            </div>
          ) : null}

          {undeclared.length > 0 ? (
            <div className="flex flex-col gap-xs">
              <p className="text-label">Listed but not declared</p>
              <ul className="flex list-none flex-col gap-xs p-0">
                {undeclared.map((match) => (
                  <li key={`undeclared-${match.allergenName}`} className="text-body">
                    <span className="font-semibold">{match.allergenName}</span> appears
                    in this product&rsquo;s allergen information but is not listed as a
                    declared allergen. Treat this as a possible match to check.
                  </li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      </div>
    </Card>
  );
}

export default WarningPanel;
