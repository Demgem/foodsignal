import type { HTMLAttributes, ReactNode } from "react";

/**
 * Badge (Requirement 9.1)
 *
 * Small status/label marker. Domain-agnostic: content arrives via `children`
 * and the visual `tone` via a prop. It knows nothing about FoodSignal domain
 * concepts (status/confidence semantics live in domain components).
 *
 * `tone` selects a token-driven color family. Callers that need the
 * "never color alone" guarantee compose Badge with a visible text label and/or
 * an Icon — Badge itself never encodes meaning by color alone because the
 * label text is always the `children`.
 */
export type BadgeTone =
  | "neutral"
  | "brand"
  | "safe"
  | "caution"
  | "avoid"
  | "confidence";

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  tone?: BadgeTone;
  /** Optional leading visual (e.g. an Icon). Purely presentational. */
  leadingVisual?: ReactNode;
  children: ReactNode;
}

const base =
  "inline-flex items-center gap-xs rounded-sm border px-sm py-xs " +
  "text-label leading-none";

const toneClasses: Record<BadgeTone, string> = {
  neutral: "bg-surface-muted text-text-secondary border-border",
  brand: "bg-brand text-brand-fg border-transparent",
  safe: "bg-status-safe-surface text-status-safe-fg border-status-safe-border",
  caution:
    "bg-status-caution-surface text-status-caution-fg border-status-caution-border",
  avoid:
    "bg-status-avoid-surface text-status-avoid-fg border-status-avoid-border",
  confidence:
    "bg-confidence-surface text-confidence-fg border-confidence-border",
};

export function Badge({
  tone = "neutral",
  leadingVisual,
  className,
  children,
  ...rest
}: BadgeProps) {
  return (
    <span
      className={[base, toneClasses[tone], className].filter(Boolean).join(" ")}
      {...rest}
    >
      {leadingVisual != null ? (
        <span className="inline-flex shrink-0 items-center">{leadingVisual}</span>
      ) : null}
      <span>{children}</span>
    </span>
  );
}

export default Badge;
