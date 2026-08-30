import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/primitives";

/**
 * Data policy (`/data-policy`) — Requirements 18.1, 19.1, 19.2, 22.1.
 *
 * Plain-language layout describing how data and provenance are handled: where
 * information comes from, how confidence and freshness are shown, and how
 * corrections are handled. Placeholder content for the prototype. Copy is
 * plain-language first (Requirement 19.1) and avoids the prohibited phrasings
 * (Requirement 19.2).
 *
 * Server component with a single `<h1>` and semantic sections (Requirements
 * 5.2, 20.3).
 */
export const metadata: Metadata = {
  title: "Data policy — FoodSignal",
  description:
    "How FoodSignal would handle data and provenance: where information comes from, how confidence and freshness are shown, and how corrections work. Prototype layout.",
};

interface Section {
  id: string;
  heading: string;
  body: ReadonlyArray<string>;
}

const sections: ReadonlyArray<Section> = [
  {
    id: "where-data-comes-from",
    heading: "Where data comes from",
    body: [
      "This section would describe the kinds of sources FoodSignal draws on — such as regulatory records, published research, and recall notices — and how each source type is categorized.",
      "Every assessment points back to the sources it relies on so the reasoning stays open to review.",
    ],
  },
  {
    id: "provenance-and-confidence",
    heading: "Provenance and confidence",
    body: [
      "Provenance means being clear about where a piece of information came from. Alongside it, an evidence confidence level shows how much is known.",
      "Confidence describes evidence quality, not danger. It is shown separately from a product's safety status so the two are never confused.",
    ],
  },
  {
    id: "freshness",
    heading: "Freshness",
    body: [
      "This section would explain how the age of information is shown, so you can see when data was last reviewed and judge how current it is.",
    ],
  },
  {
    id: "corrections",
    heading: "Corrections",
    body: [
      "When something looks wrong, a correction can be reported from the relevant product page. The finished policy would describe how corrections are reviewed and reflected.",
    ],
  },
];

export default function DataPolicyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-xl px-lg py-2xl">
      <header className="flex flex-col gap-sm">
        <h1 className="text-h1 font-display text-text-primary">Data policy</h1>
        <p className="text-body text-text-secondary">
          How FoodSignal handles data and provenance — where information comes
          from, how confidence and freshness are shown, and how corrections are
          handled.
        </p>
      </header>

      <div
        role="note"
        className="rounded-md border border-border bg-surface-muted px-md py-sm text-caption text-text-secondary"
      >
        <span className="font-semibold text-text-primary">Prototype note:</span>{" "}
        This is a placeholder layout. In the prototype all content is sample data,
        no live sources are queried, and nothing is stored.
      </div>

      {sections.map((section) => (
        <section
          key={section.id}
          aria-labelledby={`${section.id}-heading`}
          className="flex flex-col gap-sm"
        >
          <h2 id={`${section.id}-heading`} className="text-h2 text-text-primary">
            {section.heading}
          </h2>
          {section.body.map((paragraph, index) => (
            <p key={index} className="text-body text-text-secondary">
              {paragraph}
            </p>
          ))}
        </section>
      ))}

      <Card as="section" padding="lg" aria-labelledby="transparency-heading" className="flex flex-col gap-xs">
        <h2 id="transparency-heading" className="text-h3 text-text-primary">
          See the sources
        </h2>
        <p className="text-body text-text-secondary">
          You can browse the kinds of sources used on the{" "}
          <Link
            href="/sources"
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            sources
          </Link>{" "}
          page, or read how assessments are described in the{" "}
          <Link
            href="/methodology"
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            methodology
          </Link>{" "}
          page.
        </p>
      </Card>
    </div>
  );
}
