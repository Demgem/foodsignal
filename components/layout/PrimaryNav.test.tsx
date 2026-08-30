import { describe, expect, it } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";

import { PrimaryNav } from "./PrimaryNav";

/**
 * Component tests for PrimaryNav.
 *
 * Covers the primary navigation contract: item order, the persistent
 * "Scan a product" CTA, the Explore browse destinations, the "Sign in"
 * destination, and the mobile menu toggle's accessibility wiring.
 *
 * next/link renders a native <a> in the test environment, so link
 * destinations are asserted via the `href` attribute on real output.
 *
 * The component renders its primary items twice: once in the desktop list
 * (a `<ul>` that is CSS-hidden on small viewports) and once inside the mobile
 * menu panel (which is DOM-`hidden` while collapsed). jsdom applies no CSS, so
 * both the desktop list and the mobile toggle/panel are present in the tree.
 * Assertions that must be unambiguous are therefore scoped to the desktop list.
 *
 * Validates: Requirements 1.2, 1.3, 1.4, 1.5, 1.6
 */

/**
 * The desktop primary-item list is the only `<ul>` that is a direct child of
 * the nav landmark (the mobile panel wraps its `<ul>` in a `<div>`). Scope
 * queries to it to disambiguate the duplicated items.
 */
function getDesktopList(): HTMLElement {
  const nav = screen.getByRole("navigation", { name: /primary/i });
  const list = nav.querySelector(":scope > ul");
  if (!(list instanceof HTMLElement)) {
    throw new Error("Expected a desktop <ul> as a direct child of the nav");
  }
  return list;
}

describe("PrimaryNav — item order (Requirement 1.2)", () => {
  it("renders the primary items in order: Scan, Search, Explore, Recalls, Methodology, Sign in", () => {
    render(<PrimaryNav />);
    const list = getDesktopList();

    // Collect the interactive top-level nav controls in DOM order. Scan,
    // Search, Recalls, Methodology and Sign in are links; Explore is a
    // disclosure <button>. Restrict to the list's own <li> children so the
    // Explore disclosure's revealed destination links are not included.
    const items = Array.from(list.querySelectorAll(":scope > li"));
    const labels = items.map((li) => {
      const control = li.querySelector("a, button");
      return control?.textContent?.trim() ?? "";
    });

    expect(labels).toEqual([
      "Scan",
      "Search",
      "Explore",
      "Recalls",
      "Methodology",
      "Sign in",
    ]);
  });
});

describe('PrimaryNav — persistent "Scan a product" CTA (Requirements 1.3, 1.6)', () => {
  it('renders a "Scan a product" CTA linking to /scan', () => {
    render(<PrimaryNav />);

    const cta = screen.getByRole("link", { name: "Scan a product" });
    expect(cta).toBeInTheDocument();
    expect(cta).toHaveAttribute("href", "/scan");
  });
});

describe("PrimaryNav — Explore browse destinations (Requirement 1.4)", () => {
  it("surfaces Products, Ingredients, Additives, Compare and Countries with correct hrefs", async () => {
    const user = userEvent.setup();
    render(<PrimaryNav />);

    const list = getDesktopList();

    // Open the desktop Explore disclosure so its destinations are revealed.
    const exploreTrigger = within(list).getByRole("button", { name: /explore/i });
    expect(exploreTrigger).toHaveAttribute("aria-expanded", "false");
    await user.click(exploreTrigger);
    expect(exploreTrigger).toHaveAttribute("aria-expanded", "true");

    const expected: Array<[string, string]> = [
      ["Products", "/products"],
      ["Ingredients", "/ingredients"],
      ["Additives", "/additives"],
      ["Compare", "/compare"],
      ["Countries", "/countries"],
    ];

    for (const [label, href] of expected) {
      const link = within(list).getByRole("link", { name: label });
      expect(link).toHaveAttribute("href", href);
    }
  });
});

describe('PrimaryNav — "Sign in" destination (Requirement 1.5)', () => {
  it('links "Sign in" to /login', () => {
    render(<PrimaryNav />);
    const list = getDesktopList();

    const signIn = within(list).getByRole("link", { name: "Sign in" });
    expect(signIn).toHaveAttribute("href", "/login");
  });
});

describe("PrimaryNav — mobile menu toggle (Requirement 1.6)", () => {
  it("exposes aria-expanded that flips to true on click and aria-controls referencing the panel id", async () => {
    const user = userEvent.setup();
    render(<PrimaryNav />);

    const toggle = screen.getByRole("button", { name: /open navigation menu/i });

    // Collapsed by default.
    expect(toggle).toHaveAttribute("aria-expanded", "false");

    // aria-controls references the menu container by id.
    const controlsId = toggle.getAttribute("aria-controls");
    expect(controlsId).toBeTruthy();
    const panel = document.getElementById(controlsId as string);
    expect(panel).not.toBeNull();

    // The panel is collapsed (hidden) while the toggle is not expanded.
    expect(panel).toHaveAttribute("hidden");

    // Clicking the toggle flips aria-expanded to true and reveals the panel.
    await user.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(panel).not.toHaveAttribute("hidden");
  });
});
