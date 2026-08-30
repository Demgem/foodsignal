import type { Metadata } from "next";
import Link from "next/link";
import { StatusIndicator } from "@/components/domain/StatusIndicator";
import { ScoreDisplay } from "@/components/domain/ScoreDisplay";
import { Card, VisuallyHidden } from "@/components/primitives";
import { listProducts, listActiveRecalls } from "@/lib/mock-data";

/**
 * Homepage (`/`) — scan-first entry point (Requirements 14.1, 14.2, 14.3, 14.4,
 * 2.2).
 *
 * The page renders the required hero headline and the two required CTAs
 * verbatim, then supporting sections built entirely from the mock-data layer
 * (R2.2): a value proposition, a sample product highlight (StatusIndicator +
 * ScoreDisplay linking to the product page), a transparency/methodology teaser
 * (linking `/methodology` + `/sources`), and a recall-awareness teaser
 * (linking `/recalls`).
 *
 * Structural constraints:
 * - Exactly ONE H1 (R5.2): the hero headline. All other sections use H2.
 * - This page renders inside the `<main>` landmark owned by the root layout
 *   (app shell), so it never introduces a second `<main>`.
 *
 * Content follows the Content & Language Guidelines: plain-language, calm, and
 * non-alarmist. No prohibited phrasings.
 */

export const metadata: Metadata = {
  title: "FoodSignal — Know what is in your food. Understand the evidence.",
  description:
    "Scan or search a product to see ingredients, additives, allergens, nutrition, recalls and the evidence behind each assessment.",
};

// Shared link-styled-as-button classes, driven by design tokens with a visible
// focus indicator (R20.2). CTAs are links (navigation), so we style anchors
// rather than the Button primitive, which renders a native <button>.
const primaryCta =
  "inline-flex items-center justify-center rounded-md border border-transparent " +
  "bg-brand px-lg py-sm text-body font-semibold text-brand-fg " +
  "transition-colors duration-fast ease-base hover:bg-brand-hover " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-focus " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const secondaryCta =
  "inline-flex items-center justify-center rounded-md border border-border " +
  "bg-surface px-lg py-sm text-body font-semibold text-text-primary " +
  "transition-colors duration-fast ease-base hover:bg-surface-muted " +
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-focus " +
  "focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const textLink =
  "text-brand underline-offset-2 hover:underline focus:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background rounded-sm";

export default function HomePage() {
  // Content via selectors only (R2.2). Pick a calm "safe" example when present,
  // otherwise fall back to the first product so the highlight always renders.
  const products = listProducts();
  const highlight =
    products.find((p) => p.assessment.status === "safe") ?? products[0];

  const activeRecalls = listActiveRecalls();
  const hasActiveRecalls = activeRecalls.length > 0;

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-2xl px-lg py-xl">
      {/* Hero — scan-first (R14.1, R14.2, R14.3). The headline is the single H1. */}
      <section aria-labelledby="hero-heading" className="flex flex-col gap-lg">
        <div className="flex flex-col gap-md">
          <h1
            id="hero-heading"
            className="text-display text-text-primary text-balance"
          >
            {/*
              Visually-hidden brand prefix keeps the single page H1 (R5.2) while
              giving it an accessible name that includes the product name. The
              VISIBLE hero copy remains exactly the required headline (R14.1).
            */}
            <VisuallyHidden>FoodSignal — </VisuallyHidden>
            Know what is in your food. Understand the evidence.
          </h1>
          <p className="max-w-2xl text-body text-text-secondary">
            FoodSignal helps you see the ingredients, additives, allergens,
            nutrition and recalls behind a product — and the evidence each
            assessment is based on.
          </p>
        </div>
        <div className="flex flex-col gap-sm sm:flex-row sm:items-center">
          <Link href="/scan" className={primaryCta}>
            Scan a product
          </Link>
          <Link href="/search" className={secondaryCta}>
            Search a product, ingredient or barcode.
          </Link>
        </div>
      </section>

      {/* Value proposition (R14.4). */}
      <section aria-labelledby="value-heading" className="flex flex-col gap-lg">
        <h2 id="value-heading" className="text-h2 text-text-primary">
          Evidence you can follow
        </h2>
        <div className="grid gap-md sm:grid-cols-3">
          <Card as="article" className="flex flex-col gap-xs">
            <h3 className="text-h3 text-text-primary">Clear status</h3>
            <p className="text-body text-text-secondary">
              A Safe, Caution or Avoid status shown with a label and an icon —
              never colour alone.
            </p>
          </Card>
          <Card as="article" className="flex flex-col gap-xs">
            <h3 className="text-h3 text-text-primary">Separate confidence</h3>
            <p className="text-body text-text-secondary">
              We show how much is known — the quality of the evidence — as a
              separate signal from safety.
            </p>
          </Card>
          <Card as="article" className="flex flex-col gap-xs">
            <h3 className="text-h3 text-text-primary">Sources on the page</h3>
            <p className="text-body text-text-secondary">
              Each assessment links to the regulatory and scientific sources it
              draws on, so you can check for yourself.
            </p>
          </Card>
        </div>
      </section>

      {/* Sample product highlight — StatusIndicator + ScoreDisplay linking to
          the product page (R14.4, R2.2). */}
      {highlight ? (
        <section
          aria-labelledby="highlight-heading"
          className="flex flex-col gap-lg"
        >
          <h2 id="highlight-heading" className="text-h2 text-text-primary">
            A sample assessment
          </h2>
          <Card as="article" padding="lg" className="flex flex-col gap-md">
            <div className="flex flex-col gap-xs">
              <span className="text-label text-text-secondary">
                {highlight.brand}
              </span>
              <h3 className="text-h3 text-text-primary">{highlight.name}</h3>
            </div>
            <div className="flex flex-wrap items-end gap-lg">
              <StatusIndicator status={highlight.assessment.status} size="lg" />
              <ScoreDisplay
                score={highlight.assessment.score}
                label="FoodSignal score"
              />
            </div>
            <p className="text-body text-text-secondary">
              {highlight.assessment.reasons[0]}
            </p>
            <Link
              href={`/products/${highlight.slug}`}
              className={textLink + " text-body font-semibold"}
            >
              See the full assessment for {highlight.name}
            </Link>
          </Card>
        </section>
      ) : null}

      {/* Transparency / methodology teaser linking /methodology + /sources
          (R14.4). */}
      <section
        aria-labelledby="transparency-heading"
        className="flex flex-col gap-lg"
      >
        <h2 id="transparency-heading" className="text-h2 text-text-primary">
          How we describe the evidence
        </h2>
        <Card as="article" className="flex flex-col gap-sm">
          <p className="text-body text-text-secondary">
            Every assessment is presented, not computed for you to take on
            trust. Read how we describe status and confidence, and browse the
            catalogue of sources we draw on.
          </p>
          <div className="flex flex-col gap-sm sm:flex-row sm:gap-lg">
            <Link href="/methodology" className={textLink + " text-body font-semibold"}>
              Read the methodology
            </Link>
            <Link href="/sources" className={textLink + " text-body font-semibold"}>
              Browse the sources
            </Link>
          </div>
        </Card>
      </section>

      {/* Recall-awareness teaser linking /recalls (R14.4). Plain-language and
          non-alarmist per the Content & Language Guidelines. */}
      <section aria-labelledby="recalls-heading" className="flex flex-col gap-lg">
        <h2 id="recalls-heading" className="text-h2 text-text-primary">
          Stay aware of recalls
        </h2>
        <Card as="article" className="flex flex-col gap-sm">
          <p className="text-body text-text-secondary">
            {hasActiveRecalls
              ? `We track product recalls from the sources checked. ${
                  activeRecalls.length === 1
                    ? "There is 1 active recall"
                    : `There are ${activeRecalls.length} active recalls`
                } in the current sample data.`
              : "We track product recalls from the sources checked. No active recall was found in the current sample data."}
          </p>
          <Link href="/recalls" className={textLink + " text-body font-semibold"}>
            View recalls
          </Link>
        </Card>
      </section>
    </div>
  );
}
