import type { ReactNode } from "react";
import Link from "next/link";
import { Card } from "@/components/primitives";

/**
 * StubPage (Requirements 3.1, 3.2, 24.4)
 *
 * Reusable, static, NON-FUNCTIONAL layout for account routes (`/login`,
 * `/signup`, `/profile`, ...). Every stub carries a clear, visible "prototype"
 * note so the boundary of the prototype is unambiguous (Requirement 3.2) and
 * no authentication logic, session, or persistence is implied (Requirement
 * 24.4).
 *
 * Accessibility:
 * - Renders a single page `<h1>` (Requirement 5.2) inside a `<main>` landmark
 *   (Requirement 20.3).
 * - The prototype note uses `role="note"` so assistive tech announces it as an
 *   aside/annotation rather than as body prose.
 * - Any sample inputs passed via `children` are expected to be disabled or
 *   clearly marked as non-functional by the caller.
 */
export interface StubPageProps {
  /** Page title, rendered as the single H1. */
  title: string;
  /** Short plain-language description of what this screen would eventually do. */
  description: string;
  /** Optional static preview content (e.g. disabled form controls). */
  children?: ReactNode;
}

export function StubPage({ title, description, children }: StubPageProps) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-lg px-md py-2xl">
      <header className="flex flex-col gap-sm">
        <h1 className="text-h1 font-display text-text-primary">{title}</h1>
        <p className="text-body text-text-secondary">{description}</p>
      </header>

      <div
        role="note"
        className="rounded-md border border-border bg-surface-muted px-md py-sm text-caption text-text-secondary"
      >
        <span className="font-semibold text-text-primary">Prototype note:</span>{" "}
        This is a static layout stub. It performs no authentication, stores no
        data, and any controls shown are non-functional.
      </div>

      {children != null ? (
        <Card as="section" padding="lg" aria-label={`${title} preview`}>
          {children}
        </Card>
      ) : null}

      <nav aria-label="Return to available features" className="flex flex-wrap gap-md">
        <Link
          href="/"
          className="text-label text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Back to home
        </Link>
        <Link
          href="/search"
          className="text-label text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
        >
          Search products
        </Link>
      </nav>
    </main>
  );
}

export default StubPage;
