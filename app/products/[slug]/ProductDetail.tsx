"use client";

import Link from "next/link";

import type {
  Allergen,
  Product,
  RegulatoryRecord,
  UserProfile,
} from "@/lib/mock-data/types";

import { AlternativeRecommendationCard } from "@/components/domain/AlternativeRecommendationCard";
import { ConfidenceIndicator } from "@/components/domain/ConfidenceIndicator";
import { EvidenceCard } from "@/components/domain/EvidenceCard";
import { IngredientExplanation } from "@/components/domain/IngredientExplanation";
import { NumericValue } from "@/components/domain/NumericValue";
import { RecallBanner } from "@/components/domain/RecallBanner";
import { RegulatoryComparisonTable } from "@/components/domain/RegulatoryComparisonTable";
import { ScoreDisplay } from "@/components/domain/ScoreDisplay";
import { SourceChip } from "@/components/domain/SourceChip";
import { StatusIndicator } from "@/components/domain/StatusIndicator";
import { WarningPanel } from "@/components/domain/WarningPanel";
import {
  Card,
  Table,
  TableBody,
  TableHead,
  TableHeaderCell,
  TableRow,
  TableCell,
} from "@/components/primitives";

/**
 * ProductDetail — the 17-section product-page composition (Task 13.1).
 *
 * This is the CLIENT component that renders the product page body. It is a
 * client component because it composes `IngredientExplanation`, which passes a
 * render-function `indicator` prop into the client `Disclosure` primitive.
 * Rendering that tree from a server component during static export would fail
 * to serialize the function prop across the server→client boundary, so the
 * composition lives here on the client side. The server `page.tsx` handles
 * slug resolution, `notFound()`, `generateMetadata`, and `generateStaticParams`
 * and passes the fully-resolved, serializable `product` + `profile` down as
 * props (data read via selectors only — design "Layering Rules").
 *
 * Section order (Requirement 13.1) is the single source of truth in
 * `SECTION_ORDER`; each section is wrapped in a `<section data-section="…">`
 * with an `<h2>` so order is programmatically verifiable and screen-reader
 * navigable (Requirement 20.3).
 *
 * Composition invariants: Assessment status uses `StatusIndicator` (text +
 * icon, R13.2); Nutrition is a semantic `<table>` with tabular figures +
 * unambiguous units via `NumericValue` (R13.3, R20.8); the personalized
 * `WarningPanel` renders when the profile matches a declared allergen (R13.4);
 * "Report a correction" is inert — no submission (R13.5); the active recall
 * banner is prominent near the top AND independent of the score (R8.1, R8.2),
 * and the Recalls section (12) always renders recall detail or the
 * "No active recall found in the sources checked." copy (R19.3).
 */

/**
 * The 17 product-page sections in their required order (Requirement 13.1).
 * Module-local: tests assert order by reading the rendered `data-section`
 * attributes in DOM order rather than importing this list.
 */
const SECTION_ORDER = [
  "product-identity",
  "market-country",
  "assessment-status",
  "score",
  "key-reasons",
  "ingredients",
  "ingredient-explanations",
  "additives",
  "nutrition",
  "allergens",
  "safety-regulatory-checks",
  "recalls",
  "potential-health-concerns",
  "evidence-confidence",
  "sources",
  "data-freshness",
  "report-correction",
] as const;

/** The exact plain-language copy used when there is no active recall (R19.3). */
const NO_ACTIVE_RECALL_TEXT = "No active recall found in the sources checked.";

export interface ProductDetailProps {
  product: Product;
  profile: UserProfile;
}

// ---------------------------------------------------------------------------
// Helpers (pure; no I/O)
// ---------------------------------------------------------------------------

/** Return only the currently active recalls for a product. */
function getActiveRecalls(product: Product) {
  return (product.recalls ?? []).filter((recall) => recall.active);
}

/**
 * Does the profile match at least one DECLARED allergen on the product?
 * Comparison is case-insensitive (mirrors WarningPanel's own matching) so the
 * page only surfaces the personalized WarningPanel when it will actually
 * report a match (Requirement 13.4).
 */
function profileMatchesDeclaredAllergen(
  profile: UserProfile,
  product: Product,
): boolean {
  const allergies = (profile.allergies ?? []).map((a) =>
    a.trim().toLowerCase(),
  );
  return (product.allergens ?? []).some(
    (allergen: Allergen) =>
      allergen.declared &&
      allergies.includes(allergen.name.trim().toLowerCase()),
  );
}

/**
 * Collect the de-duplicated regulatory records declared across a product's
 * additives (and ingredients) for the Safety/regulatory checks section.
 */
function collectRegulatoryRecords(product: Product): RegulatoryRecord[] {
  const records: RegulatoryRecord[] = [];
  const seen = new Set<string>();
  const push = (list?: RegulatoryRecord[]) => {
    for (const record of list ?? []) {
      const key = `${record.market}::${record.substanceId}`;
      if (!seen.has(key)) {
        seen.add(key);
        records.push(record);
      }
    }
  };
  for (const additive of product.additives ?? []) push(additive.regulatory);
  for (const ingredient of product.ingredients ?? []) push(ingredient.regulatory);
  return records;
}

/** Small labelled section wrapper carrying a stable `data-section` + `<h2>`. */
function Section({
  id,
  heading,
  children,
  className,
}: {
  id: (typeof SECTION_ORDER)[number];
  heading: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      data-section={id}
      aria-labelledby={`section-${id}`}
      className={["flex flex-col gap-md", className].filter(Boolean).join(" ")}
    >
      <h2 id={`section-${id}`} className="text-h2 font-display text-text-primary">
        {heading}
      </h2>
      {children}
    </section>
  );
}

// ---------------------------------------------------------------------------
// Composition
// ---------------------------------------------------------------------------

export function ProductDetail({ product, profile }: ProductDetailProps) {
  const { assessment } = product;
  const activeRecalls = getActiveRecalls(product);
  const hasActiveRecall = activeRecalls.length > 0;
  const showWarningPanel = profileMatchesDeclaredAllergen(profile, product);
  const regulatoryRecords = collectRegulatoryRecords(product);

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-2xl px-lg py-xl">
      {/*
        Recall precedence (Requirements 8.1, 8.2): an active recall is surfaced
        PROMINENTLY at the very top, above and independent of the score. The
        score can never suppress or replace it. The Recalls section (12) also
        renders below. RecallBanner renders nothing when there are no active
        recalls, so section order is unaffected.
      */}
      {hasActiveRecall ? (
        <RecallBanner
          recalls={activeRecalls}
          headingLevel="h2"
          regionLabel="Active recall alert"
        />
      ) : null}

      {/* Page title — exactly one H1 per page (Requirement 5.2). */}
      <h1 className="text-h1 font-display text-text-primary">{product.name}</h1>

      <article className="flex flex-col gap-2xl">
        {/* 1. Product identity */}
        <Section id="product-identity" heading="Product identity">
          <Card as="div" padding="md" bordered className="flex flex-col gap-sm">
            <dl className="m-0 grid gap-sm sm:grid-cols-2">
              <div className="flex flex-col gap-xs">
                <dt className="text-label text-text-secondary">Product</dt>
                <dd className="m-0 text-body text-text-primary">{product.name}</dd>
              </div>
              <div className="flex flex-col gap-xs">
                <dt className="text-label text-text-secondary">Brand</dt>
                <dd className="m-0 text-body text-text-primary">{product.brand}</dd>
              </div>
              {product.barcode ? (
                <div className="flex flex-col gap-xs">
                  <dt className="text-label text-text-secondary">Barcode</dt>
                  <dd className="m-0 text-body text-text-primary tabular-nums">
                    {product.barcode}
                  </dd>
                </div>
              ) : null}
            </dl>
            {product.imageUrl ? (
              // Decorative in the prototype (mock image path); empty alt so it
              // is skipped by assistive tech (Requirement 20.5).
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt=""
                className="mt-sm h-40 w-40 rounded-md border border-border object-cover"
              />
            ) : null}
          </Card>
        </Section>

        {/* 2. Market/country */}
        <Section id="market-country" heading="Market and country">
          <p className="text-body text-text-primary">
            This assessment applies to the{" "}
            <span className="font-semibold">{product.market}</span> market.
            Regulatory context can differ between markets.
          </p>
        </Section>

        {/* 3. Assessment status — StatusIndicator (text + icon), R13.2. */}
        <Section id="assessment-status" heading="Assessment status">
          <StatusIndicator status={assessment.status} size="lg" />
        </Section>

        {/*
          4. Score — independent of the recall banner (R8.2). ScoreDisplay only
          renders the score; it can never gate or replace the recall banner.
        */}
        <Section id="score" heading="Score">
          <ScoreDisplay score={assessment.score} label="FoodSignal score (0–100)" />
        </Section>

        {/* 5. Key reasons — top reasons behind the assessment. */}
        <Section id="key-reasons" heading="Key reasons">
          {assessment.reasons.length > 0 ? (
            <div className="flex flex-col gap-md">
              {assessment.reasons.map((reason, index) => (
                <EvidenceCard
                  key={`reason-${index}`}
                  title={`Reason ${index + 1}`}
                  body={reason}
                  confidence={assessment.confidence}
                  sources={assessment.sources}
                />
              ))}
            </div>
          ) : (
            <p className="text-body text-text-secondary">
              No specific reasons were recorded in the sources checked.
            </p>
          )}
        </Section>

        {/* 6. Ingredients */}
        <Section id="ingredients" heading="Ingredients">
          {product.ingredients.length > 0 ? (
            <ul className="flex list-disc flex-col gap-xs pl-md text-body text-text-primary">
              {product.ingredients.map((ingredient) => (
                <li key={ingredient.slug}>
                  <Link
                    href={`/ingredients/${ingredient.slug}`}
                    className="text-brand underline hover:text-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                  >
                    {ingredient.name}
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body text-text-secondary">
              No ingredients were listed in the sources checked.
            </p>
          )}
        </Section>

        {/* 7. Ingredient explanations — expandable, plain-language. */}
        <Section id="ingredient-explanations" heading="Ingredient explanations">
          {product.ingredients.length > 0 ? (
            <div className="flex flex-col gap-sm">
              {product.ingredients.map((ingredient) => (
                <IngredientExplanation
                  key={ingredient.slug}
                  ingredient={ingredient}
                  explanation={ingredient.explanation}
                  sources={ingredient.sources}
                />
              ))}
            </div>
          ) : (
            <p className="text-body text-text-secondary">
              No ingredient explanations were available in the sources checked.
            </p>
          )}
        </Section>

        {/* 8. Additives — with links to detail. */}
        <Section id="additives" heading="Additives">
          {product.additives.length > 0 ? (
            <ul className="flex list-none flex-col gap-sm p-0">
              {product.additives.map((additive) => (
                <li key={additive.slug} className="flex flex-col gap-xs">
                  <Link
                    href={`/additives/${additive.slug}`}
                    className="text-body font-semibold text-brand underline hover:text-brand-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background rounded-sm"
                  >
                    {additive.name}
                    {additive.code ? ` (${additive.code})` : ""}
                  </Link>
                  <p className="text-body text-text-secondary">
                    {additive.explanation}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body text-text-secondary">
              No additives were declared for this product in the sources checked.
            </p>
          )}
        </Section>

        {/*
          9. Nutrition — semantic table (Table primitive) with tabular figures
          and unambiguous units via NumericValue (Requirements 13.3, 20.8).
        */}
        <Section id="nutrition" heading="Nutrition">
          {product.nutrition.length > 0 ? (
            <Table caption="Nutrition information per the manufacturer label.">
              <TableHead>
                <TableRow>
                  <TableHeaderCell scope="col">Nutrient</TableHeaderCell>
                  <TableHeaderCell scope="col">Amount</TableHeaderCell>
                  <TableHeaderCell scope="col">Basis</TableHeaderCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {product.nutrition.map((fact, index) => (
                  <TableRow key={`${fact.label}-${index}`}>
                    <TableHeaderCell scope="row">{fact.label}</TableHeaderCell>
                    <TableCell>
                      {/* Tabular figures + unit never orphaned (R13.3, R5.4). */}
                      <NumericValue value={fact.value} unit={fact.unit} />
                    </TableCell>
                    <TableCell>
                      {fact.per ? (
                        fact.per
                      ) : (
                        <span
                          className="text-text-secondary"
                          aria-label="No basis provided"
                        >
                          {"\u2014"}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-body text-text-secondary">
              No nutrition information was available in the sources checked.
            </p>
          )}
        </Section>

        {/*
          10. Allergens — declared allergens; personalized WarningPanel when the
          profile matches a declared allergen (Requirement 13.4).
        */}
        <Section id="allergens" heading="Allergens">
          {product.allergens.length > 0 ? (
            <ul className="flex list-none flex-col gap-xs p-0 text-body text-text-primary">
              {product.allergens.map((allergen) => (
                <li key={allergen.name}>
                  <span className="font-semibold">{allergen.name}</span>
                  {allergen.declared
                    ? " — declared allergen"
                    : " — listed but not declared"}
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body text-text-secondary">
              No allergens were listed for this product in the sources checked.
            </p>
          )}
          {showWarningPanel ? (
            <WarningPanel profile={profile} product={product} headingLevel="h3" />
          ) : null}
        </Section>

        {/*
          11. Safety/regulatory checks — RegulatoryComparisonTable (R20.8). The
          prototype renders authored RegulatoryRecord data only (R24.5).
        */}
        <Section id="safety-regulatory-checks" heading="Safety and regulatory checks">
          {regulatoryRecords.length > 0 ? (
            <RegulatoryComparisonTable
              records={regulatoryRecords}
              caption="Regulatory status of this product's substances across the markets checked."
            />
          ) : (
            <p className="text-body text-text-secondary">
              No regulatory comparison records were available in the sources
              checked.
            </p>
          )}
        </Section>

        {/*
          12. Recalls — recall detail for active recalls, or the plain-language
          "No active recall found in the sources checked." copy (R19.3). Always
          present regardless of the top-of-page banner, so the 17-section order
          is intact.
        */}
        <Section id="recalls" heading="Recalls">
          {hasActiveRecall ? (
            <RecallBanner
              recalls={activeRecalls}
              headingLevel="h3"
              regionLabel="Recall details"
            />
          ) : (
            <p className="text-body text-text-primary">{NO_ACTIVE_RECALL_TEXT}</p>
          )}
        </Section>

        {/* 13. Potential health concerns — plain-language, evidence-cited. */}
        <Section id="potential-health-concerns" heading="Potential health concerns">
          {product.unknown.length > 0 || product.known.length > 0 ? (
            <EvidenceCard
              title="What the available evidence describes"
              body={
                product.known[0] ??
                "The available evidence for this product is described in the cited sources."
              }
              confidence={assessment.confidence}
              sources={product.sources}
            />
          ) : (
            <p className="text-body text-text-secondary">
              No specific health concerns were noted in the sources checked.
            </p>
          )}
        </Section>

        {/* 14. Evidence confidence — ConfidenceIndicator with description. */}
        <Section id="evidence-confidence" heading="Evidence confidence">
          <ConfidenceIndicator level={assessment.confidence} showDescription />
        </Section>

        {/* 15. Sources — SourceChip list. */}
        <Section id="sources" heading="Sources">
          {product.sources.length > 0 ? (
            <ul className="flex list-none flex-wrap gap-xs p-0">
              {product.sources.map((source) => (
                <li key={source.id}>
                  <SourceChip source={source} />
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-body text-text-secondary">
              No sources were recorded for this product.
            </p>
          )}
        </Section>

        {/* 16. Data freshness — caption style. */}
        <Section id="data-freshness" heading="Data freshness">
          <p className="text-caption text-text-secondary">
            This information was last updated on{" "}
            <time dateTime={assessment.data_freshness}>
              {assessment.data_freshness}
            </time>
            .
          </p>
        </Section>

        {/*
          17. Report correction — affordance only; performs NO submission
          (Requirement 13.5). No form action / handler is wired: the button is
          inert in the prototype and the note makes that explicit.
        */}
        <Section id="report-correction" heading="Report a correction">
          <Card as="div" padding="md" bordered className="flex flex-col gap-sm">
            <p className="text-body text-text-secondary">
              Noticed something that looks wrong? In the full product you would be
              able to report a correction here. This prototype does not submit any
              information.
            </p>
            <button
              type="button"
              disabled
              aria-disabled="true"
              className="inline-flex w-fit items-center justify-center rounded-md border border-border bg-surface px-md py-sm text-label font-semibold text-text-secondary opacity-70 focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
            >
              Report a correction (prototype — no submission)
            </button>
          </Card>
        </Section>
      </article>

      {/*
        Suggested alternative (if any). Rendered outside the numbered sections
        so it never disturbs the 17-section order. The card always carries its
        mandatory disclosure (Requirement 11.1).
      */}
      {product.alternatives && product.alternatives.length > 0 ? (
        <aside aria-label="Suggested alternative" className="flex flex-col gap-md">
          <h2 className="text-h2 font-display text-text-primary">
            Suggested alternative
          </h2>
          <AlternativeRecommendationCard alternative={product.alternatives[0]} />
        </aside>
      ) : null}
    </div>
  );
}

export default ProductDetail;
