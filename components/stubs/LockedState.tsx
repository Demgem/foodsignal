import Link from "next/link";
import { Card, Icon } from "@/components/primitives";

/**
 * LockedState (Requirements 3.3, 3.4, 24.7)
 *
 * Renders the "Unlock soon" locked state for future-feature routes
 * (`/testing`, `/testing/[product]`, `/testing/crowdfund/[product]`). Product
 * testing and crowdfunding functionality is explicitly out of scope for the
 * prototype (Requirement 24.7); these routes show a locked placeholder only.
 *
 * Accessibility:
 * - Single page `<h1>` inside a `<main>` landmark (Requirements 5.2, 20.3).
 * - The lock is conveyed by text ("Unlock soon") in addition to the icon, so
 *   the state is understandable without relying on color or shape alone
 *   (Requirement 20.6). The decorative lock icon is hidden from assistive tech.
 * - Provides a link back to available features (Requirement 3.4).
 */
export interface LockedStateProps {
  /** Headline for the locked feature. */
  title: string;
  /** Plain-language description of the locked feature. */
  description: string;
}

export function LockedState({ title, description }: LockedStateProps) {
  return (
    <main className="mx-auto flex w-full max-w-2xl flex-col gap-lg px-md py-2xl">
      <Card as="section" padding="lg" className="flex flex-col gap-md text-center">
        <span className="mx-auto inline-flex items-center gap-xs rounded-full bg-surface-muted px-md py-xs text-label text-text-secondary">
          <Icon decorative size="1.1em">
            <path d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5Zm3 8H9V7a3 3 0 1 1 6 0v3Z" />
          </Icon>
          Unlock soon
        </span>

        <h1 className="text-h1 font-display text-text-primary">{title}</h1>
        <p className="text-body text-text-secondary">{description}</p>

        <p className="text-caption text-text-muted">
          This feature is not part of the current prototype. There is no product
          testing or crowdfunding functionality yet.
        </p>

        <nav
          aria-label="Return to available features"
          className="flex flex-wrap items-center justify-center gap-md pt-sm"
        >
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
            Explore products
          </Link>
          <Link
            href="/recalls"
            className="text-label text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            View recalls
          </Link>
        </nav>
      </Card>
    </main>
  );
}

export default LockedState;
