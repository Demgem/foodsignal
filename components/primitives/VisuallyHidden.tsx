import type { ElementType, ReactNode } from "react";

/**
 * VisuallyHidden (Requirement 9.1)
 *
 * Renders content that is available to screen readers but visually hidden.
 * Domain-agnostic: all content arrives via `children`; the component holds no
 * domain knowledge.
 *
 * Uses the well-established "sr-only" clip technique so the text remains in the
 * accessibility tree (unlike `display: none` / `visibility: hidden`).
 */
export interface VisuallyHiddenProps {
  /** Content exposed to assistive technology but hidden visually. */
  children: ReactNode;
  /** Element to render as. Defaults to a `<span>`. */
  as?: ElementType;
}

const srOnlyStyle = {
  position: "absolute",
  width: "1px",
  height: "1px",
  padding: 0,
  margin: "-1px",
  overflow: "hidden",
  clip: "rect(0, 0, 0, 0)",
  whiteSpace: "nowrap",
  borderWidth: 0,
} as const;

export function VisuallyHidden({
  children,
  as: Component = "span",
}: VisuallyHiddenProps) {
  return <Component style={srOnlyStyle}>{children}</Component>;
}

export default VisuallyHidden;
