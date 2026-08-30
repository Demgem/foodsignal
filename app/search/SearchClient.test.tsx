import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect } from "vitest";
import { listProducts } from "@/lib/mock-data";
import { SearchClient } from "./SearchClient";

/**
 * Component tests for SearchClient (Task 14.4).
 *
 * Covers the empty-state guidance (R16.3), the no-results message with the same
 * guidance (R16.4), and a matching query rendering at least one result card.
 * The catalogue is passed in exactly as the server does, via `listProducts()`.
 */

const products = listProducts();

function renderSearch() {
  return render(<SearchClient products={products} />);
}

describe("SearchClient — empty state (R16.3)", () => {
  it("renders empty-state guidance suggesting scanning or browsing Explore", () => {
    renderSearch();

    // The empty query renders the "Start your search" guidance section.
    expect(
      screen.getByRole("heading", { level: 2, name: "Start your search" })
    ).toBeInTheDocument();

    // Guidance links to /scan and /products (Explore).
    const scanLink = screen.getByRole("link", { name: "scan a product" });
    expect(scanLink).toHaveAttribute("href", "/scan");

    const exploreLink = screen.getByRole("link", { name: "Explore" });
    expect(exploreLink).toHaveAttribute("href", "/products");
  });

  it("does not render a 'No results found' message for an empty query", () => {
    renderSearch();
    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
  });
});

describe("SearchClient — no results (R16.4)", () => {
  it("renders a 'No results found' message with the same guidance", async () => {
    const user = userEvent.setup();
    renderSearch();

    const input = screen.getByRole("searchbox", {
      name: /search products, ingredients or barcodes/i,
    });
    await user.type(input, "zzzzzz-no-match");

    expect(
      screen.getByRole("heading", { level: 2, name: "No results found" })
    ).toBeInTheDocument();

    // Same plain-language guidance is shown (links to /scan and /products).
    const scanLink = screen.getByRole("link", { name: "scan a product" });
    expect(scanLink).toHaveAttribute("href", "/scan");

    const exploreLink = screen.getByRole("link", { name: "Explore" });
    expect(exploreLink).toHaveAttribute("href", "/products");
  });
});

describe("SearchClient — matching query", () => {
  it("shows at least one result card for a matching query", async () => {
    const user = userEvent.setup();
    renderSearch();

    const input = screen.getByRole("searchbox", {
      name: /search products, ingredients or barcodes/i,
    });
    // "granola" matches the "Orchard Crunch Granola" product name.
    await user.type(input, "granola");

    const resultsRegion = screen.getByRole("region", { name: "Search results" });

    // At least one result card links to its product page.
    const productLink = within(resultsRegion).getByRole("link", {
      name: /Orchard Crunch Granola/i,
    });
    expect(productLink).toHaveAttribute(
      "href",
      "/products/orchard-crunch-granola"
    );

    // The results header confirms a match count of at least one.
    expect(within(resultsRegion).getByRole("status")).toHaveTextContent(
      /1\s+result\s+found/i
    );

    // No no-results/empty state while results are present.
    expect(screen.queryByText("No results found")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("heading", { name: "Start your search" })
    ).not.toBeInTheDocument();
  });
});
