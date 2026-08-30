import type { AssessmentStatus } from "@/lib/mock-data";
import { Badge, Icon, type BadgeTone } from "@/components/primitives";

/**
 * StatusIndicator (Requirements 6.1, 6.2, 6.3, 6.4, 10.1, 10.2, 20.6)
 *
 * Renders an `AssessmentStatus` (Safe / Caution / Avoid) as a domain component
 * that composes the domain-agnostic `Badge` + `Icon` primitives.
 *
 * Invariants enforced here (never color-only status — R6.4 / R20.6):
 * - A mandatory, non-empty TEXT label is always rendered (R6.1).
 * - A distinct icon/shape is always rendered per status (R6.2), and the three
 *   shapes are differentiable WITHOUT color (R6.3): Safe = check inside a
 *   circle, Caution = exclamation inside a triangle, Avoid = cross inside an
 *   octagon. These differ in silhouette, so they read in grayscale and for
 *   color-blind users.
 * - Color (via the Badge `tone`) is applied ONLY as reinforcement (R6.4); the
 *   label + shape fully carry the meaning on their own.
 *
 * Data is read via props only (R10.2); the component holds the FoodSignal
 * status semantics but performs no I/O.
 */
export interface StatusIndicatorProps {
  status: AssessmentStatus;
  size?: "sm" | "md" | "lg";
  /**
   * Optional className passthrough for layout composition. Purely
   * presentational; never used to encode status meaning.
   */
  className?: string;
}

interface StatusPresentation {
  /** Non-empty human-readable label — ALWAYS present (R6.1). */
  label: string;
  /** Badge tone maps to the reinforcement-only status color family (R6.4). */
  tone: Extract<BadgeTone, "safe" | "caution" | "avoid">;
  /** Distinct, color-independent shape silhouette (R6.2, R6.3). */
  shape: "circle-check" | "triangle-exclaim" | "octagon-cross";
}

const STATUS_PRESENTATION: Record<AssessmentStatus, StatusPresentation> = {
  safe: { label: "Safe", tone: "safe", shape: "circle-check" },
  caution: { label: "Caution", tone: "caution", shape: "triangle-exclaim" },
  avoid: { label: "Avoid", tone: "avoid", shape: "octagon-cross" },
};

const ICON_SIZE: Record<NonNullable<StatusIndicatorProps["size"]>, string> = {
  sm: "0.875em",
  md: "1em",
  lg: "1.25em",
};

/**
 * SVG glyph per status. Each glyph combines a distinct OUTER SHAPE with an
 * inner mark so the three statuses stay differentiable without color and at
 * small sizes / in grayscale (R6.3).
 */
function StatusGlyph({
  shape,
}: {
  shape: StatusPresentation["shape"];
}) {
  switch (shape) {
    case "circle-check":
      return (
        <>
          <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
          <path
            d="M8 12.5l2.5 2.5 5-5.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </>
      );
    case "triangle-exclaim":
      return (
        <>
          <path
            d="M12 3.5l9 15.5H3z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path d="M12 9v4.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
          <circle cx="12" cy="16.5" r="1.1" fill="currentColor" />
        </>
      );
    case "octagon-cross":
      return (
        <>
          <path
            d="M8.2 3.5h7.6L20.5 8.2v7.6L15.8 20.5H8.2L3.5 15.8V8.2z"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinejoin="round"
          />
          <path
            d="M9.5 9.5l5 5m0-5l-5 5"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
          />
        </>
      );
    default:
      return null;
  }
}

export function StatusIndicator({
  status,
  size = "md",
  className,
}: StatusIndicatorProps) {
  const presentation = STATUS_PRESENTATION[status];

  return (
    <Badge
      tone={presentation.tone}
      className={className}
      // Expose the status through a stable data attribute for composition/tests
      // without relying on color.
      data-status={status}
      leadingVisual={
        <Icon
          // Icon is decorative here: the adjacent text label already names the
          // status, so the shape is reinforcement for sighted users while the
          // visible label serves screen readers (avoids double announcement).
          decorative
          size={ICON_SIZE[size]}
          viewBox="0 0 24 24"
        >
          <StatusGlyph shape={presentation.shape} />
        </Icon>
      }
    >
      {presentation.label}
    </Badge>
  );
}

export default StatusIndicator;
