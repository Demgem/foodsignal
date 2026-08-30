import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/primitives";

/**
 * About page (`/about`) — Requirements 18.1, 19.1, 19.2, 22.1.
 *
 * Editorial page describing what FoodSignal is and the mission behind it:
 * evidence-first food intelligence. It states plainly that this is a prototype
 * that renders sample data and performs no assessment. Copy is plain-language
 * and non-alarmist and avoids the prohibited phrasings (Requirement 19.2).
 *
 * Server component: static markup only, rendered into the `<main>` landmark
 * from the root layout. Single `<h1>` and semantic sections (Requirements 5.2,
 * 20.3).
 */
export const metadata: Metadata = {
  title: "About — FoodSignal",
  description:
    "FoodSignal helps people understand what is in their food and interpret the evidence behind it. Learn about the mission behind this evidence-first prototype.",
};

const principles: ReadonlyArray<{ title: string; detail: string }> = [
  {
    title: "Evidence first",
    detail:
      "We lead with what is known, how confident the evidence is, and where it comes from — plain language first, technical detail second.",
  },
  {
    title: "Confidence, kept separate",
    detail:
      "How much is known about a product is shown apart from its safety status, so evidence quality is never confused with how risky something is.",
  },
  {
    title: "Calm and clear",
    detail:
      "Information is presented without fear-based framing, so you can read it, understand it, and decide for yourself.",
  },
  {
    title: "Transparent sources",
    detail:
      "Assessments point back to the sources they rely on, and corrections can be reported, so the reasoning stays open to review.",
  },
];

export default function AboutPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-xl px-lg py-2xl">
      <header className="flex flex-col gap-sm">
        <h1 className="text-h1 font-display text-text-primary">About FoodSignal</h1>
        <p className="text-body text-text-secondary">
          FoodSignal helps people understand what is in their food and make sense
          of the evidence behind it. Our aim is evidence-first food intelligence:
          clear answers, an honest view of how much is known, and sources you can
          check.
        </p>
      </header>

      <div
        role="note"
        className="rounded-md border border-border bg-surface-muted px-md py-sm text-caption text-text-secondary"
      >
        <span className="font-semibold text-text-primary">Prototype note:</span>{" "}
        This is a design and layout prototype. Every product, score, and recall
        shown is sample data. No assessment is computed and nothing is sent
        anywhere.
      </div>

      <section aria-labelledby="mission-heading" className="flex flex-col gap-md">
        <h2 id="mission-heading" className="text-h2 text-text-primary">
          Our mission
        </h2>
        <p className="text-body text-text-secondary">
          Food labels can be hard to read, and the evidence behind ingredients,
          additives, and recalls is often scattered and technical. FoodSignal
          brings that information together in one calm, readable place — what a
          product contains, what the evidence says, how confident that evidence
          is, and which sources support it.
        </p>
        <p className="text-body text-text-secondary">
          We want people to feel informed rather than alarmed. That means plain
          language, a clear separation between safety status and evidence
          confidence, and transparency about what we know and what we do not.
        </p>
      </section>

      <section aria-labelledby="principles-heading" className="flex flex-col gap-md">
        <h2 id="principles-heading" className="text-h2 text-text-primary">
          What guides us
        </h2>
        <ul className="grid grid-cols-1 gap-md sm:grid-cols-2">
          {principles.map((principle) => (
            <li key={principle.title}>
              <Card as="article" padding="lg" className="flex h-full flex-col gap-xs">
                <h3 className="text-h3 text-text-primary">{principle.title}</h3>
                <p className="text-body text-text-secondary">{principle.detail}</p>
              </Card>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="explore-heading" className="flex flex-col gap-md">
        <h2 id="explore-heading" className="text-h2 text-text-primary">
          Explore the prototype
        </h2>
        <p className="text-body text-text-secondary">
          You can read how assessments are described on the{" "}
          <Link
            href="/methodology"
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            methodology
          </Link>{" "}
          page, or start by{" "}
          <Link
            href="/search"
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            searching for a product
          </Link>
          .
        </p>
      </section>
    </div>
  );
}
