"use client";

import { useId, useState, type ReactNode } from "react";

/**
 * Disclosure (Requirements 9.1, 9.4, 20.1, 20.2)
 *
 * Accessible expand/collapse. Domain-agnostic: the trigger label and the
 * revealed content both arrive via props; the component holds no domain
 * knowledge.
 *
 * Accessibility:
 * - The trigger is a native `<button>`, so it is keyboard operable (Enter /
 *   Space) and focusable by default (Requirement 20.1).
 * - `aria-expanded` reflects open/closed state and `aria-controls` points at
 *   the content region (Requirement 9.4).
 * - The content region has a matching `id` and, when collapsed, is removed from
 *   the accessibility tree via `hidden`.
 * - A visible, token-driven focus ring is applied to the trigger
 *   (Requirement 20.2).
 *
 * Supports both controlled (`open` + `onOpenChange`) and uncontrolled
 * (`defaultOpen`) usage so it stays flexible for composing domain components
 * (e.g. `IngredientExplanation`).
 */
export interface DisclosureProps {
  /** Visible label / summary for the trigger. */
  label: ReactNode;
  /** Content revealed when expanded. */
  children: ReactNode;
  /** Uncontrolled initial open state. Ignored when `open` is provided. */
  defaultOpen?: boolean;
  /** Controlled open state. */
  open?: boolean;
  /** Called with the next open state when the trigger is activated. */
  onOpenChange?: (open: boolean) => void;
  /** Optional indicator rendered in the trigger (e.g. a chevron Icon). */
  indicator?: (open: boolean) => ReactNode;
  className?: string;
  triggerClassName?: string;
  contentClassName?: string;
}

export function Disclosure({
  label,
  children,
  defaultOpen = false,
  open: controlledOpen,
  onOpenChange,
  indicator,
  className,
  triggerClassName,
  contentClassName,
}: DisclosureProps) {
  const contentId = useId();
  const [uncontrolledOpen, setUncontrolledOpen] = useState(defaultOpen);

  const isControlled = controlledOpen !== undefined;
  const isOpen = isControlled ? controlledOpen : uncontrolledOpen;

  const toggle = () => {
    const next = !isOpen;
    if (!isControlled) {
      setUncontrolledOpen(next);
    }
    onOpenChange?.(next);
  };

  return (
    <div className={className}>
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls={contentId}
        onClick={toggle}
        className={[
          "flex w-full items-center justify-between gap-sm text-left",
          "rounded-md px-sm py-sm text-label font-semibold text-text-primary",
          "transition-colors duration-fast ease-base hover:bg-surface-muted",
          "focus:outline-none focus-visible:outline-none focus-visible:ring-2",
          "focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background",
          triggerClassName,
        ]
          .filter(Boolean)
          .join(" ")}
      >
        <span>{label}</span>
        {indicator ? (
          <span className="inline-flex shrink-0 items-center">
            {indicator(isOpen)}
          </span>
        ) : null}
      </button>
      <div
        id={contentId}
        hidden={!isOpen}
        className={["px-sm pb-sm text-body text-text-secondary", contentClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {children}
      </div>
    </div>
  );
}

export default Disclosure;
