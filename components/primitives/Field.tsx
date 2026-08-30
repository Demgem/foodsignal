import { useId, type ReactNode } from "react";

/**
 * Field (Requirements 9.1, 9.5, 20.4, 20.10)
 *
 * Accessible form field wrapper that associates a `<label>`, an input, an
 * optional hint, and an optional error message. Domain-agnostic: it renders no
 * specific control itself. Instead it exposes the wiring ids to the caller via
 * a render prop so any control (input, textarea, select, custom) can be
 * associated correctly.
 *
 * Associations produced (Requirements 9.5, 20.4, 20.10):
 * - `<label htmlFor={inputId}>` ties the visible label to the control.
 * - `aria-describedby` on the control references the hint id and/or error id
 *   so assistive technology announces them.
 * - `aria-invalid="true"` is set on the control when an error is present.
 * - The error message is rendered with `role="alert"` so it is announced when
 *   it appears.
 */
export interface FieldRenderProps {
  /** id to place on the input; the label's `htmlFor` targets this. */
  inputId: string;
  /** Space-joined ids for `aria-describedby`, or undefined if none. */
  describedBy: string | undefined;
  /** Whether the field is in an error state (for `aria-invalid`). */
  invalid: boolean;
}

export interface FieldProps {
  /** Visible label text. */
  label: ReactNode;
  /** Optional helper/hint text associated via `aria-describedby`. */
  hint?: ReactNode;
  /** Optional error message; presence flips the field into the invalid state. */
  error?: ReactNode;
  /** Marks the field as required and renders a required indicator. */
  required?: boolean;
  /**
   * Render the control. Receives association metadata so the caller can spread
   * `id`, `aria-describedby`, and `aria-invalid` onto the actual input.
   */
  children: (props: FieldRenderProps) => ReactNode;
  className?: string;
  labelClassName?: string;
}

export function Field({
  label,
  hint,
  error,
  required = false,
  children,
  className,
  labelClassName,
}: FieldProps) {
  const inputId = useId();
  const hintId = useId();
  const errorId = useId();

  const invalid = error != null && error !== false && error !== "";

  const describedBy =
    [hint != null ? hintId : null, invalid ? errorId : null]
      .filter(Boolean)
      .join(" ") || undefined;

  return (
    <div className={["flex flex-col gap-xs", className].filter(Boolean).join(" ")}>
      <label
        htmlFor={inputId}
        className={["text-label text-text-primary", labelClassName]
          .filter(Boolean)
          .join(" ")}
      >
        {label}
        {required ? (
          <span className="text-status-avoid" aria-hidden="true">
            {" *"}
          </span>
        ) : null}
      </label>

      {hint != null ? (
        <p id={hintId} className="text-caption text-text-secondary">
          {hint}
        </p>
      ) : null}

      {children({ inputId, describedBy, invalid })}

      {invalid ? (
        <p id={errorId} role="alert" className="text-caption text-status-avoid">
          {error}
        </p>
      ) : null}
    </div>
  );
}

export default Field;
