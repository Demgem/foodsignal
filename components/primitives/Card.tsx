import type { ElementType, HTMLAttributes, ReactNode } from "react";

/**
 * Card (Requirement 9.1)
 *
 * Generic content container. Domain-agnostic: all content arrives via
 * `children`; the component holds no domain knowledge.
 *
 * `as` lets callers pick the correct semantic element (e.g. `article`,
 * `section`) so the card contributes correct semantics (Requirement 20.3)
 * without the primitive itself assuming a role.
 */
export type CardPadding = "none" | "sm" | "md" | "lg";
export type CardElevation = "none" | "sm" | "md";

export interface CardProps extends HTMLAttributes<HTMLElement> {
  as?: ElementType;
  padding?: CardPadding;
  elevation?: CardElevation;
  /** Render a visible border. Defaults to true. */
  bordered?: boolean;
  children: ReactNode;
}

const paddingClasses: Record<CardPadding, string> = {
  none: "",
  sm: "p-sm",
  md: "p-md",
  lg: "p-lg",
};

const elevationClasses: Record<CardElevation, string> = {
  none: "",
  sm: "shadow-sm",
  md: "shadow-md",
};

export function Card({
  as: Component = "div",
  padding = "md",
  elevation = "none",
  bordered = true,
  className,
  children,
  ...rest
}: CardProps) {
  const classes = [
    "rounded-lg bg-surface text-text-primary",
    bordered ? "border border-border" : "",
    paddingClasses[padding],
    elevationClasses[elevation],
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Component className={classes} {...rest}>
      {children}
    </Component>
  );
}

export default Card;
