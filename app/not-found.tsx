import Link from "next/link";
import { Card, Icon } from "@/components/primitives";
import { NotFoundBoundary } from "@/components/stubs/NotFoundBoundary";

/**
 * Not_Found_Layout (Requirements 2.3, 18.4, 18.5, 23.5)
 *
 * Friendly, accessible 404 layout. Next.js App Router renders this file for the
 * `/404` route AND for any route that calls `notFound()` — including unmatched
 * dynamic slugs (Requirements 2.3, 23.5). It offers navigation back to the key
 * destinations: Home, Search, and Scan (Requirement 18.4).
 *
 * Resilience (Requirement 18.5): the rich layout is wrapped in
 * `NotFoundBoundary`, so if the layout itself fails to render, a minimal
 * accessible fallback message with a link back to the homepage is shown
 * instead.
 *
 * Accessibility:
 * - Single page `<h1>` inside a `<main>` landmark (Requirements 5.2, 20.3).
 * - Navigation is grouped in a `<nav>` with an accessible name; every link has
 *   a visible, token-driven focus ring (Requirement 20.2).
 */
export default function NotFound() {
  return (
    <NotFoundBoundary>
      <main className="mx-auto flex w-full max-w-2xl flex-col gap-lg px-md py-2xl">
        <Card as="section" padding="lg" className="flex flex-col gap-md">
          <span
            className="inline-flex w-fit items-center gap-xs rounded-full bg-surface-muted px-md py-xs text-label text-text-secondary"
            aria-hidden="true"
          >
            <Icon decorative size="1.1em">
              <path d="M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 15a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5Zm1-4h-2V7h2Z" />
            </Icon>
            404
          </span>

          <h1 className="text-h1 font-display text-text-primary">
            We couldn&rsquo;t find that page
          </h1>
          <p className="text-body text-text-secondary">
            The page you were looking for may have moved, or the link may be
            incomplete. Here are a few good places to pick things back up.
          </p>

          <nav
            aria-label="Go to key destinations"
            className="flex flex-col gap-sm pt-sm sm:flex-row sm:flex-wrap"
          >
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-md border border-transparent bg-brand px-md py-sm text-label font-semibold text-brand-fg transition-colors duration-fast hover:bg-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Go home
            </Link>
            <Link
              href="/search"
              className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-md py-sm text-label font-semibold text-text-primary transition-colors duration-fast hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Search a product
            </Link>
            <Link
              href="/scan"
              className="inline-flex items-center justify-center rounded-md border border-border bg-surface px-md py-sm text-label font-semibold text-text-primary transition-colors duration-fast hover:bg-surface-muted focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Scan a product
            </Link>
          </nav>
        </Card>
      </main>
    </NotFoundBoundary>
  );
}
