import type { Metadata } from "next";
import { Card } from "@/components/primitives";

/**
 * Privacy policy (`/privacy`) — Requirements 18.1, 19.1, 19.2, 22.1.
 *
 * Plain-language privacy policy LAYOUT with placeholder sections. This is a
 * prototype: the wording is illustrative and is not legal advice. Copy is
 * plain-language first (Requirement 19.1) and avoids the prohibited phrasings
 * (Requirement 19.2).
 *
 * Server component with a single `<h1>` and semantic sections (Requirements
 * 5.2, 20.3).
 */
export const metadata: Metadata = {
  title: "Privacy policy — FoodSignal",
  description:
    "A plain-language overview of how FoodSignal would handle personal information. Placeholder policy layout shown in the prototype.",
};

interface Section {
  id: string;
  heading: string;
  body: ReadonlyArray<string>;
}

const sections: ReadonlyArray<Section> = [
  {
    id: "what-we-collect",
    heading: "Information we would collect",
    body: [
      "In the finished product this section would describe what information is collected — for example an account email, saved products, and preferences such as language, market, and units.",
      "In this prototype no account is created and no personal information is collected or stored.",
    ],
  },
  {
    id: "how-we-use-it",
    heading: "How we would use it",
    body: [
      "Information would be used to provide the service you asked for: showing your saved products, remembering your preferences, and sending recall alerts you opted into.",
      "It would not be sold. This section would explain any limited sharing with providers needed to run the service.",
    ],
  },
  {
    id: "your-choices",
    heading: "Your choices",
    body: [
      "This section would describe how to access, correct, export, or delete your information, and how to change or withdraw any consent you gave.",
      "Preference controls such as interface language and market are independent and can be changed at any time.",
    ],
  },
  {
    id: "contact",
    heading: "Contact",
    body: [
      "The finished policy would include a contact route for privacy questions and requests, along with the effective date and how changes are communicated.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-xl px-lg py-2xl">
      <header className="flex flex-col gap-sm">
        <h1 className="text-h1 font-display text-text-primary">Privacy policy</h1>
        <p className="text-body text-text-secondary">
          This is a plain-language overview of how FoodSignal would handle
          personal information.
        </p>
      </header>

      <div
        role="note"
        className="rounded-md border border-border bg-surface-muted px-md py-sm text-caption text-text-secondary"
      >
        <span className="font-semibold text-text-primary">Prototype note:</span>{" "}
        This is a placeholder layout, not a finished or binding policy, and it is
        not legal advice. The prototype collects and stores no personal
        information.
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
