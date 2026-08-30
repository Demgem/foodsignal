import type { Metadata } from "next";

import { JsonLd } from "@/components/JsonLd";
import { buildFaqPageStub } from "@/lib/seo";

/**
 * Methodology page — `/methodology` (Requirements 17.7, 22.1).
 *
 * An educational, plain-language description of HOW assessments are PRESENTED
 * in FoodSignal. It does not describe or perform any computation — the
 * prototype renders authored mock data only. The intent is to make the
 * presentation layer transparent: what Safe / Caution / Avoid mean, how to read
 * the 0–100 score, that confidence describes evidence quality rather than
 * danger, and the guardrails that keep the presentation honest (recalls
 * overriding the score; preferring "insufficient evidence" over invention).
 *
 * Copy follows the design's Content & Language Guidelines: plain-language
 * first, calm and non-alarmist, and free of the prohibited phrasings.
 */

export const metadata: Metadata = {
  title: "Methodology — How assessments are presented — FoodSignal",
  description:
    "How FoodSignal presents food assessments: what Safe, Caution and Avoid mean, how to read the 0–100 score, what evidence confidence describes, and the guardrails behind the presentation.",
};

/**
 * FAQPage structured-data placeholder stub (Requirement 22.2).
 *
 * The methodology page is framed as questions and answers ("What Safe, Caution
 * and Avoid mean", "Reading the 0–100 score", etc.), so a `FAQPage` stub is
 * genuinely applicable. These mirror the on-page copy in plain language and are
 * design-level placeholders only.
 */
const methodologyFaqStub = buildFaqPageStub([
  {
    question: "What do Safe, Caution and Avoid mean?",
    answer:
      "Every assessment carries one of three statuses, each shown with a text label and a distinct shape so it can be understood without relying on color. Safe means nothing in the sources checked stands out. Caution means there is something worth reading about before you decide. Avoid means a clear reason stands out, such as an active recall.",
  },
  {
    question: "How should I read the 0–100 score?",
    answer:
      "The score is a communication layer that summarises the status and reasons at a glance so you can compare products quickly. Read it alongside the status and the listed reasons rather than on its own.",
  },
  {
    question: "What does evidence confidence describe?",
    answer:
      "Confidence describes how much is known and how well it is supported by the sources checked — the quality of the evidence, not how risky a product is. It is kept visually separate from safety status.",
  },
  {
    question: "What guardrails keep the presentation honest?",
    answer:
      "Recalls are shown prominently and never hidden behind the score, missing details are stated plainly rather than guessed, the regulatory market is always identified, and the sources behind each statement are surfaced.",
  },
]);

export default function MethodologyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-xl px-lg py-xl">
      {/* FAQPage structured-data placeholder stub (R22.2). Renders no UI. */}
      <JsonLd stubs={[methodologyFaqStub]} />
      {/* Overview (single H1 per page) */}
      <header className="flex flex-col gap-sm">
        <p className="text-label uppercase tracking-wide text-text-secondary">
          Methodology
        </p>
        <h1 className="text-h1 text-text-primary">
          How we present food assessments
        </h1>
        <p className="text-body text-text-secondary">
          This page explains how FoodSignal communicates what it knows about a
          product. It is about how information is presented and how to read it,
          not a formula for a verdict. Our aim is to be clear about what the
          available evidence shows and, just as importantly, where it is
          incomplete.
        </p>
      </header>

      {/* Status meaning */}
      <section
        aria-labelledby="methodology-status-heading"
        className="flex flex-col gap-md"
      >
        <h2
          id="methodology-status-heading"
          className="text-h2 text-text-primary"
        >
          What Safe, Caution and Avoid mean
        </h2>
        <p className="text-body text-text-secondary">
          Every assessment carries one of three statuses. Each status is always
          shown with a text label and a distinct shape, so it can be understood
          without relying on color.
        </p>
        <dl className="flex flex-col gap-sm">
          <div className="flex flex-col gap-xs">
            <dt className="text-body font-semibold text-text-primary">Safe</dt>
            <dd className="text-body text-text-secondary">
              Nothing in the sources checked stands out as a concern for a
              typical shopper. It is a calm, everyday reading rather than a
              guarantee.
            </dd>
          </div>
          <div className="flex flex-col gap-xs">
            <dt className="text-body font-semibold text-text-primary">
              Caution
            </dt>
            <dd className="text-body text-text-secondary">
              There is something worth reading about before you decide, such as a
              declared allergen or an intake consideration described by the cited
              sources. It is an invitation to look closer, not an alarm.
            </dd>
          </div>
          <div className="flex flex-col gap-xs">
            <dt className="text-body font-semibold text-text-primary">Avoid</dt>
            <dd className="text-body text-text-secondary">
              A clear reason stands out in the sources checked &mdash; for
              example, an active recall. This is the cautious reading while the
              reason remains open.
            </dd>
          </div>
        </dl>
      </section>

      {/* Score as communication layer */}
      <section
        aria-labelledby="methodology-score-heading"
        className="flex flex-col gap-md"
      >
        <h2
          id="methodology-score-heading"
          className="text-h2 text-text-primary"
        >
          Reading the 0&ndash;100 score
        </h2>
        <p className="text-body text-text-secondary">
          The score is a communication layer: a single number that summarises the
          status and reasons at a glance, so you can compare products quickly. It
          is a way of expressing the assessment, not a separate measurement or a
          precise grade.
        </p>
        <p className="text-body text-text-secondary">
          Read the score alongside the status and the listed reasons rather than
          on its own. Two products with a similar number can differ in what drives
          it, and the reasons are where that context lives.
        </p>
      </section>

      {/* Confidence = evidence quality */}
      <section
        aria-labelledby="methodology-confidence-heading"
        className="flex flex-col gap-md"
      >
        <h2
          id="methodology-confidence-heading"
          className="text-h2 text-text-primary"
        >
          Confidence describes evidence quality, not danger
        </h2>
        <p className="text-body text-text-secondary">
          Confidence and status are two separate ideas, and we keep them visually
          separate. Confidence describes how much is known and how well it is
          supported by the sources checked &mdash; the quality of the evidence,
          not how risky a product is.
        </p>
        <p className="text-body text-text-secondary">
          A product can be Safe with only moderate confidence when the evidence is
          thin, and it can be Caution with high confidence when the evidence is
          strong. Low or insufficient confidence is a statement about the evidence,
          not a hidden warning about the product.
        </p>
      </section>

      {/* Guardrails */}
      <section
        aria-labelledby="methodology-guardrails-heading"
        className="flex flex-col gap-md"
      >
        <h2
          id="methodology-guardrails-heading"
          className="text-h2 text-text-primary"
        >
          Guardrails behind the presentation
        </h2>
        <p className="text-body text-text-secondary">
          A few rules keep the presentation honest and consistent:
        </p>
        <ul className="flex list-disc flex-col gap-sm pl-lg text-body text-text-secondary">
          <li>
            <span className="font-semibold text-text-primary">
              Recalls come first.
            </span>{" "}
            When a product has an active recall, that notice is shown prominently
            and is never hidden behind the score. A safety-critical notice should
            never be missed because a number looked reassuring.
          </li>
          <li>
            <span className="font-semibold text-text-primary">
              Say what is not known.
            </span>{" "}
            Where a detail is missing &mdash; for example, a product-level
            concentration &mdash; we say so plainly rather than filling the gap
            with a guess. Insufficient evidence is stated, not invented.
          </li>
          <li>
            <span className="font-semibold text-text-primary">
              Market is explicit.
            </span>{" "}
            Assessments are presented against a specific regulatory market, and
            the market is always identified so the context is clear.
          </li>
          <li>
            <span className="font-semibold text-text-primary">
              Sources are shown.
            </span>{" "}
            The references behind a statement are surfaced so you can check them
            for yourself.
          </li>
        </ul>
      </section>

      {/* Boundary note */}
      <section
        aria-labelledby="methodology-boundary-heading"
        className="flex flex-col gap-md"
      >
        <h2
          id="methodology-boundary-heading"
          className="text-h2 text-text-primary"
        >
          What this prototype is
        </h2>
        <p className="text-body text-text-secondary">
          This is a presentation prototype. All statuses, scores, confidence
          levels and sources shown are sample data used to demonstrate how the
          information would be communicated. No assessment is computed here, and
          nothing on these pages is medical advice.
        </p>
      </section>
    </div>
  );
}
