import type { Metadata } from "next";
import Link from "next/link";
import { Card } from "@/components/primitives";

/**
 * Medical disclaimer (`/medical-disclaimer`) — Requirements 18.1, 18.3, 19.6,
 * 19.1, 19.2, 22.1.
 *
 * This page frames FoodSignal's content as EDUCATIONAL information and NOT as
 * diagnosis or treatment (Requirements 18.3, 19.6). The required framing is
 * stated plainly and up front: FoodSignal provides educational information, not
 * diagnosis or treatment; people with serious allergies or medical dietary
 * requirements should rely on official labeling and qualified professionals.
 *
 * Copy is plain-language first (Requirement 19.1), calm and non-alarmist, and
 * avoids the prohibited phrasings (Requirement 19.2). Server component with a
 * single `<h1>` and semantic sections (Requirements 5.2, 20.3).
 */
export const metadata: Metadata = {
  title: "Medical disclaimer — FoodSignal",
  description:
    "FoodSignal provides educational information, not diagnosis or treatment. People with serious allergies or medical dietary requirements should rely on official labeling and qualified professionals.",
};

interface Section {
  id: string;
  heading: string;
  body: ReadonlyArray<string>;
}

const sections: ReadonlyArray<Section> = [
  {
    id: "what-this-is",
    heading: "What FoodSignal is",
    body: [
      "FoodSignal helps you understand what is in a food product and read the evidence behind it. Everything shown is educational information.",
      "It is intended to help you learn and ask better questions, not to tell you whether a product is right for your individual health.",
    ],
  },
  {
    id: "what-this-is-not",
    heading: "What FoodSignal is not",
    body: [
      "FoodSignal does not provide diagnosis or treatment, and it is not a substitute for advice from a qualified professional.",
      "It does not know your medical history. An assessment describes a product in general terms and cannot account for your personal circumstances.",
    ],
  },
  {
    id: "allergies-and-dietary-needs",
    heading: "Allergies and medical dietary requirements",
    body: [
      "If you have a serious allergy or a medical dietary requirement, rely on the official product labeling and the guidance of qualified professionals. Ingredients and formulations can change, and official labeling is the authoritative source.",
      "Use FoodSignal to help you understand information, not as the final word on whether a product is safe for you.",
    ],
  },
  {
    id: "getting-advice",
    heading: "Getting professional advice",
    body: [
      "For questions about your own health, diet, or symptoms, speak with a doctor, pharmacist, dietitian, or other qualified professional who can consider your individual situation.",
      "If you think you are having a medical emergency, contact your local emergency services right away.",
    ],
  },
];

export default function MedicalDisclaimerPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-xl px-lg py-2xl">
      <header className="flex flex-col gap-sm">
        <h1 className="text-h1 font-display text-text-primary">
          Medical disclaimer
        </h1>
        <p className="text-body text-text-secondary">
          Please read how FoodSignal&apos;s information is meant to be used.
        </p>
      </header>

      {/*
        Required framing, stated prominently and understandable without color
        (Requirements 18.3, 19.6). Rendered as a note with a text label so it
        does not rely on color alone.
      */}
      <Card
        as="section"
        padding="lg"
        elevation="sm"
        aria-labelledby="key-point-heading"
        className="flex flex-col gap-sm"
      >
        <h2 id="key-point-heading" className="text-h2 text-text-primary">
          The key point
        </h2>
        <p className="text-body text-text-primary">
          FoodSignal provides educational information, not diagnosis or treatment.
          People with serious allergies or medical dietary requirements should
          rely on official labeling and qualified professionals.
        </p>
      </Card>

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

      <section aria-labelledby="learn-more-heading" className="flex flex-col gap-sm">
        <h2 id="learn-more-heading" className="text-h2 text-text-primary">
          Learn more
        </h2>
        <p className="text-body text-text-secondary">
          To understand how assessments are described, read the{" "}
          <Link
            href="/methodology"
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            methodology
          </Link>{" "}
          page.
        </p>
      </section>
    </div>
  );
}
