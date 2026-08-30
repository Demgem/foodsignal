import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";

import {
  listProducts,
  listRecalls,
  ingredients,
  additives,
} from "@/lib/mock-data";

// Primary nav destinations (server components that render a heading).
import HomePage from "./page";
import ScanPage from "./scan/page";
import SearchPage from "./search/page";
import RecallsListPage from "./recalls/page";
import MethodologyPage from "./methodology/page";

// Dynamic route server components.
import ProductPage from "./products/[slug]/page";
import IngredientDetailPage from "./ingredients/[slug]/page";
import AdditiveDetailPage from "./additives/[slug]/page";
import RecallDetailPage from "./recalls/[slug]/page";

/**
 * Navigation smoke tests (Task 20.1).
 *
 * Requirements: 25.4, 2.3, 23.5.
 *
 * These tests assert route-level wiring rather than component internals:
 *
 * 1. Primary nav routes resolve — the server components behind the primary
 *    navigation destinations (Home, Scan, Search, Recalls, Methodology) can be
 *    imported and rendered without throwing, and each produces a heading.
 *
 * 2. Dynamic routes resolve known slugs — the product / ingredient / additive /
 *    recall server components, invoked with a slug drawn from the mock-data
 *    layer (`listProducts()`, `listRecalls()`, the ingredient/additive
 *    fixtures), do NOT throw. They resolve the entity via `get*BySlug` and
 *    return a React element (R23.5, the success path).
 *
 * 3. Unknown slugs fall back to not-found — invoking each dynamic route's
 *    default export with a slug that matches no fixture triggers the Next.js
 *    `notFound()` control-flow error synchronously in the component body
 *    (verified by reading each page), so calling the function THROWS
 *    (R2.3, R23.5).
 *
 * For the dynamic routes we CALL the server component function (rather than
 * full-`render`) for two reasons: it exercises exactly the slug-resolution /
 * not-found branch under test, and it avoids pulling the client child
 * components (e.g. `ProductDetail`, `SearchClient`) through a full jsdom render
 * where a function/render-prop boundary is irrelevant to routing. The simple
 * static pages are rendered fully so we can assert a real heading is produced.
 */

// A slug that matches no fixture in any catalog.
const UNKNOWN_SLUG = "definitely-not-a-real-slug-xyz";

describe("Navigation smoke tests — primary nav routes resolve (R25.4)", () => {
  it("Home (`/`) renders without throwing and produces a heading", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toBeInTheDocument();
  });

  it("Scan (`/scan`) renders without throwing and produces a heading", () => {
    render(<ScanPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /scan a product/i }),
    ).toBeInTheDocument();
  });

  it("Search (`/search`) server page renders without throwing and produces a heading", () => {
    render(<SearchPage />);
    // SearchPage is a server component that hands mock data to the interactive
    // SearchClient; asserting the top-level heading renders confirms the route
    // resolves. (The page has additional H2 state headings, so target the H1.)
    expect(
      screen.getByRole("heading", { level: 1, name: /search/i }),
    ).toBeInTheDocument();
  });

  it("Recalls (`/recalls`) renders without throwing and produces a heading", () => {
    render(<RecallsListPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /recall/i }),
    ).toBeInTheDocument();
  });

  it("Methodology (`/methodology`) renders without throwing and produces a heading", () => {
    render(<MethodologyPage />);
    expect(
      screen.getByRole("heading", { level: 1 }),
    ).toBeInTheDocument();
  });
});

describe("Navigation smoke tests — dynamic routes resolve known slugs (R23.5)", () => {
  it("product page does not throw for a known product slug and returns an element", () => {
    const knownSlug = listProducts()[0].slug;
    let element: React.ReactNode;
    expect(() => {
      element = ProductPage({ params: { slug: knownSlug } });
    }).not.toThrow();
    expect(element).toBeTruthy();
  });

  it("ingredient page does not throw for a known ingredient slug and returns an element", () => {
    const knownSlug = Object.values(ingredients)[0].slug;
    let element: React.ReactNode;
    expect(() => {
      element = IngredientDetailPage({ params: { slug: knownSlug } });
    }).not.toThrow();
    expect(element).toBeTruthy();
  });

  it("additive page does not throw for a known additive slug and returns an element", () => {
    const knownSlug = Object.values(additives)[0].slug;
    let element: React.ReactNode;
    expect(() => {
      element = AdditiveDetailPage({ params: { slug: knownSlug } });
    }).not.toThrow();
    expect(element).toBeTruthy();
  });

  it("recall page does not throw for a known recall slug and returns an element", () => {
    const knownSlug = listRecalls()[0].slug;
    let element: React.ReactNode;
    expect(() => {
      element = RecallDetailPage({ params: { slug: knownSlug } });
    }).not.toThrow();
    expect(element).toBeTruthy();
  });
});

describe("Navigation smoke tests — unknown slugs fall back to not-found (R2.3, R23.5)", () => {
  it("product page throws the Next notFound() error for an unknown slug", () => {
    expect(() =>
      ProductPage({ params: { slug: UNKNOWN_SLUG } }),
    ).toThrow();
  });

  it("ingredient page throws the Next notFound() error for an unknown slug", () => {
    expect(() =>
      IngredientDetailPage({ params: { slug: UNKNOWN_SLUG } }),
    ).toThrow();
  });

  it("additive page throws the Next notFound() error for an unknown slug", () => {
    expect(() =>
      AdditiveDetailPage({ params: { slug: UNKNOWN_SLUG } }),
    ).toThrow();
  });

  it("recall page throws the Next notFound() error for an unknown slug", () => {
    expect(() =>
      RecallDetailPage({ params: { slug: UNKNOWN_SLUG } }),
    ).toThrow();
  });
});
