import { render, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import fc from "fast-check";
import { NumericValue, MISSING_CONCENTRATION_TEXT } from "./NumericValue";

/**
 * Task 7.2 — Property-based test for the tabular-figure numeric invariant.
 *
 * Property 8: Numeric values use tabular figures.
 * For any numeric value, the rendered output exposes the number using tabular
 * figures (an element carrying the `.tabular-nums` utility whose text includes
 * the value), and — where a unit applies — the value and unit are grouped in a
 * single non-wrapping container (`whitespace-nowrap`) so the unit renders
 * unambiguously alongside the value and can never be orphaned.
 *
 * Validates: Requirements 5.3, 5.4
 */

// Finite numeric values only (no NaN / no ±Infinity). Mix integers and doubles
// so both whole amounts (scores, counts) and fractional amounts (concentrations)
// are exercised.
const NUMERIC_ARBITRARY = fc.oneof(
  fc.integer({ min: 0, max: 100 }),
  fc.double({ noNaN: true, noDefaultInfinity: true })
);

// Arbitrary non-empty, non-whitespace unit strings (the component treats blank
// units as "no unit", so constrain to units that actually render).
const UNIT_ARBITRARY = fc
  .string({ minLength: 1, maxLength: 8 })
  .filter((s) => s.trim().length > 0);

describe("NumericValue — Property 8: numeric values use tabular figures", () => {
  afterEach(() => {
    // Clean up the DOM between iterations so many renders don't leak nodes.
    cleanup();
  });

  it("renders the value in a .tabular-nums element for any numeric value", () => {
    fc.assert(
      fc.property(NUMERIC_ARBITRARY, (value) => {
        const { container } = render(<NumericValue value={value} />);

        // R5.3: the numeric output itself uses tabular figures.
        const tabular = container.querySelector(".tabular-nums");
        expect(tabular).not.toBeNull();

        // The tabular element's text includes the rendered value.
        expect(tabular?.textContent ?? "").toContain(String(value));

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("groups value + unit in the same non-wrapping container for any value/unit", () => {
    fc.assert(
      fc.property(NUMERIC_ARBITRARY, UNIT_ARBITRARY, (value, unit) => {
        const { container } = render(
          <NumericValue value={value} unit={unit} />
        );

        // R5.4: value + unit grouped in ONE non-wrapping wrapper.
        const tabular = container.querySelector(".tabular-nums");
        expect(tabular).not.toBeNull();

        // Find the nearest ancestor that does not wrap.
        const wrapper = tabular?.closest(".whitespace-nowrap");
        expect(wrapper).not.toBeNull();

        // The same non-wrapping wrapper contains BOTH the numeric text and the
        // unit text, so the unit is never orphaned from its value.
        const wrapperText = wrapper?.textContent ?? "";
        expect(wrapperText).toContain(String(value));
        expect(wrapperText).toContain(unit);

        // The tabular element is inside that same non-wrapping wrapper.
        expect(wrapper?.contains(tabular ?? null)).toBe(true);

        cleanup();
      }),
      { numRuns: 100 }
    );
  });

  it("renders MISSING_CONCENTRATION_TEXT when value is null (example-based)", () => {
    const { container } = render(<NumericValue value={null} />);
    expect(container.textContent).toContain(MISSING_CONCENTRATION_TEXT);
    // No tabular numeric element should be rendered for a missing value.
    expect(container.querySelector(".tabular-nums")).toBeNull();
  });
});
