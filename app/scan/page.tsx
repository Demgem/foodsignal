import type { Metadata } from "next";
import Link from "next/link";
import { Button, Card, Icon } from "@/components/primitives";

/**
 * Scan page (`/scan`) — Requirements 15.1, 15.2, 15.3, 15.4, 24.1.
 *
 * The scan-first entry experience. In the shipping product this is where a user
 * would point their camera at a product (or upload a photo) to identify it. In
 * this PROTOTYPE the page presents the camera/upload affordances as UI ONLY:
 *
 * - No image processing, no model inference, and no OCR occurs (Requirements
 *   15.2, 24.1). The "Take a photo" / "Upload a photo" controls are visibly
 *   non-functional (disabled) and the file input never submits anywhere.
 * - The page explains, in plain language, what scanning WOULD do (Requirement
 *   15.4) — the scan → read the label → identify the product → confirm →
 *   see the assessment flow, framed as future behaviour.
 * - A clear, prominent fallback to manual search is provided (Requirement 15.3).
 *
 * This is a server component: it renders static markup only and needs no
 * client-side interactivity, which keeps the non-goal (no OCR/AI) unambiguous.
 * The single `<h1>` (Requirement 5.2) and semantic sections live inside the
 * `<main>` landmark supplied by the root layout (Requirement 20.3).
 */
export const metadata: Metadata = {
  title: "Scan a product — FoodSignal",
  description:
    "Scan a food product to see its ingredients, allergens, nutrition, recalls and the evidence behind its assessment. Prototype: camera and upload are shown as UI only.",
};

/** How the scan flow is explained to the user (Requirement 15.4). */
const scanFlowSteps: ReadonlyArray<{ title: string; detail: string }> = [
  {
    title: "Scan or upload",
    detail:
      "You point your camera at a product or choose a photo of its label or barcode.",
  },
  {
    title: "Read the label",
    detail:
      "The text on the packaging is read so the product and its listed ingredients can be recognised.",
  },
  {
    title: "Identify the product",
    detail:
      "The reading is matched to a known product and market so the right information is shown.",
  },
  {
    title: "Confirm it is correct",
    detail:
      "You confirm the identified product, or correct it, before anything is shown as an assessment.",
  },
  {
    title: "See the assessment",
    detail:
      "You see the status, score, ingredients, allergens, recalls and the evidence and sources behind them.",
  },
];

/** Simple decorative camera glyph for the capture affordance. */
function CameraIcon() {
  return (
    <Icon decorative viewBox="0 0 24 24" size="1.5em">
      <path d="M9 3a1 1 0 0 0-.8.4L7.2 4.8A1 1 0 0 1 6.4 5H4a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V7a2 2 0 0 0-2-2h-2.4a1 1 0 0 1-.8-.4l-1-1.2A1 1 0 0 0 15 3H9Zm3 5.5a4 4 0 1 1 0 8 4 4 0 0 1 0-8Zm0 2a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z" />
    </Icon>
  );
}

/** Simple decorative upload glyph for the upload affordance. */
function UploadIcon() {
  return (
    <Icon decorative viewBox="0 0 24 24" size="1.5em">
      <path d="M12 3a1 1 0 0 1 .7.3l4 4a1 1 0 1 1-1.4 1.4L13 6.4V15a1 1 0 1 1-2 0V6.4L8.7 8.7a1 1 0 0 1-1.4-1.4l4-4A1 1 0 0 1 12 3ZM5 15a1 1 0 0 1 1 1v3h12v-3a1 1 0 1 1 2 0v4a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-4a1 1 0 0 1 1-1Z" />
    </Icon>
  );
}

export default function ScanPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-xl px-lg py-2xl">
      <header className="flex flex-col gap-sm">
        <h1 className="text-h1 font-display text-text-primary">Scan a product</h1>
        <p className="text-body text-text-secondary">
          Scan a food product to understand what is in it and see the evidence
          behind its assessment. Below is where scanning will live — for now, you
          can read what it will do or search for a product by hand.
        </p>
      </header>

      {/* Prototype boundary note — no OCR/AI runs here (Requirements 15.2, 24.1). */}
      <div
        role="note"
        className="rounded-md border border-border bg-surface-muted px-md py-sm text-caption text-text-secondary"
      >
        <span className="font-semibold text-text-primary">Prototype note:</span>{" "}
        Scanning is shown as a preview only. No photo is processed, no text is
        read, and nothing is sent anywhere. The buttons and photo picker below
        are intentionally non-functional.
      </div>

      {/* Camera + upload affordances — UI only (Requirements 15.1, 15.2). */}
      <section aria-labelledby="capture-heading" className="flex flex-col gap-md">
        <h2 id="capture-heading" className="text-h2 text-text-primary">
          Capture a product
        </h2>
        <Card as="div" padding="lg" className="flex flex-col gap-lg">
          <div className="flex flex-col gap-md sm:flex-row">
            <Button
              type="button"
              variant="primary"
              size="lg"
              disabled
              aria-disabled="true"
              leadingVisual={<CameraIcon />}
              className="w-full sm:w-auto"
            >
              Take a photo
            </Button>

            {/*
              Upload affordance: a real, labelled file input that is disabled
              and lives in a form that never submits, so it is a visible
              affordance with no processing (Requirements 15.1, 15.2, 24.1).
            */}
            <form
              aria-label="Upload a product photo (preview only)"
              className="w-full sm:w-auto"
            >
              <label
                htmlFor="scan-upload"
                className="inline-flex w-full cursor-not-allowed items-center justify-center gap-sm rounded-md border border-border bg-surface px-lg py-sm text-body font-semibold text-text-primary opacity-60 sm:w-auto"
              >
                <span className="inline-flex shrink-0 items-center">
                  <UploadIcon />
                </span>
                <span>Upload a photo</span>
              </label>
              <input
                id="scan-upload"
                name="scan-upload"
                type="file"
                accept="image/*"
                disabled
                aria-disabled="true"
                aria-describedby="scan-upload-hint"
                className="sr-only"
              />
              <p id="scan-upload-hint" className="mt-xs text-caption text-text-muted">
                Photo upload is disabled in this prototype.
              </p>
            </form>
          </div>

          <p className="text-caption text-text-secondary">
            These controls are placeholders for the camera and photo picker. In
            the finished product they would start the scan flow described below.
          </p>
        </Card>
      </section>

      {/* Explain what scanning would do (Requirement 15.4). */}
      <section aria-labelledby="how-heading" className="flex flex-col gap-md">
        <h2 id="how-heading" className="text-h2 text-text-primary">
          What scanning will do
        </h2>
        <p className="text-body text-text-secondary">
          Scanning is designed to take you from a product in your hand to a clear,
          evidence-backed view in a few steps:
        </p>
        <ol className="flex flex-col gap-md">
          {scanFlowSteps.map((step, index) => (
            <li key={step.title} className="flex gap-md">
              <span
                aria-hidden="true"
                className="mt-xs inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border bg-surface-muted text-label font-semibold tabular-nums text-text-primary"
              >
                {index + 1}
              </span>
              <div className="flex flex-col gap-xs">
                <h3 className="text-h3 text-text-primary">{step.title}</h3>
                <p className="text-body text-text-secondary">{step.detail}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="text-caption text-text-secondary">
          None of these steps run in this prototype. This is a description of the
          intended experience.
        </p>
      </section>

      {/* Clear fallback to manual search (Requirement 15.3). */}
      <section
        aria-labelledby="fallback-heading"
        className="flex flex-col gap-md"
      >
        <h2 id="fallback-heading" className="text-h2 text-text-primary">
          Prefer to search instead?
        </h2>
        <Card
          as="div"
          padding="lg"
          className="flex flex-col gap-md sm:flex-row sm:items-center sm:justify-between"
        >
          <p className="text-body text-text-secondary">
            You do not have to scan. You can look up a product, ingredient or
            barcode by name at any time.
          </p>
          <Link
            href="/search"
            className="inline-flex shrink-0 items-center justify-center rounded-md bg-brand px-lg py-sm text-body font-semibold text-brand-fg transition-colors duration-fast ease-base hover:bg-brand-hover focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Search for a product
          </Link>
        </Card>
      </section>
    </div>
  );
}
