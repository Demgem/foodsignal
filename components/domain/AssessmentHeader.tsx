import { Component, type ReactNode } from "react";
import type { AssessmentResult, Product } from "@/lib/mock-data/types";
import { Card } from "@/components/primitives";
import { StatusIndicator } from "./StatusIndicator";
import { ScoreDisplay } from "./ScoreDisplay";

/**
 * AssessmentHeader (Requirements 10.1, 10.2, 10.3, 10.7)
 *
 * Product assessment header composing three independent sub-parts:
 * - **Identity**: product name + brand (+ market context).
 * - **Status**: `StatusIndicator` rendered with a mandatory text label AND icon
 *   (R10.3), never color-only.
 * - **Score**: the 0–100 assessment score rendered with tabular figures via
 *   `ScoreDisplay` (R10.3 — the score uses tabular figures).
 *
 * Resilient composition (R10.7): "IF one part of the AssessmentHeader fails to
 * render, THEN the Prototype SHALL still render the remaining parts." A single
 * thrown error during render normally unwinds React up to the nearest error
 * boundary and would blank the ENTIRE header. To honour R10.7 each sub-part is
 * therefore wrapped in its own small error boundary (`SectionBoundary`): if one
 * section throws, only that section is replaced by an accessible, non-blocking
 * fallback while the sibling sections continue to render. Defensive guards
 * additionally avoid throwing for merely-missing/empty data (a benign absence
 * renders nothing rather than a fallback notice).
 *
 * Data is read via props only (R10.2); the component performs no I/O.
 */
export interface AssessmentHeaderProps {
  product: Product;
  assessment: AssessmentResult;
  className?: string;
}

function cx(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

// ---------------------------------------------------------------------------
// Per-section error boundary (enables R10.7 resilient composition)
// ---------------------------------------------------------------------------

interface SectionBoundaryProps {
  /** Human name of the section, used in the accessible fallback copy. */
  section: string;
  /** Stable attribute so tests/composition can target the section. */
  part: string;
  children: ReactNode;
}

interface SectionBoundaryState {
  hasError: boolean;
}

/**
 * A minimal error-boundary-like wrapper scoped to a SINGLE header section. When
 * its subtree throws during render, it swaps in a calm, plain-language fallback
 * for that section only — the surrounding sections are unaffected, so the
 * header as a whole keeps rendering (R10.7).
 *
 * Error boundaries must be class components; there is no hook equivalent for
 * `getDerivedStateFromError` / `componentDidCatch`.
 */
class SectionBoundary extends Component<
  SectionBoundaryProps,
  SectionBoundaryState
> {
  constructor(props: SectionBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SectionBoundaryState {
    return { hasError: true };
  }

  render(): ReactNode {
    if (this.state.hasError) {
      // Non-alarmist, screen-reader-available fallback for the failed section.
      // Rendered as plain text so it can never itself throw.
      return (
        <span
          className="text-caption text-text-secondary"
          data-part={this.props.part}
          data-part-error="true"
        >
          {`This ${this.props.section} could not be shown.`}
        </span>
      );
    }

    return this.props.children;
  }
}

// ---------------------------------------------------------------------------
// Sub-part renderers (defensive; wrapped individually below)
// ---------------------------------------------------------------------------

function ProductIdentity({ product }: { product: Product }) {
  // Defensive reads: absence renders nothing rather than throwing.
  const name = typeof product?.name === "string" ? product.name.trim() : "";
  const brand = typeof product?.brand === "string" ? product.brand.trim() : "";
  const market =
    typeof product?.market === "string" ? product.market.trim() : "";

  return (
    <div className="flex flex-col gap-xs" data-part="identity">
      <h2 className="text-h2 font-display" data-identity-name="true">
        {name || "Product"}
      </h2>
      {brand ? (
        <p className="text-label text-text-secondary" data-identity-brand="true">
          {brand}
        </p>
      ) : null}
      {market ? (
        <p className="text-caption text-text-secondary" data-identity-market="true">
          {`Assessment for ${market}`}
        </p>
      ) : null}
    </div>
  );
}

function AssessmentStatusPart({
  assessment,
}: {
  assessment: AssessmentResult;
}) {
  // StatusIndicator itself enforces the text + icon invariant (R10.3).
  return (
    <div className="flex flex-col gap-xs" data-part="status">
      <span className="text-label text-text-secondary">Assessment status</span>
      <StatusIndicator status={assessment.status} size="lg" />
    </div>
  );
}

function AssessmentScorePart({
  assessment,
}: {
  assessment: AssessmentResult;
}) {
  // ScoreDisplay renders the value with tabular figures (R10.3 / R5.3) and
  // clamps to 0..100 internally.
  return (
    <div className="flex flex-col gap-xs" data-part="score">
      <ScoreDisplay score={assessment.score} label="FoodSignal score" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// AssessmentHeader
// ---------------------------------------------------------------------------

export function AssessmentHeader({
  product,
  assessment,
  className,
}: AssessmentHeaderProps) {
  return (
    <Card
      as="header"
      padding="lg"
      bordered
      className={cx("flex flex-col gap-md", className)}
      data-component="assessment-header"
    >
      <div className="flex flex-col gap-md sm:flex-row sm:items-start sm:justify-between">
        {/*
          Each sub-part is isolated behind its own SectionBoundary so a render
          failure in one part never blanks the others (R10.7).
        */}
        <SectionBoundary section="product identity" part="identity">
          <ProductIdentity product={product} />
        </SectionBoundary>

        <div className="flex flex-col gap-md sm:flex-row sm:items-start sm:gap-lg">
          <SectionBoundary section="assessment status" part="status">
            <AssessmentStatusPart assessment={assessment} />
          </SectionBoundary>

          <SectionBoundary section="score" part="score">
            <AssessmentScorePart assessment={assessment} />
          </SectionBoundary>
        </div>
      </div>
    </Card>
  );
}

export default AssessmentHeader;
