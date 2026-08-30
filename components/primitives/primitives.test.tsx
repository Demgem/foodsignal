import { render, screen, fireEvent, cleanup } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";
import {
  Button,
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
  Disclosure,
  Field,
  Icon,
} from "@/components/primitives";

/**
 * Task 4.2 — Component tests for primitive accessibility contracts.
 *
 * Asserts the accessibility guarantees documented on each primitive against
 * their actual rendered output/API. These tests do not modify any primitive.
 *
 * Validates: Requirements 9.2, 9.3, 9.4, 9.5, 9.6
 */

afterEach(cleanup);

describe("Button accessibility (Requirement 9.2)", () => {
  it("renders a native, focusable <button>", () => {
    render(<Button>Save</Button>);
    const button = screen.getByRole("button", { name: "Save" });
    expect(button.tagName).toBe("BUTTON");
    // Native buttons are focusable by default.
    button.focus();
    expect(button).toHaveFocus();
  });

  it("exposes a visible focus-visible ring via design-token classes", () => {
    render(<Button>Focus me</Button>);
    const button = screen.getByRole("button", { name: "Focus me" });
    // Token-driven, keyboard-only focus indicator.
    expect(button.className).toContain("focus-visible:ring-2");
    expect(button.className).toContain("focus-visible:ring-focus");
    expect(button.className).toContain("focus-visible:ring-offset-2");
  });
});

describe("Table semantic markup (Requirement 9.3)", () => {
  it("renders a <caption> when the caption prop is provided", () => {
    const { container } = render(
      <Table caption="Nutrition facts">
        <TableBody>
          <TableRow>
            <TableCell>Energy</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const table = container.querySelector("table");
    expect(table).not.toBeNull();

    const caption = container.querySelector("caption");
    expect(caption).not.toBeNull();
    expect(caption).toHaveTextContent("Nutrition facts");

    // Semantic table is exposed via the table role with its accessible name.
    expect(
      screen.getByRole("table", { name: "Nutrition facts" })
    ).toBeInTheDocument();
  });

  it("omits the <caption> element when no caption prop is given", () => {
    const { container } = render(
      <Table>
        <TableBody>
          <TableRow>
            <TableCell>x</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );
    expect(container.querySelector("caption")).toBeNull();
  });

  it("renders <th scope> header cells (col by default, row when specified)", () => {
    const { container } = render(
      <Table caption="Comparison">
        <TableHead>
          <TableRow>
            <TableHeaderCell>Nutrient</TableHeaderCell>
            <TableHeaderCell>Amount</TableHeaderCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <TableHeaderCell scope="row">Sodium</TableHeaderCell>
            <TableCell>120mg</TableCell>
          </TableRow>
        </TableBody>
      </Table>
    );

    const headers = container.querySelectorAll("th");
    expect(headers.length).toBe(3);
    // Column headers default to scope="col".
    const colHeaders = screen.getAllByRole("columnheader");
    expect(colHeaders).toHaveLength(2);
    colHeaders.forEach((th) => expect(th).toHaveAttribute("scope", "col"));

    // The row header opts into scope="row".
    const rowHeader = screen.getByRole("rowheader", { name: "Sodium" });
    expect(rowHeader).toHaveAttribute("scope", "row");
  });
});

describe("Disclosure accessible toggle (Requirement 9.4)", () => {
  it("has a button whose aria-expanded flips on click", () => {
    render(
      <Disclosure label="More info">
        <p>Hidden details</p>
      </Disclosure>
    );

    const trigger = screen.getByRole("button", { name: "More info" });
    expect(trigger).toHaveAttribute("aria-expanded", "false");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "true");

    fireEvent.click(trigger);
    expect(trigger).toHaveAttribute("aria-expanded", "false");
  });

  it("wires aria-controls to the content region id", () => {
    const { container } = render(
      <Disclosure label="Details" defaultOpen>
        <p>Body content</p>
      </Disclosure>
    );

    const trigger = screen.getByRole("button", { name: "Details" });
    const controls = trigger.getAttribute("aria-controls");
    expect(controls).toBeTruthy();

    const content = container.querySelector(`#${CSS.escape(controls as string)}`);
    expect(content).not.toBeNull();
    expect(content).toHaveTextContent("Body content");
    // Open by default -> content is not hidden.
    expect(content).not.toHaveAttribute("hidden");
  });

  it("hides the content region from the a11y tree when collapsed", () => {
    const { container } = render(
      <Disclosure label="Toggle">
        <p>Secret</p>
      </Disclosure>
    );
    const trigger = screen.getByRole("button", { name: "Toggle" });
    const controls = trigger.getAttribute("aria-controls") as string;
    const content = container.querySelector(`#${CSS.escape(controls)}`);
    expect(content).toHaveAttribute("hidden");
  });
});

describe("Field label/input association (Requirement 9.5)", () => {
  it("associates the label with the control via htmlFor/id", () => {
    render(
      <Field label="Email">
        {({ inputId, describedBy, invalid }) => (
          <input
            id={inputId}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            type="email"
          />
        )}
      </Field>
    );

    // getByLabelText only succeeds when label<->input association is correct.
    const input = screen.getByLabelText("Email");
    expect(input.tagName).toBe("INPUT");
  });

  it("wires the hint via aria-describedby without an error", () => {
    render(
      <Field label="Password" hint="At least 8 characters">
        {({ inputId, describedBy, invalid }) => (
          <input
            id={inputId}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
            type="password"
          />
        )}
      </Field>
    );

    const input = screen.getByLabelText("Password");
    const describedBy = input.getAttribute("aria-describedby");
    expect(describedBy).toBeTruthy();

    const hint = screen.getByText("At least 8 characters");
    // describedBy references the hint's id.
    expect(describedBy?.split(" ")).toContain(hint.id);
    // Not invalid: no aria-invalid.
    expect(input).not.toHaveAttribute("aria-invalid");
  });

  it("sets aria-invalid and wires the error via aria-describedby when an error is present", () => {
    render(
      <Field label="Username" hint="Your handle" error="Already taken">
        {({ inputId, describedBy, invalid }) => (
          <input
            id={inputId}
            aria-describedby={describedBy}
            aria-invalid={invalid || undefined}
          />
        )}
      </Field>
    );

    const input = screen.getByLabelText("Username");
    expect(input).toHaveAttribute("aria-invalid", "true");

    // The error is announced via role="alert".
    const error = screen.getByRole("alert");
    expect(error).toHaveTextContent("Already taken");

    // aria-describedby references BOTH the hint and the error ids.
    const ids = input.getAttribute("aria-describedby")?.split(" ") ?? [];
    const hint = screen.getByText("Your handle");
    expect(ids).toContain(hint.id);
    expect(ids).toContain(error.id);
  });
});

describe("Icon accessible name (Requirement 9.6)", () => {
  it("exposes an accessible name via role=img + aria-label when labelled", () => {
    render(
      <Icon label="Warning">
        <path d="M12 2 L2 22 H22 Z" />
      </Icon>
    );

    const icon = screen.getByRole("img", { name: "Warning" });
    expect(icon).toHaveAttribute("aria-label", "Warning");
    expect(icon).not.toHaveAttribute("aria-hidden");
  });

  it("is aria-hidden and has no role when decorative (no label)", () => {
    const { container } = render(
      <Icon>
        <path d="M0 0 H24 V24 H0 Z" />
      </Icon>
    );

    const svg = container.querySelector("svg");
    expect(svg).not.toBeNull();
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
    // Not exposed to assistive tech.
    expect(screen.queryByRole("img")).toBeNull();
  });

  it("is aria-hidden when explicitly marked decorative even with a label", () => {
    const { container } = render(
      <Icon label="Chevron" decorative>
        <path d="M6 9 l6 6 6-6" />
      </Icon>
    );
    const svg = container.querySelector("svg");
    expect(svg).toHaveAttribute("aria-hidden", "true");
    expect(svg).not.toHaveAttribute("role");
  });
});
