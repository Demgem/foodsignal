import type { ReactNode } from "react";
import { NumericValue } from "@/components/domain/NumericValue";

/**
 * ScoreDisplay (Requirements 10.4, 5.3, 8.2)
 *
 * Renders the FoodSignal 0–100 assessment score as a self-contained domain
 * component.
 *
 * Invariants enforced here:
 * - **Tabular figures (R10.4 / R5.3):** the numeric score is rendered through
 *   the shared `NumericValue` component, which applies the `.tabular-nums`
 *   utility so digits occupy equal width and align vertically wherever scores
 *   appear (search results, product page, comparisons).
 * - **Recall precedence / score never suppresses the recall banner (R8.2):**
 *   `ScoreDisplay` is deliberately independent. It knows nothing about recalls
 *   and renders ONLY the score — it can never render, hide, gate, or replace a
 *   `RecallBanner`. The page layer composes the two side by side (design
 *   "Recall Precedence"), so an active recall banner is always rendered
 *   independent of the score presentation.
 *
 * The score is clamped to the documented 0–100 range for display so an
 * out-of-range prop can never present a misleading value; content is otherwise
 * read via props only (design "Layering Rules" — no I/O).
 */

/** The inclusive score bounds documented in the design (`0..100`). */
export const SCORE_MIN = 0;
export const SCORE_MAX = 100;

export interface ScoreDisplayProps {
  /** The assessment score in the inclusive range 0..100. */
  score: number;
  /**
   * Optional descriptive label rendered alongside the score (e.g.
   * "FoodSignal score"). Purely presentational; omitted when not provided.
   */
  label?: string;
  /** Presentational className passthrough for layout composition. */
  className?: string;
}

function cx(...classes: Array<string | undefined | false>): string {
  return classes.filter(Boolean).join(" ");
}

/**
 * Clamp the score to the documented 0..100 range. `NaN` falls back to the
 * lower bound so the component always renders a valid, in-range number.
 */
function clampScore(score: number): number {
  if (Number.isNaN(score)) {
    return SCORE_MIN;
  }
  return Math.min(SCORE_MAX, Math.max(SCORE_MIN, score));
}

export function ScoreDisplay({
  score,
  label,
  className,
}: ScoreDisplayProps): ReactNode {
  const value = clampScore(score);
  const hasLabel = typeof label === "string" && label.trim().length > 0;

  return (
    <div
      className={cx("inline-flex flex-col gap-xs", className)}
      data-score={value}
    >
      {hasLabel ? (
        <span className="text-label text-text-secondary" data-score-label="true">
          {label}
        </span>
      ) : null}
      {/*
        R10.4 / R5.3: the numeric score is rendered with tabular figures via the
        shared NumericValue component. The unit is intentionally omitted — the
        0..100 score is unitless.
      */}
      <NumericValue value={value} className="text-display" />
    </div>
  );
}

export default ScoreDisplay;
