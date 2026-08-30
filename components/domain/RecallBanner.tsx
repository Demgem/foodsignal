import { useId } from "react";

import type { Recall } from "@/lib/mock-data/types";
import { Card, Icon } from "@/components/primitives";

/**
 * RecallBanner (Requirements 8.1, 8.3, 10.1, 10.2, 19.4, 20.11)
 *
 * Prominent, calm notice for active product recalls.
 *
 * Design invariants (see design.md — "Recall Precedence", "RecallBanner",
 * "Content & Language Guidelines"):
 * - Surfaces active recalls prominently near the top of the product page,
 *   independent of the score. This component never suppresses itself in favour
 *   of a score; the score/recall precedence is enforced by the page layer,
 *   which renders this banner regardless of the score (Requirement 8.2).
 * - Understandable WITHOUT reliance on color OR animation (Requirements 8.3,
 *   20.11): meaning is carried by a clear heading/label ("Active recall
 *   identified"), a non-color icon, and plain text — never by color or motion.
 *   The token-driven caution surface is reinforcement only.
 * - States the recalled product name, market, and reason for every active
 *   recall in plain, non-alarmist language (Requirement 19.4).
 *
 * Data model (Requirements 10.1, 10.2): all content arrives via the `recalls`
 * prop supplied by the route/page layer. The component performs no fetching or
 * filtering of "active" state beyond honouring what it is given — callers pass
 * the active recalls to surface.
 *
 * Absence handling: with an empty `recalls` array there is no active recall to
 * surface, so the banner renders nothing. The "No active recall found in the
 * sources checked." copy (Requirement 19.3) is owned by the product page's
 * Recalls section, not this banner.
 */
export interface RecallBannerProps {
  /** The active recalls to surface. An empty array renders nothing. */
  recalls: Recall[];
  /**
   * Optional heading level for the banner title so the banner slots correctly
   * into a page's heading outline. Defaults to `h2`.
   */
  headingLevel?: "h2" | "h3";
  /**
   * Optional accessible name for the banner's `role="region"` landmark. Supply
   * a distinct value when the same product renders more than one RecallBanner
   * (e.g. ProductDetail's prominent top-of-page banner vs. the Recalls-section
   * banner) so the landmarks remain distinguishable to assistive tech (axe
   * `landmark-unique`). When omitted, the region is named by its visible
   * heading via `aria-labelledby`.
   */
  regionLabel?: string;
  className?: string;
}

/**
 * A simple warning triangle used to reinforce the text label. The accessible
 * name means the icon carries meaning on its own for assistive tech, so the
 * notice remains understandable even if visual styling (color) is stripped.
 */
function RecallIcon() {
  return (
    <Icon label="Recall notice" size="1.5rem" viewBox="0 0 24 24">
      <path
        d="M12 3.5a1.5 1.5 0 0 1 1.31.77l8.2 14.36A1.5 1.5 0 0 1 20.2 21H3.8a1.5 1.5 0 0 1-1.31-2.37l8.2-14.36A1.5 1.5 0 0 1 12 3.5Zm0 4.75a1 1 0 0 0-1 1v4.25a1 1 0 1 0 2 0V9.25a1 1 0 0 0-1-1Zm0 8.25a1.15 1.15 0 1 0 0 2.3 1.15 1.15 0 0 0 0-2.3Z"
        fillRule="evenodd"
        clipRule="evenodd"
      />
    </Icon>
  );
}

export function RecallBanner({
  recalls,
  headingLevel = "h2",
  regionLabel,
  className,
}: RecallBannerProps) {
  // A stable, unique id per rendered instance. `useId()` guarantees the id is
  // unique even when the same component is rendered multiple times on one page
  // (e.g. ProductDetail renders RecallBanner both as the top-of-page banner and
  // inside the Recalls section). This keeps the DOM `id` unique (valid HTML) and
  // gives each `role="region"` landmark a distinct accessible name so the axe
  // `landmark-unique` rule is satisfied. Hooks must run before any early return.
  const titleId = `recall-banner-title-${useId()}`;

  // Nothing to surface: render null rather than an empty banner. The neutral
  // "no active recall" copy lives on the product page's Recalls section.
  if (!recalls || recalls.length === 0) {
    return null;
  }

  const Heading = headingLevel;
  const isSingle = recalls.length === 1;
  const title = isSingle
    ? "Active recall identified"
    : `${recalls.length} active recalls identified`;

  return (
    <Card
      as="section"
      role="region"
      // When a `regionLabel` is supplied, it names the landmark (so multiple
      // banners on one page stay distinguishable). Otherwise the landmark is
      // named by its visible heading. Only one naming mechanism is used at a
      // time to avoid a redundant/ambiguous accessible name.
      aria-label={regionLabel}
      aria-labelledby={regionLabel ? undefined : titleId}
      padding="md"
      bordered
      className={[
        // Color families are reinforcement only; the label + icon + text carry
        // the meaning without them (Requirements 8.3, 20.11).
        "border-status-caution-border bg-status-caution-surface text-status-caution-fg",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <div className="flex items-start gap-sm">
        <span className="mt-xs inline-flex shrink-0 items-center" aria-hidden="false">
          <RecallIcon />
        </span>
        <div className="flex flex-col gap-sm">
          <Heading id={titleId} className="text-h3 font-display">
            {title}
          </Heading>

          <p className="text-body">
            {isSingle
              ? "A recall has been reported for this product in the sources checked. Here is what the recall notice says."
              : "Recalls have been reported for this product in the sources checked. Here is what each recall notice says."}
          </p>

          <ul className="flex list-none flex-col gap-sm p-0">
            {recalls.map((recall, index) => (
              <li
                key={recall.slug ?? `${recall.productName}-${index}`}
                className="flex flex-col gap-xs"
              >
                <p className="text-label">{recall.productName}</p>
                <dl className="m-0 flex flex-col gap-xs text-body">
                  <div className="flex flex-col gap-xs sm:flex-row sm:gap-sm">
                    <dt className="text-label text-text-secondary">Market</dt>
                    <dd className="m-0">{recall.market}</dd>
                  </div>
                  <div className="flex flex-col gap-xs sm:flex-row sm:gap-sm">
                    <dt className="text-label text-text-secondary">Reason</dt>
                    <dd className="m-0">{recall.reason}</dd>
                  </div>
                </dl>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </Card>
  );
}

export default RecallBanner;
