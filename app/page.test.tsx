import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "./page";

describe("HomePage (smoke test)", () => {
  it("renders the placeholder homepage heading", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /foodsignal/i })
    ).toBeInTheDocument();
  });
});

describe("HomePage copy and CTAs (Task 14.4)", () => {
  it("renders the hero headline verbatim (R14.1)", () => {
    render(<HomePage />);
    // The single H1 carries a visually-hidden brand prefix, so match on the
    // required headline text rather than an exact accessible name.
    const heading = screen.getByRole("heading", { level: 1 });
    expect(heading).toHaveTextContent(
      "Know what is in your food. Understand the evidence."
    );
  });

  it("renders the primary CTA 'Scan a product' linking to /scan (R14.2)", () => {
    render(<HomePage />);
    const scanCta = screen.getByRole("link", { name: "Scan a product" });
    expect(scanCta).toBeInTheDocument();
    expect(scanCta).toHaveAttribute("href", "/scan");
  });

  it("renders the secondary CTA linking to /search (R14.3)", () => {
    render(<HomePage />);
    const searchCta = screen.getByRole("link", {
      name: "Search a product, ingredient or barcode.",
    });
    expect(searchCta).toBeInTheDocument();
    expect(searchCta).toHaveAttribute("href", "/search");
  });
});
