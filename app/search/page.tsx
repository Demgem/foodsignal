import type { Metadata } from "next";
import { listProducts } from "@/lib/mock-data";
import { SearchClient } from "./SearchClient";

/**
 * Search page (`/search`) — task 14.3.
 *
 * Requirements: 16.1, 16.2, 16.3, 16.4
 *
 * This is a thin SERVER component so it can export page `metadata`
 * (Requirement 22.1; `generateMetadata`/`metadata` cannot live in a client
 * component). It reads the mock catalog synchronously via the sanctioned
 * `listProducts()` selector (mock-data layer is the only source of content —
 * R23.x/R24.2) and hands the fully-resolved, JSON-serialisable product list to
 * the interactive `SearchClient` child.
 *
 * The interactive filtering (typing in the search field, empty/no-results
 * states) is inherently client-side, so it lives in `SearchClient` marked
 * `"use client"`. No network, persistence, or computation happens here — the
 * client only filters over the already-authored mock data.
 */
export const metadata: Metadata = {
  title: "Search — FoodSignal",
  description:
    "Search products, ingredients and barcodes to find assessments, evidence and recalls in the FoodSignal prototype.",
};

export default function SearchPage() {
  // Resolve mock content on the server via the selector; pass it down as props
  // (domain/data flows via props only — design "Layering Rules").
  const products = listProducts();
  return <SearchClient products={products} />;
}
