import type { ReactNode, SVGProps } from "react";

/**
 * Icon (Requirements 9.1, 9.6)
 *
 * Renders an inline SVG with an accessible name. Domain-agnostic: the SVG paths
 * arrive via `children` and the accessible name via `label`. The component
 * holds no domain knowledge and never hard-codes a specific glyph.
 *
 * Accessibility:
 * - When `label` is provided, the SVG is exposed as an image with an accessible
 *   name (`role="img"` + `aria-label`), so screen readers announce it.
 * - When `label` is omitted (or `decorative` is true), the icon is hidden from
 *   assistive technology (`aria-hidden`), which is correct for purely
 *   decorative icons sitting next to visible text.
 */
export interface IconProps extends Omit<SVGProps<SVGSVGElement>, "aria-label"> {
  /**
   * Accessible name for the icon. Provide this when the icon conveys meaning on
   * its own. Omit it (or set `decorative`) for purely decorative icons.
   */
  label?: string;
  /** Force the icon to be treated as decorative (hidden from assistive tech). */
  decorative?: boolean;
  /** Inline SVG contents (paths, shapes, etc.). */
  children: ReactNode;
  /** viewBox for the SVG; defaults to a 24x24 grid. */
  viewBox?: string;
  /** Pixel size applied to width and height when not overridden. */
  size?: number | string;
}

export function Icon({
  label,
  decorative,
  children,
  viewBox = "0 0 24 24",
  size = "1em",
  width,
  height,
  focusable = false,
  ...rest
}: IconProps) {
  const isDecorative = decorative || !label;

  const a11yProps = isDecorative
    ? { "aria-hidden": true as const }
    : { role: "img" as const, "aria-label": label };

  return (
    <svg
      viewBox={viewBox}
      width={width ?? size}
      height={height ?? size}
      fill="currentColor"
      focusable={focusable}
      {...a11yProps}
      {...rest}
    >
      {children}
    </svg>
  );
}

export default Icon;
