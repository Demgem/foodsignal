import type { AnchorHTMLAttributes, HTMLAttributes, ReactNode } from "react";

/**
 * Chip (Requirement 9.1)
 *
 * Compact tag/label. Domain-agnostic: content arrives via `children`; the
 * component holds no domain knowledge. Consumed by domain components such as
 * `SourceChip` (which supply the domain meaning).
 *
 * Can render as a static `<span>` or, when an `href` is provided, as an anchor
 * so it becomes keyboard-focusable with a visible token-driven focus ring
 * (Requirement 20.2).
 */
export interface ChipBaseProps {
  children: ReactNode;
  /** Optional leading visual (e.g. an Icon). Purely presentational. */
  leadingVisual?: ReactNode;
}

export type ChipProps =
  | (ChipBaseProps & { href: string } & AnchorHTMLAttributes<HTMLAnchorElement>)
  | (ChipBaseProps & { href?: undefined } & HTMLAttributes<HTMLSpanElement>);

const base =
  "inline-flex items-center gap-xs rounded-full border border-border " +
  "bg-surface-muted px-sm py-xs text-caption text-text-secondary";

const interactive =
  "transition-colors duration-fast ease-base hover:bg-surface " +
  "focus:outline-none focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-focus focus-visible:ring-offset-1 focus-visible:ring-offset-background";

export function Chip(props: ChipProps) {
  const { children, leadingVisual, className, ...rest } = props as ChipBaseProps & {
    className?: string;
    href?: string;
  };

  const content = (
    <>
      {leadingVisual != null ? (
        <span className="inline-flex shrink-0 items-center">{leadingVisual}</span>
      ) : null}
      <span>{children}</span>
    </>
  );

  if (typeof props.href === "string") {
    const anchorRest = rest as AnchorHTMLAttributes<HTMLAnchorElement>;
    return (
      <a
        className={[base, interactive, className].filter(Boolean).join(" ")}
        {...anchorRest}
      >
        {content}
      </a>
    );
  }

  const spanRest = rest as HTMLAttributes<HTMLSpanElement>;
  return (
    <span className={[base, className].filter(Boolean).join(" ")} {...spanRest}>
      {content}
    </span>
  );
}

export default Chip;
