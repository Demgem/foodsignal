import { cleanup, render, screen, within } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { RegulatoryComparisonTable } from "./RegulatoryComparisonTable";
import type { RegulatoryRecord } from "@/lib/mock-data/types";

/**
 * Component tests for RegulatoryComparisonTable.
 *
 * Validates: Requirements 12.1, 12.2, 12.3
 *
 * - R12.1: semantic table with column-header scope="col" and row-header
 *   scope="row" associations.
 * - R12.2: a screen-reader-friendly <caption> describing the table.
 * - R12.3: a record's limit value + unit render grouped together (value and
 *   unit appear within the same numeric cell); a record without a limit value
 *   renders an em dash / no-limit state rather than an ambiguous blank cell.
 */

afterEach(() => {
  cleanup();
});

// Built inline: one record WITH a limitValue+limitUnit, one WITHOUT.
const RECORDS: RegulatoryRecord[] = [
  {
    market: "European Union",
    substanceId: "sub-001",
    status: "restricted",
    limitValue: 50,
    limitUnit: "mg/kg",
    ruleReference: "EU 1333/2008",
    sources: [],
  },
  {
    market: "United States",
    substanceId: "sub-001",
    status: "permitted",
    // No limitValue / limitUnit -> renders the no-limit state.
    sources: [],
  },
];

const CAPTION = "Regulatory status of substance sub-001 across markets";

describe("RegulatoryComparisonTable", () => {
  it("renders a <caption> with the given caption text (R12.2)", () => {
    const { container } = render(
      <RegulatoryComparisonTable records={RECORDS} caption={CAPTION} />,
    );

    const caption = container.querySelector("caption");
    expect(caption).not.toBeNull();
    expect(caption).toHaveTextContent(CAPTION);
  });

  it("gives every column header scope=\"col\" (R12.1)", () => {
    render(<RegulatoryComparisonTable records={RECORDS} caption={CAPTION} />);

    const columnHeaders = screen.getAllByRole("columnheader");
    expect(columnHeaders.length).toBeGreaterThan(0);
    for (const header of columnHeaders) {
      expect(header).toHaveAttribute("scope", "col");
    }

    // The expected column headers are present.
    for (const label of ["Market", "Status", "Limit", "Rule reference"]) {
      expect(
        columnHeaders.some((h) => h.textContent?.trim() === label),
      ).toBe(true);
    }
  });

  it("renders each market as a row header with scope=\"row\" (R12.1)", () => {
    render(<RegulatoryComparisonTable records={RECORDS} caption={CAPTION} />);

    const rowHeaders = screen.getAllByRole("rowheader");
    expect(rowHeaders).toHaveLength(RECORDS.length);
    for (const header of rowHeaders) {
      expect(header).toHaveAttribute("scope", "row");
    }

    expect(
      rowHeaders.some((h) => h.textContent?.trim() === "European Union"),
    ).toBe(true);
    expect(
      rowHeaders.some((h) => h.textContent?.trim() === "United States"),
    ).toBe(true);
  });

  it("renders a limit value and its unit grouped together in the numeric cell (R12.3)", () => {
    render(<RegulatoryComparisonTable records={RECORDS} caption={CAPTION} />);

    // Locate the EU row via its row header, then inspect that row's cells.
    const euRowHeader = screen
      .getAllByRole("rowheader")
      .find((h) => h.textContent?.trim() === "European Union");
    expect(euRowHeader).toBeDefined();

    const euRow = euRowHeader!.closest("tr");
    expect(euRow).not.toBeNull();

    // The grouped numeric value+unit lives inside a single non-wrapping group.
    const numericGroup = euRow!.querySelector('[data-numeric="true"]');
    expect(numericGroup).not.toBeNull();

    // Both the value and its unit appear together within the same group.
    expect(numericGroup).toHaveTextContent("50");
    const unit = numericGroup!.querySelector('[data-unit="true"]');
    expect(unit).not.toBeNull();
    expect(unit).toHaveTextContent("mg/kg");

    // Sanity: value and unit are within one cell (the numeric group's cell).
    const cell = numericGroup!.closest("td");
    expect(cell).not.toBeNull();
    expect(within(cell as HTMLElement).getByText("50")).toBeInTheDocument();
    expect(
      within(cell as HTMLElement).getByText("mg/kg"),
    ).toBeInTheDocument();
  });

  it("renders an em dash / no-limit state for a record without a limit value (R12.3)", () => {
    render(<RegulatoryComparisonTable records={RECORDS} caption={CAPTION} />);

    const usRowHeader = screen
      .getAllByRole("rowheader")
      .find((h) => h.textContent?.trim() === "United States");
    expect(usRowHeader).toBeDefined();

    const usRow = usRowHeader!.closest("tr");
    expect(usRow).not.toBeNull();

    // No grouped numeric value in this row's limit cell.
    expect(usRow!.querySelector('[data-numeric="true"]')).toBeNull();

    // The no-limit state renders an em dash with an accessible label.
    const noLimit = usRow!.querySelector('[data-no-limit="true"]');
    expect(noLimit).not.toBeNull();
    expect(noLimit).toHaveTextContent("\u2014");
    expect(noLimit).toHaveAttribute("aria-label", "No limit specified");
  });
});
