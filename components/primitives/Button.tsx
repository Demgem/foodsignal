import type { ButtonHTMLAttributes, ReactNode } from "react";

/**
 * Button (Requirements 9.1, 9.2)
 *
 * Domain-agnostic action trigger. All content arrives via `children`/props; the
 * component holds no domain knowledge.
 *
 * Accessibility:
 * - Renders a native `<button>` so it is keyboard-operable by default
 *   (Requirement 20.1).
 * - Renders a VISIBLE focus indicator driven by the focus-ring design token
 *   (`ring-focus` / `--color-focus-ring`) via `focus-visible` styles
 *   (Requirements 9.2, 20.2). `focus-visible` keeps the ring for keyboard users
 *   without showing it on pointer clicks.
 */
export type ButtonVariant = "primary" | "secondary" | "tertiary";
export type ButtonSize = "sm" | "md" | "lg";

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  /** Optional leading visual (e.g. an Icon). Purely presentational. */
  leadingVisual?: ReactNode;
  /** Optional trailing visual (e.g. an Icon). Purely presentational. */
  trailingVisual?: ReactNode;
  children: ReactNode;
}

const base =
  "inline-flex items-center justify-center gap-sm rounded-md font-sans font-semibold " +
  "transition-colors duration-fast ease-base " +
  "disabled:cursor-not-allowed disabled:opacity-60 " +
  // Visible, token-driven focus indicator (Requirements 9.2, 20.2).
  "focus:outline-none focus-visible:outline-none " +
  "focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 " +
  "focus-visible:ring-offset-background";

const variantClasses: Record<ButtonVariant, string> = {
  primary: "bg-brand text-brand-fg hover:bg-brand-hover border border-transparent",
  secondary:
    "bg-surface text-text-primary border border-border hover:bg-surface-muted",
  tertiary:
    "bg-transparent text-brand border border-transparent hover:bg-surface-muted",
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: "text-label px-sm py-xs min-h-8",
  md: "text-label px-md py-sm min-h-10",
  lg: "text-body px-lg py-sm min-h-12",
};

export function Button({
  variant = "primary",
  size = "md",
  leadingVisual,
  trailingVisual,
  type = "button",
  className,
  children,
  ...rest
}: ButtonProps) {
  const classes = [
    base,
    variantClasses[variant],
    sizeClasses[size],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <button type={type} className={classes} {...rest}>
      {leadingVisual != null ? (
        <span className="inline-flex shrink-0 items-center">{leadingVisual}</span>
      ) : null}
      <span>{children}</span>
      {trailingVisual != null ? (
        <span className="inline-flex shrink-0 items-center">{trailingVisual}</span>
      ) : null}
    </button>
  );
}

export default Button;
