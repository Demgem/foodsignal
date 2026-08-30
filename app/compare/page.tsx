import type { Metadata } from "next";
import Link from "next/link";

// Import domain components from their module files directly (rather than the
// `@/components/domain` barrel) so this server component's module graph does
// not transitively include unrelated domain components.
import { ScoreDisplay } from "@/components/domain/ScoreDisplay";
import { StatusIndicator } from "@/components/domain/StatusIndicator";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeaderCell,
  TableRow,
} from "@/components/primitives";
import { listProducts, type Product } from "@/lib/mock-data";

/**
 * Compare page — `/compare` (Requirements 17.3, 20.8).
 *
 * Renders a side-by-side comparison of several sample products using their
 * assessment status, 0–100 score, and key attributes. Content is read only via
 * the `listProducts()` selector from the typed mock-data layer — no network,
 * computation, or persistence (design "Layering Rules"; R24.2, R24.8).
 *
 * Accessibility (R20.8 / design "SR-friendly tables"):
 *  - The comparison is a single semantic `<table>` with a screen-reader-friendly
 *    `<caption>`.
 *  - Products are the COLUMNS: each product header is a `<th scope="col">` so
 *    every data cell is associated with its product.
 *  - Attributes are the ROWS: each attribute label is a `<th scope="row">` so
 *    every data cell is also associated with its attribute. This two-axis
 *    header association lets a screen reader announce, for any cell, both the
 *    product and the attribute it belongs to.
 *  - Status is conveyed by the `StatusIndicator` (text + shape, never color
 *    alone, R20.6); the score uses tabular figures via `ScoreDisplay`.
 *  - A single H1 is rendered for the page (R5.2).
 *
 * This is a static server component: it compares a fixed set of the sample
 * products rather than offering interactive product selection, which keeps the
 * prototype simple while fully demonstrating the accessible comparison table.
 */

export const metadata: Metadata = {
  title: "Compare products — FoodSignal",
  description:
    "Side-by-side comparison of sample products by status, score, market, and key attributes. Rendered from sample data in this prototype.",
};

/** A single comparison attribute: a row label plus how to render each product's cell. */
interface CompareAttribute {
  /** Stable key for React lists. */
  key: string;
  /** Row header label (rendered as `<th scope="row">`). */
  label: string;
  /** Render the cell value for a given product. */
  render: (product: Product) => React.ReactNode;
}

/** Does the product currently have at least one ACTIVE recall? */
function hasActiveRecall(product: Product): boolean {
  return product.recalls.some((recall) => recall.active);
}

/** Comma-separated list of DECLARED allergens, or a plain-language fallback. */
function declaredAllergens(product: Product): string {
  const declared = product.allergens
    .filter((allergen) => allergen.declared)
    .map((allergen) => allergen.name);
  return declared.length > 0 ? declared.join(", ") : "None declared";
}

/**
 * The attribute rows, in reading order. Status and score come first (the
 * headline assessment signals), followed by market and the key structural
 * attributes (R17.3).
 */
const COMPARE_ATTRIBUTES: CompareAttribute[] = [
  {
    key: "status",
    label: "Status",
    render: (product) => <StatusIndicator status={product.assessment.status} />,
  },
  {
    key: "score",
    label: "Score",
    render: (product) => (
      <ScoreDisplay score={product.assessment.score} label="out of 100" />
    ),
  },
  {
    key: "market",
    label: "Market",
    render: (product) => product.market,
  },
  {
    key: "brand",
    label: "Brand",
    render: (product) => product.brand,
  },
  {
    key: "ingredients",
    label: "Ingredients",
    render: (product) => `${product.ingredients.length}`,
  },
  {
    key: "additives",
    label: "Additives",
    render: (product) => `${product.additives.length}`,
  },
  {
    key: "allergens",
    label: "Declared allergens",
    render: (product) => declaredAllergens(product),
  },
  {
    key: "recall",
    label: "Active recall",
    render: (product) => (hasActiveRecall(product) ? "Yes" : "No"),
  },
];

export default function ComparePage() {
  const products = listProducts();

  return (
    <div className="mx-auto flex w-full max-w-6xl flex-col gap-xl px-lg py-xl">
      {/* Identity (single H1 per page — R5.2) */}
      <header className="flex flex-col gap-sm">
        <p className="text-label uppercase tracking-wide text-text-secondary">
          Compare
        </p>
        <h1 className="text-h1 text-text-primary">Compare products</h1>
        <p className="text-body text-text-secondary">
          A side-by-side look at sample products by status, score, market, and
          key attributes. All values are rendered from sample data in this
          prototype.
        </p>
      </header>

      <section
        aria-labelledby="compare-table-heading"
        className="flex flex-col gap-md"
      >
        <h2 id="compare-table-heading" className="text-h2 text-text-primary">
          Side-by-side comparison
        </h2>

        {/*
          Horizontal scroll container so the table stays usable on narrow
          viewports without losing its semantics. The table itself carries a
          caption and two-axis header scope for screen readers (R20.8).
        */}
        <div className="overflow-x-auto">
          <Table
            caption="Comparison of sample products. Each column is a product and each row is an attribute; status and score summarise the assessment, followed by market and key attributes."
            className="min-w-[40rem]"
          >
            <TableHead>
              <TableRow>
                {/*
                  Top-left corner cell. It labels the axis of the ROW headers
                  (the attribute names) that follow beneath it, so it is a
                  column header scoped to its column.
                */}
                <TableHeaderCell scope="col">Attribute</TableHeaderCell>
                {products.map((product) => (
                  <TableHeaderCell key={product.slug} scope="col">
                    <Link
                      href={`/products/${product.slug}`}
                      className="rounded-md font-semibold text-text-primary underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus"
                    >
                      {product.name}
                    </Link>
                    <span className="mt-xs block text-caption font-normal text-text-secondary">
                      {product.brand}
                    </span>
                  </TableHeaderCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {COMPARE_ATTRIBUTES.map((attribute) => (
                <TableRow key={attribute.key}>
                  {/* Row header: associates every cell in this row with the attribute (R20.8). */}
                  <TableHeaderCell scope="row">{attribute.label}</TableHeaderCell>
                  {products.map((product) => (
                    <TableCell key={product.slug}>
                      {attribute.render(product)}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </section>
    </div>
  );
}
