import type { AnchorHTMLAttributes } from "react";
import type { Source } from "@/lib/mock-data/types";
import { Chip, Icon } from "@/components/primitives";

/**
 * SourceChip (Requirements 10.1, 10.2, 10.5)
 *
 * Compact provenance chip identifying a single evidence `Source`
 * (see design.md — "SourceChip"). Composed from the domain-agnostic `Chip`
 * primitive, which supplies consistent styling, keyboard focus, and a visible
 * focus ring when rendered as a link.
 *
 * Behaviour:
 * - Always shows the source name so provenance is legible on its own.
 * - When the source has a `url`, the chip renders as an anchor linking to it
 *   (opening in a new tab with safe `rel`); otherwise it renders as a static,
 *   non-interactive chip.
 * - A small leading icon reinforces that the chip represents an external
 *   reference when it is a link. The icon is decorative — the visible source
 *   name carries the meaning.
 *
 * Data is read via props only (Requirement 10.2); the component performs no
 * fetching and holds no state.
 */
export interface SourceChipProps {
  source: Source;
  className?: string;
}

/** Decorative outbound-link glyph shown on linked source chips. */
function LinkGlyph() {
  return (
    <Icon decorative size="0.875rem" viewBox="0 0 24 24">
      <path d="M14 3a1 1 0 0 0 0 2h3.586l-7.293 7.293a1 1 0 0 0 1.414 1.414L19 6.414V10a1 1 0 1 0 2 0V4a1 1 0 0 0-1-1h-6Z" />
      <path d="M5 5a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-5a1 1 0 1 0-2 0v5H5V7h5a1 1 0 0 0 0-2H5Z" />
    </Icon>
  );
}

export function SourceChip({ source, className }: SourceChipProps) {
  const hasUrl = typeof source.url === "string" && source.url.length > 0;

  if (hasUrl) {
    const anchorProps: AnchorHTMLAttributes<HTMLAnchorElement> = {
      href: source.url,
      target: "_blank",
      rel: "noopener noreferrer",
    };
    return (
      <Chip
        {...anchorProps}
        leadingVisual={<LinkGlyph />}
        className={className}
        data-source-id={source.id}
        // Reinforce that this opens an external reference for screen readers.
        aria-label={`${source.name} (opens source in a new tab)`}
      >
        {source.name}
      </Chip>
    );
  }

  return (
    <Chip className={className} data-source-id={source.id}>
      {source.name}
    </Chip>
  );
}

export default SourceChip;
