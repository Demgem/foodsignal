"use client";

import Link from "next/link";
import { useId, useState } from "react";
import { Disclosure, Icon } from "@/components/primitives";

/**
 * PrimaryNav (Requirements 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 20.1, 20.3)
 *
 * The persistent primary navigation region rendered by the root layout around
 * every route.
 *
 * Behaviour:
 * - Nav items in order: Scan, Search, Explore, Recalls, Methodology, Sign in
 *   (Requirement 1.2). "Sign in" links to the static `/login` stub
 *   (Requirement 1.5).
 * - The emphasized "Scan a product" CTA is rendered OUTSIDE the collapsible
 *   menu so it stays visible at every breakpoint (Requirements 1.3, 1.6).
 * - "Explore" surfaces browse destinations (products, ingredients, additives,
 *   compare, countries) via a disclosure menu (Requirement 1.4).
 * - On small viewports the primary nav items collapse behind a keyboard
 *   operable menu toggle (aria-expanded / aria-controls) while the CTA remains
 *   visible (Requirements 1.6, 20.1).
 *
 * Accessibility:
 * - Wrapped in a semantic `<nav>` landmark with an accessible name
 *   (Requirement 20.3).
 * - All interactive elements are native `<a>` (via next/link) or `<button>`
 *   elements, so they are reachable and operable by keyboard (Requirement 20.1).
 * - The mobile toggle exposes its expanded state and controls target via
 *   `aria-expanded` / `aria-controls`.
 */

interface NavItem {
  label: string;
  href: string;
}

interface ExploreDestination {
  label: string;
  href: string;
}

/** Primary nav items, in the order required by Requirement 1.2. */
const PRIMARY_ITEMS: NavItem[] = [
  { label: "Scan", href: "/scan" },
  { label: "Search", href: "/search" },
  // "Explore" is rendered separately as a grouping menu.
  { label: "Recalls", href: "/recalls" },
  { label: "Methodology", href: "/methodology" },
];

/** Explore browse destinations (Requirement 1.4). */
const EXPLORE_DESTINATIONS: ExploreDestination[] = [
  { label: "Products", href: "/products" },
  { label: "Ingredients", href: "/ingredients" },
  { label: "Additives", href: "/additives" },
  { label: "Compare", href: "/compare" },
  { label: "Countries", href: "/countries" },
];

const navLinkClasses =
  "inline-flex items-center rounded-md px-sm py-sm text-label font-semibold " +
  "text-text-primary transition-colors duration-fast ease-base hover:bg-surface-muted " +
  "focus:outline-none focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background";

const exploreLinkClasses =
  "block rounded-md px-sm py-xs text-body text-text-secondary " +
  "transition-colors duration-fast ease-base hover:bg-surface-muted hover:text-text-primary " +
  "focus:outline-none focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background";

function ChevronIcon({ open }: { open: boolean }) {
  return (
    <Icon
      decorative
      size="1em"
      className={[
        "transition-transform duration-fast ease-base",
        open ? "rotate-180" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <path d="M6 9l6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
    </Icon>
  );
}

/** The Explore grouping menu, reused in both desktop and mobile layouts. */
function ExploreMenu({ triggerClassName }: { triggerClassName?: string }) {
  return (
    <Disclosure
      label="Explore"
      triggerClassName={[navLinkClasses, "w-full sm:w-auto", triggerClassName]
        .filter(Boolean)
        .join(" ")}
      indicator={(open) => <ChevronIcon open={open} />}
      contentClassName="px-0 pb-0"
    >
      <ul className="mt-xs flex flex-col gap-xs">
        {EXPLORE_DESTINATIONS.map((dest) => (
          <li key={dest.href}>
            <Link href={dest.href} className={exploreLinkClasses}>
              {dest.label}
            </Link>
          </li>
        ))}
      </ul>
    </Disclosure>
  );
}

export function PrimaryNav() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileMenuId = useId();

  return (
    <nav aria-label="Primary" className="flex items-center gap-md">
      {/* Desktop nav items (hidden on small viewports). */}
      <ul className="hidden items-center gap-xs md:flex">
        {PRIMARY_ITEMS.slice(0, 2).map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={navLinkClasses}>
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <ExploreMenu />
        </li>
        {PRIMARY_ITEMS.slice(2).map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={navLinkClasses}>
              {item.label}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/login" className={navLinkClasses}>
            Sign in
          </Link>
        </li>
      </ul>

      {/* Primary CTA — always visible, outside the collapsible menu (Req 1.3, 1.6). */}
      <Link
        href="/scan"
        className={[
          "inline-flex min-h-10 items-center justify-center gap-sm rounded-md border border-transparent",
          "bg-brand px-md py-sm text-label font-semibold text-brand-fg",
          "transition-colors duration-fast ease-base hover:bg-brand-hover",
          "focus:outline-none focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        ].join(" ")}
      >
        Scan a product
      </Link>

      {/* Mobile menu toggle (visible only on small viewports). */}
      <button
        type="button"
        aria-expanded={mobileOpen}
        aria-controls={mobileMenuId}
        aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
        onClick={() => setMobileOpen((open) => !open)}
        className={[
          "inline-flex min-h-10 items-center justify-center rounded-md px-sm py-sm md:hidden",
          "border border-border text-text-primary transition-colors duration-fast ease-base",
          "hover:bg-surface-muted",
          "focus:outline-none focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
        ].join(" ")}
      >
        <Icon decorative size="1.25em">
          {mobileOpen ? (
            <path
              d="M6 6l12 12M18 6L6 18"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          ) : (
            <path
              d="M4 7h16M4 12h16M4 17h16"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          )}
        </Icon>
        <span className="ml-xs text-label font-semibold">Menu</span>
      </button>

      {/* Mobile menu panel (Requirement 1.6). */}
      <div
        id={mobileMenuId}
        hidden={!mobileOpen}
        className="absolute inset-x-0 top-full z-20 border-b border-border bg-surface shadow-md md:hidden"
      >
        <ul className="mx-auto flex max-w-5xl flex-col gap-xs px-lg py-md">
          {PRIMARY_ITEMS.slice(0, 2).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[navLinkClasses, "w-full"].join(" ")}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <ExploreMenu />
          </li>
          {PRIMARY_ITEMS.slice(2).map((item) => (
            <li key={item.href}>
              <Link
                href={item.href}
                className={[navLinkClasses, "w-full"].join(" ")}
                onClick={() => setMobileOpen(false)}
              >
                {item.label}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/login"
              className={[navLinkClasses, "w-full"].join(" ")}
              onClick={() => setMobileOpen(false)}
            >
              Sign in
            </Link>
          </li>
        </ul>
      </div>
    </nav>
  );
}

export default PrimaryNav;
