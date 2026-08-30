import { useId, type ReactNode } from "react";

/**
 * DisabledFieldPreview (Requirements 3.2, 24.4, 20.4)
 *
 * A purely presentational, NON-FUNCTIONAL form-field preview for account stubs.
 * It renders an associated `<label>` and a disabled control so the layout reads
 * like a real form without submitting anywhere or handling any input.
 *
 * The control is `disabled` (so it is inert and announced as unavailable) and
 * the whole preview is wrapped so callers can compose several fields together.
 *
 * Accessibility (Requirement 20.4): the `<label>` is programmatically
 * associated with its control via `htmlFor`/`id`, and any hint is wired through
 * `aria-describedby`, so assistive tech announces the label and hint together
 * even though the control is inert.
 */
export interface DisabledFieldPreviewProps {
  /** Visible label text. */
  label: string;
  /** Input type for the disabled preview control. */
  type?: "text" | "email" | "password" | "tel";
  /** Placeholder shown inside the disabled control. */
  placeholder?: string;
  /** Optional hint rendered under the label. */
  hint?: ReactNode;
}

export function DisabledFieldPreview({
  label,
  type = "text",
  placeholder,
  hint,
}: DisabledFieldPreviewProps) {
  const inputId = useId();
  const hintId = useId();
  const describedBy = hint != null ? hintId : undefined;

  return (
    <div className="flex flex-col gap-xs">
      <label htmlFor={inputId} className="text-label text-text-primary">
        {label}
      </label>
      {hint != null ? (
        <p id={hintId} className="text-caption text-text-secondary">
          {hint}
        </p>
      ) : null}
      <input
        id={inputId}
        aria-describedby={describedBy}
        type={type}
        placeholder={placeholder}
        disabled
        aria-disabled="true"
        readOnly
        className="rounded-md border border-border bg-surface-muted px-md py-sm text-body text-text-muted"
      />
    </div>
  );
}

export default DisabledFieldPreview;
