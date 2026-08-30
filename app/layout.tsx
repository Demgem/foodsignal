import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Footer, LocalePreferences, PrimaryNav } from "@/components/layout";

export const metadata: Metadata = {
  title: "FoodSignal",
  description:
    "Know what is in your food. Understand the evidence. (Prototype)",
};

/**
 * Root layout / App shell (Requirements 1.1, 20.1, 20.3)
 *
 * Renders a persistent primary navigation region and footer around every route
 * (Requirement 1.1) using semantic landmarks: `<header>`, `<nav>` (inside
 * PrimaryNav), `<main>`, and `<footer>` (Requirement 20.3).
 *
 * A "Skip to main content" link is the first focusable element so keyboard and
 * screen-reader users can bypass the navigation (Requirements 20.1, 20.3).
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col bg-background text-text-primary">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-md focus:top-md focus:z-50 focus:rounded-md focus:bg-surface focus:px-md focus:py-sm focus:text-label focus:font-semibold focus:text-text-primary focus:shadow-md focus:outline-none focus:ring-2 focus:ring-focus"
        >
          Skip to main content
        </a>

        <header className="relative border-b border-border bg-surface">
          <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-md px-lg py-sm">
            <Link
              href="/"
              className="inline-flex items-center rounded-md text-h3 font-semibold text-text-primary focus:outline-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              FoodSignal
            </Link>
            <PrimaryNav />
          </div>
          {/*
            Independent interface-language, market, and unit controls
            (Requirements 21.1–21.4). Language and market are separate concepts:
            changing one never changes the other (Correctness Property 7).
          */}
          <div className="mx-auto flex w-full max-w-5xl justify-end px-lg pb-sm">
            <LocalePreferences />
          </div>
        </header>

        <main id="main-content" className="flex-1">
          {children}
        </main>

        <footer className="border-t border-border bg-surface-muted">
          <Footer />
        </footer>
      </body>
    </html>
  );
}
