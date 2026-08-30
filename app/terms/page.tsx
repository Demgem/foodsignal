import type { Metadata } from "next";

/**
 * Terms of use (`/terms`) — Requirements 18.1, 19.1, 19.2, 22.1.
 *
 * Placeholder terms LAYOUT with plain-language sections. This is a prototype:
 * the wording is illustrative and is not legal advice. Copy is plain-language
 * first (Requirement 19.1) and avoids the prohibited phrasings (Requirement
 * 19.2).
 *
 * Server component with a single `<h1>` and semantic sections (Requirements
 * 5.2, 20.3).
 */
export const metadata: Metadata = {
  title: "Terms of use — FoodSignal",
  description:
    "A plain-language overview of the terms that would govern use of FoodSignal. Placeholder terms layout shown in the prototype.",
};

interface Section {
  id: string;
  heading: string;
  body: ReadonlyArray<string>;
}

const sections: ReadonlyArray<Section> = [
  {
    id: "using-foodsignal",
    heading: "Using FoodSignal",
    body: [
      "This section would set out the basic terms for using the service: who may use it, acceptable use, and the account responsibilities that apply once accounts exist.",
      "In this prototype there are no accounts and no live features to govern.",
    ],
  },
  {
    id: "information-provided",
    heading: "Information provided",
    body: [
      "FoodSignal presents information and evidence to help you understand food products. It is provided for general understanding.",
      "It is educational information and not diagnosis or treatment. People with serious allergies or medical dietary requirements should rely on official labeling and qualified professionals. See the medical disclaimer for detail.",
    ],
  },
  {
    id: "content-and-accuracy",
    heading: "Content and accuracy",
    body: [
      "This section would describe how content is sourced, that assessments can carry uncertainty, and how to report a correction when something looks wrong.",
      "In the prototype all content is sample data and no assessment is computed.",
    ],
  },
  {
    id: "changes-and-contact",
    heading: "Changes and contact",
    body: [
      "The finished terms would explain how changes are communicated, the effective date, and a contact route for questions.",
    ],
  },
];

export default function TermsPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-xl px-lg py-2xl">
      <header className="flex flex-col gap-sm">
        <h1 className="text-h1 font-display text-text-primary">Terms of use</h1>
        <p className="text-body text-text-secondary">
          This is a plain-language overview of the terms that would govern use of
          FoodSignal.
        </p>
      </header>

      <div
        role="note"
        className="rounded-md border border-border bg-surface-muted px-md py-sm text-caption text-text-secondary"
      >
        <span className="font-semibold text-text-primary">Prototype note:</span>{" "}
        This is a placeholder layout, not finished or binding terms, and it is not
        legal advice.
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
    </div>
  );
}
