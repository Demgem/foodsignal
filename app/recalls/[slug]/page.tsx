import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

// Import domain components from their individual module files (not the
// `@/components/domain` barrel) so this server component's module graph does
// not transitively include unrelated components.
import { RecallBanner } from "@/components/domain/RecallBanner";
import { SourceChip } from "@/components/domain/SourceChip";
import { Card } from "@/components/primitives";
import { getRecallBySlug, listRecalls } from "@/lib/mock-data";

interface RecallPageProps {
  params: { slug: string };
}

/**
 * Recall detail page — `/recalls/[slug]` (Requirements 17.5, 23.5).
 *
 * Resolves the recall via `getRecallBySlug` (mock selectors only — no network,
 * no computation) and renders its specifics: product, market, reason, date, and
 * an ACTIVE/resolved status distinguished by text + label (never color alone,
 * R20.11), the affected markets, and the backing source references rendered as
 * `SourceChip`s.
 *
 * When the recall is active, it is surfaced prominently at the top via the
 * `RecallBanner` domain component (design "Recall Precedence"). Unknown slugs
 * resolve to `null` from the selector and render the shared Not_Found_Layout
 * via `notFound()` (R23.5). Copy stays plain and non-alarmist throughout
 * (design "Content & Language Guidelines").
 */

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
 * Pre-render a static path per known recall slug (design allows optional
 * `generateStaticParams` to keep the prototype fully static). Unknown slugs
 * still fall back to `notFound()`.
 */
export function generateStaticParams(): Array<{ slug: string }> {
  return listRecalls().map((recall) => ({ slug: recall.slug }));
}

export function generateMetadata({ params }: RecallPageProps): Metadata {
  const recall = getRecallBySlug(params.slug);

  if (!recall) {
    return {
      title: "Recall not found — FoodSignal",
      description:
        "This recall could not be found in the sample data for this prototype.",
    };
  }

  const statusWord = recall.active ? "Active" : "Resolved";
  return {
    title: `${recall.productName} recall — FoodSignal`,
    description: `${statusWord} recall for ${recall.productName} in ${recall.market}: reason, date, affected markets, and source references. Rendered from sample data in this prototype.`,
  };
}

export default function RecallDetailPage({ params }: RecallPageProps) {
  const recall = getRecallBySlug(params.slug);

  if (!recall) {
    notFound();
  }

  const statusLabel = recall.active ? "Active recall" : "Resolved";
  const statusHint = recall.active
    ? "This recall is currently listed as active in the sources checked."
    : "This recall has since been closed in the sources checked.";

  return (
    <div className="mx-auto flex w-full max-w-4xl flex-col gap-xl px-lg py-xl">
      {/* Identity (single H1 per page) */}
      <header className="flex flex-col gap-sm">
        <p className="text-label uppercase tracking-wide text-text-secondary">
          Recall
        </p>
        <h1 className="text-h1 text-text-primary">{recall.productName}</h1>
        <div className="flex items-center gap-sm">
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
        <p className="text-body text-text-secondary">
          <Link
            href="/recalls"
            className="rounded-md text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Back to all recalls
          </Link>
        </p>
      </header>

      {/* Surface active recalls prominently near the top (Recall Precedence). */}
      {recall.active ? (
        <section aria-labelledby="recall-banner-section-heading" className="flex flex-col gap-md">
          <h2 id="recall-banner-section-heading" className="sr-only">
            Active recall notice
          </h2>
          <RecallBanner recalls={[recall]} />
        </section>
      ) : null}

      {/* Recall specifics */}
      <section aria-labelledby="recall-details-heading" className="flex flex-col gap-md">
        <h2 id="recall-details-heading" className="text-h2 text-text-primary">
          Recall details
        </h2>
        <Card as="div" padding="md" bordered>
          <dl className="m-0 flex flex-col gap-md text-body">
            <div className="flex flex-col gap-xs sm:flex-row sm:gap-sm">
              <dt className="text-label text-text-secondary sm:w-40">Product</dt>
              <dd className="m-0">{recall.productName}</dd>
            </div>
            <div className="flex flex-col gap-xs sm:flex-row sm:gap-sm">
              <dt className="text-label text-text-secondary sm:w-40">Market</dt>
              <dd className="m-0">{recall.market}</dd>
            </div>
            <div className="flex flex-col gap-xs sm:flex-row sm:gap-sm">
              <dt className="text-label text-text-secondary sm:w-40">Date</dt>
              <dd className="m-0">
                <time dateTime={recall.date}>{formatRecallDate(recall.date)}</time>
              </dd>
            </div>
            <div className="flex flex-col gap-xs sm:flex-row sm:gap-sm">
              <dt className="text-label text-text-secondary sm:w-40">Status</dt>
              <dd className="m-0">
                {statusLabel} — {statusHint}
              </dd>
            </div>
            <div className="flex flex-col gap-xs sm:flex-row sm:gap-sm">
              <dt className="text-label text-text-secondary sm:w-40">Reason</dt>
              <dd className="m-0">{recall.reason}</dd>
            </div>
          </dl>
        </Card>
      </section>

      {/* Affected markets */}
      <section aria-labelledby="recall-markets-heading" className="flex flex-col gap-md">
        <h2 id="recall-markets-heading" className="text-h2 text-text-primary">
          Affected markets
        </h2>
        <p className="text-body text-text-secondary">
          This recall is listed for the following market in the sources checked:
        </p>
        <ul className="flex list-none flex-col gap-xs p-0">
          <li className="text-body text-text-primary">{recall.market}</li>
        </ul>
      </section>

      {/* Source references */}
      <section aria-labelledby="recall-sources-heading" className="flex flex-col gap-md">
        <h2 id="recall-sources-heading" className="text-h2 text-text-primary">
          Source references
        </h2>
        {recall.sources.length > 0 ? (
          <ul className="flex list-none flex-wrap gap-xs p-0">
            {recall.sources.map((source) => (
              <li key={source.id} className="inline-flex">
                <SourceChip source={source} />
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-body text-text-secondary">
            No source references were listed for this recall.
          </p>
        )}
      </section>
    </div>
  );
}
