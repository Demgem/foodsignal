import type { Metadata } from "next";
import { Card } from "@/components/primitives";

/**
 * Pricing page (`/pricing`) — Requirements 18.1, 18.2, 24.6, 19.2.
 *
 * LAYOUT ONLY. This page renders Free and Premium tiers as static content and
 * performs NO billing logic (Requirements 18.2, 24.6): no payment, no
 * subscription, no checkout. The "subscribe" control is intentionally
 * non-functional and clearly labelled as a prototype affordance.
 *
 * Server component with a single `<h1>` and semantic sections (Requirements
 * 5.2, 20.3); copy is plain-language and non-alarmist (Requirement 19.2).
 */
export const metadata: Metadata = {
  title: "Pricing — FoodSignal",
  description:
    "See how FoodSignal's Free and Premium tiers compare. This is a layout preview only — no billing, payment, or subscription is handled in the prototype.",
};

interface Tier {
  name: string;
  price: string;
  cadence: string;
  summary: string;
  features: ReadonlyArray<string>;
  cta: string;
  emphasized: boolean;
}

const tiers: ReadonlyArray<Tier> = [
  {
    name: "Free",
    price: "£0",
    cadence: "always",
    summary: "Everything you need to look up a product and read the evidence.",
    features: [
      "Search products, ingredients, and additives",
      "Assessment status, score, and key reasons",
      "Ingredient explanations and allergen information",
      "Recall awareness and source references",
    ],
    cta: "Your current plan",
    emphasized: false,
  },
  {
    name: "Premium",
    price: "£4",
    cadence: "per month",
    summary: "Deeper personalization and saved history for regular use.",
    features: [
      "Everything in Free",
      "Personalized allergen and diet warnings",
      "Saved products, history, and recall alerts",
      "Side-by-side comparison across markets",
    ],
    cta: "Subscribe",
    emphasized: true,
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-xl px-lg py-2xl">
      <header className="flex flex-col gap-sm">
        <h1 className="text-h1 font-display text-text-primary">Pricing</h1>
        <p className="text-body text-text-secondary">
          FoodSignal is built to be useful for free, with an optional Premium
          tier for people who want personalization and saved history. Compare the
          tiers below.
        </p>
      </header>

      {/* Prototype boundary note — no billing runs here (Requirements 18.2, 24.6). */}
      <div
        role="note"
        className="rounded-md border border-border bg-surface-muted px-md py-sm text-caption text-text-secondary"
      >
        <span className="font-semibold text-text-primary">Prototype note:</span>{" "}
        This page is a layout preview only. No payment, subscription, or billing
        is handled, and the prices shown are illustrative. The subscribe button is
        intentionally non-functional.
      </div>

      <section aria-labelledby="tiers-heading" className="flex flex-col gap-md">
        <h2 id="tiers-heading" className="text-h2 text-text-primary">
          Compare tiers
        </h2>
        <ul className="grid grid-cols-1 gap-md sm:grid-cols-2">
          {tiers.map((tier) => (
            <li key={tier.name}>
              <Card
                as="article"
                padding="lg"
                elevation={tier.emphasized ? "sm" : "none"}
                aria-labelledby={`tier-${tier.name.toLowerCase()}-heading`}
                className="flex h-full flex-col gap-md"
              >
                <div className="flex flex-col gap-xs">
                  <h3
                    id={`tier-${tier.name.toLowerCase()}-heading`}
                    className="text-h3 text-text-primary"
                  >
                    {tier.name}
                  </h3>
                  <p className="flex items-baseline gap-xs">
                    <span className="text-display font-display tabular-nums text-text-primary">
                      {tier.price}
                    </span>
                    <span className="text-caption text-text-secondary">
                      {tier.cadence}
                    </span>
                  </p>
                  <p className="text-body text-text-secondary">{tier.summary}</p>
                </div>

                <ul className="flex flex-col gap-xs">
                  {tier.features.map((feature) => (
                    <li
                      key={feature}
                      className="flex gap-sm text-body text-text-secondary"
                    >
                      <span aria-hidden="true" className="text-brand">
                        &#10003;
                      </span>
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>

                <div className="mt-auto flex flex-col gap-xs">
                  <button
                    type="button"
                    disabled
                    aria-disabled="true"
                    className="inline-flex items-center justify-center rounded-md bg-brand px-md py-sm text-label font-semibold text-brand-fg opacity-60"
                  >
                    {tier.cta} (disabled in prototype)
                  </button>
                  <p className="text-caption text-text-muted">
                    Non-functional in this prototype.
                  </p>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
