import { render, screen, within } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import PricingPage from "./page";

/**
 * Component test for the pricing page.
 *
 * Validates: Requirements 18.2, 19.6 — the page renders Free / Premium tiers
 * as a layout preview and performs NO billing: the subscribe/CTA control is
 * non-functional (disabled + labelled), and a prototype note states no
 * payment/subscription/billing is handled.
 */
describe("PricingPage", () => {
  it("renders a single top-level Pricing heading", () => {
    render(<PricingPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /pricing/i })
    ).toBeInTheDocument();
  });

  it("renders both Free and Premium tiers", () => {
    render(<PricingPage />);
    expect(
      screen.getByRole("heading", { level: 3, name: /^free$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 3, name: /^premium$/i })
    ).toBeInTheDocument();
  });

  it("shows a prototype note stating no payment/subscription/billing is handled", () => {
    render(<PricingPage />);
    const note = screen.getByRole("note");
    expect(note).toHaveTextContent(/prototype note/i);
    expect(note).toHaveTextContent(
      /No payment, subscription, or billing is handled/i
    );
    expect(note).toHaveTextContent(/subscribe button is\s+intentionally non-functional/i);
  });

  it("renders CTA buttons that are non-functional (disabled)", () => {
    render(<PricingPage />);
    const buttons = screen.getAllByRole("button");
    expect(buttons.length).toBeGreaterThan(0);
    for (const button of buttons) {
      expect(button).toBeDisabled();
      expect(button).toHaveAttribute("aria-disabled", "true");
      expect(button).toHaveTextContent(/disabled in prototype/i);
    }
  });

  it("labels the Premium subscribe control as disabled/non-functional", () => {
    render(<PricingPage />);
    const subscribe = screen.getByRole("button", { name: /subscribe/i });
    expect(subscribe).toBeDisabled();
    expect(subscribe).toHaveTextContent(/disabled in prototype/i);
  });

  it("does not render any functional payment/checkout affordance (no links/forms to pay)", () => {
    render(<PricingPage />);
    // No links whose text implies checkout/payment.
    expect(
      screen.queryByRole("link", { name: /pay|checkout|subscribe/i })
    ).not.toBeInTheDocument();
    // Every tier CTA is a disabled button rather than an actionable control.
    const premiumCard = screen
      .getByRole("heading", { level: 3, name: /^premium$/i })
      .closest("article") as HTMLElement;
    expect(premiumCard).not.toBeNull();
    expect(within(premiumCard).getByRole("button")).toBeDisabled();
  });
});
