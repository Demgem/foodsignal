import type { ReactNode } from "react";

/**
 * NumericValue (Requirements 5.3, 5.4, 19.5)
 *
 * Renders a numeric value — a score, nutrition amount, regulatory limit, etc. —
 * together with its optional unit, enforcing two typographic invariants from
 * the design ("Typography" section):
 *
 * - **Tabular figures (R5.3):** the numeric output uses the `.tabular-nums`
 *   utility so digits occupy equal width and align vertically across rows.
 * - **Unambiguous units that never orphan (R5.4):** the value and its unit are
 *   grouped inside a single inline-flex wrapper that does not wrap, so the unit
 *   can never break onto a line away from the value it belongs to.
 *
 * Missing-concentration handling (R19.5): when `value` is `null`/`undefined`,
 * the component renders the exact missing-concentration copy required by the
 * "Content & Language Guidelines" instead of a number. The default copy is
 * exported as `MISSING_CONCENTRATION_TEXT` and can be overridden per-usage via
 * `missingText` for other optional-numeric contexts.
 *
 * Data is read via props only (design "Layering Rules"); the component performs
 * no formatting beyond stringifying the provided value and holds no I/O.
 */

/**
 * The exact copy required by R19.5 when an optional product-level concentration
 * value is missing. Exported so pages/tests reference a single source of truth
 * rather than duplicating the literal string.
 */
export const MISSING_CONCENTRATION_TEXT =
  "The available product-level concentration was not provided.";

export interface NumericValueProps {
  /**
   * The numeric value to render. When `null` or `undefined`, the missing-value
   * copy (`missingText`) is rendered instead.
   */
  value?: number | null;
  /** Optional unit rendered inline with, and never orphaned from, the value. */
  unit?: string;
  /**
   * Copy shown when `value` is missing. Defaults to the R19.5
   * missing-concentration phrasing.
   */
  missingText?: string;
  /** Presentational className passthrough for layout composition. */
  className?: string;
}

function cx(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

export function NumericValue({
  value,
  unit,
  missingText = MISSING_CONCENTRATION_TEXT,
  className,
}: NumericValueProps): ReactNode {
  // R19.5: no value available — render the plain-language missing copy.
  if (value === null || value === undefined) {
    return (
      <span className={cx("text-text-secondary", className)} data-missing="true">
        {missingText}
      </span>
    );
  }

  const hasUnit = typeof unit === "string" && unit.trim().length > 0;

  return (
    // R5.4: value + unit grouped in one non-wrapping inline group so the unit
    // is unambiguous and never orphaned onto its own line.
    <span
      className={cx("inline-flex items-baseline gap-1 whitespace-nowrap", className)}
      data-numeric="true"
    >
      {/* R5.3: the numeric output itself uses tabular figures. */}
      <span className="tabular-nums">{value}</span>
      {hasUnit ? (
        <span className="text-text-secondary" data-unit="true">
          {unit}
        </span>
      ) : null}
    </span>
  );
}

export default NumericValue;
