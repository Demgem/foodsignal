import type { Metadata } from "next";
import Link from "next/link";

import { RecallBanner } from "@/components/domain/RecallBanner";
import { Card } from "@/components/primitives";
import { listRecalls, type Recall } from "@/lib/mock-data";

/**
 * Recalls listing page — `/recalls` (Requirements 17.4, 23.5).
 *
 * Renders a listing of every recall from the mock-data selectors only
 * (no network, no computation — design "Layering Rules"). For each recall it
 * shows the product name, market, date, and an ACTIVE/resolved status that is
 * distinguished by TEXT + a label — never by color alone (design
 * "Accessibility", Requirement 20.11). Each entry links to its detail page at
 * `/recalls/[slug]`.
 *
 * When there are active recalls, they are surfaced prominently at the top via
 * the `RecallBanner` domain component (design "Recall Precedence"). Copy stays
 * plain and non-alarmist throughout (design "Content & Language Guidelines").
 */

export const metadata: Metadata = {
  title: "Recalls — FoodSignal",
  description:
    "Active and resolved product recalls with product, market, date, and status. Rendered from sample data in this prototype.",
};

/** Render an ISO date string as a clear, human-readable date. */
function formatRecallDate(isoDate: string): string {
  const parsed = new Date(isoDate);
  if (Number.isNaN(parsed.getTime())) {
    return isoDate;
  }
  return parsed.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

/**
 * A single recall row. Status is conveyed with a text label ("Active recall" /
 * "Resolved") plus an explicit prefix word, so it is understandable without
 * relying on color. The token-driven surface is reinforcement only.
 */
function RecallListItem({ recall }: { recall: Recall }) {
  const statusLabel = recall.active ? "Active recall" : "Resolved";
  const statusHint = recall.active
    ? "This recall is currently listed as active in the sources checked."
    : "This recall has since been closed in the sources checked.";

  return (
    <li>
      <Card as="article" padding="md" bordered>
        <div className="flex flex-col gap-sm">
          <div className="flex flex-col gap-xs sm:flex-row sm:items-baseline sm:justify-between">
            <h3 className="text-h3 text-text-primary">
              <Link
                href={`/recalls/${recall.slug}`}
                className="rounded-md text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
              >
                {recall.productName}
              </Link>
            </h3>
            <span
              className={[
                "inline-flex w-fit items-center rounded-md border px-sm py-xs text-label",
                recall.active
                  ? "border-status-caution-border bg-status-caution-surface text-status-caution-fg"
                  : "border-border bg-surface-muted text-text-secondary",
              ].join(" ")}
            >
              {/* Text label carries the meaning without color (R20.11). */}
              {statusLabel}
            </span>
          </div>

          <dl className="m-0 flex flex-col gap-xs text-body">
            <div className="flex flex-col gap-xs sm:flex-row sm:gap-sm">
              <dt className="text-label text-text-secondary">Market</dt>
              <dd className="m-0">{recall.market}</dd>
            </div>
            <div className="flex flex-col gap-xs sm:flex-row sm:gap-sm">
              <dt className="text-label text-text-secondary">Date</dt>
              <dd className="m-0">
                <time dateTime={recall.date}>{formatRecallDate(recall.date)}</time>
              </dd>
            </div>
            <div className="flex flex-col gap-xs sm:flex-row sm:gap-sm">
              <dt className="text-label text-text-secondary">Status</dt>
              <dd className="m-0">{statusHint}</dd>
            </div>
          </dl>

          <p>
            <Link
              href={`/recalls/${recall.slug}`}
              className="rounded-md text-label text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              View recall details
            </Link>
          </p>
        </div>
      </Card>
    </li>
  );
}

export default function RecallsListPage() {
  const allRecalls = listRecalls();
  const activeRecalls = allRecalls.filter((recall) => recall.active);
  const resolvedRecalls = allRecalls.filter((recall) => !recall.active);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-xl px-lg py-xl">
      {/* Identity (single H1 per page) */}
      <header className="flex flex-col gap-sm">
        <p className="text-label uppercase tracking-wide text-text-secondary">
          Recalls
        </p>
        <h1 className="text-h1 text-text-primary">Product recalls</h1>
        <p className="text-body text-text-secondary">
          Recalls reported in the sources checked for this prototype. Each entry
          shows the product, market, date, and whether the recall is currently
          active or has been resolved.
        </p>
      </header>

      {/* Surface active recalls prominently near the top (Recall Precedence). */}
      {activeRecalls.length > 0 ? (
        <section aria-labelledby="recalls-active-heading" className="flex flex-col gap-md">
          <h2 id="recalls-active-heading" className="sr-only">
            Active recalls
          </h2>
          <RecallBanner recalls={activeRecalls} />
        </section>
      ) : null}

      {/* Full listing, grouped by active vs resolved with text headings. */}
      <section aria-labelledby="recalls-listing-heading" className="flex flex-col gap-lg">
        <h2 id="recalls-listing-heading" className="text-h2 text-text-primary">
          All recalls
        </h2>

        {allRecalls.length === 0 ? (
          <p className="text-body text-text-secondary">
            No active recall found in the sources checked.
          </p>
        ) : (
          <>
            <div className="flex flex-col gap-md">
              <h3 className="text-h3 text-text-primary">
                Active recalls ({activeRecalls.length})
              </h3>
              {activeRecalls.length > 0 ? (
                <ul className="flex list-none flex-col gap-md p-0">
                  {activeRecalls.map((recall) => (
                    <RecallListItem key={recall.slug} recall={recall} />
                  ))}
                </ul>
              ) : (
                <p className="text-body text-text-secondary">
                  No active recall found in the sources checked.
                </p>
              )}
            </div>

            <div className="flex flex-col gap-md">
              <h3 className="text-h3 text-text-primary">
                Resolved recalls ({resolvedRecalls.length})
              </h3>
              {resolvedRecalls.length > 0 ? (
                <ul className="flex list-none flex-col gap-md p-0">
                  {resolvedRecalls.map((recall) => (
                    <RecallListItem key={recall.slug} recall={recall} />
                  ))}
                </ul>
              ) : (
                <p className="text-body text-text-secondary">
                  No resolved recalls are listed in the sources checked.
                </p>
              )}
            </div>
          </>
        )}
      </section>
    </div>
  );
}
