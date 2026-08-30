import type { RegulatoryRecord } from "@/lib/mock-data/types";
import {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "@/components/primitives";
import { NumericValue } from "@/components/domain/NumericValue";

/**
 * RegulatoryComparisonTable (Requirements 12.1, 12.2, 12.3, 10.1, 10.2, 20.8)
 *
 * Compares a substance's regulatory status across markets as a semantic,
 * screen-reader-friendly data table.
 *
 * Design invariants (see design.md — "RegulatoryComparisonTable",
 * "Accessibility → Screen-reader-friendly tables", "Typography"):
 *
 * - **Semantic table with header scope associations (R12.1, 20.8):** built on
 *   the `Table` primitive, which renders native `<table>`/`<thead>`/`<tbody>`
 *   markup. Column headers use `scope="col"`; each row's leading market cell is
 *   a `<th scope="row">` so assistive tech can associate every data cell with
 *   both its market (row) and its column header.
 * - **Screen-reader-friendly caption (R12.2, 20.8):** the required `caption`
 *   prop is rendered as a `<caption>` element describing the table.
 * - **Value + unit rendered unambiguously together (R12.3, 20.8):** when a
 *   record carries a `limitValue`, the value and its `limitUnit` are rendered
 *   through `NumericValue`, which groups them in a single non-wrapping,
 *   tabular-figure group so the unit is never orphaned. Records without a limit
 *   value render an em dash with an accessible "no limit specified" label
 *   rather than an ambiguous blank cell.
 *
 * Data model (R10.1, R10.2): all content arrives via props from the route/page
 * layer. The component performs no fetching, filtering, or computation — it
 * renders the `RegulatoryRecord[]` it is given (the prototype performs no real
 * regulatory computation; see design.md "Non-Goals").
 */

/** Human-readable labels for each regulatory status value. */
const STATUS_LABELS: Record<RegulatoryRecord["status"], string> = {
  permitted: "Permitted",
  restricted: "Restricted",
  prohibited: "Prohibited",
  not_evaluated: "Not evaluated",
};

export interface RegulatoryComparisonTableProps {
  /** The regulatory records to compare, one row per market. */
  records: RegulatoryRecord[];
  /** Screen-reader-friendly caption describing the table (Requirement 12.2). */
  caption: string;
  /** Presentational className passthrough for layout composition. */
  className?: string;
}

export function RegulatoryComparisonTable({
  records,
  caption,
  className,
}: RegulatoryComparisonTableProps) {
  return (
    <Table caption={caption} className={className}>
      <TableHead>
        <TableRow>
          {/* R12.1 / 20.8: explicit column-header scope associations. */}
          <TableHeaderCell scope="col">Market</TableHeaderCell>
          <TableHeaderCell scope="col">Status</TableHeaderCell>
          <TableHeaderCell scope="col">Limit</TableHeaderCell>
          <TableHeaderCell scope="col">Rule reference</TableHeaderCell>
        </TableRow>
      </TableHead>
      <TableBody>
        {records.map((record, index) => {
          const hasLimit =
            record.limitValue !== null && record.limitValue !== undefined;

          return (
            <TableRow key={`${record.market}-${record.substanceId}-${index}`}>
              {/* Row header: associates every data cell in this row with its
                  market for screen-reader users (R12.1, 20.8). */}
              <TableHeaderCell scope="row">{record.market}</TableHeaderCell>

              <TableCell>{STATUS_LABELS[record.status]}</TableCell>

              <TableCell>
                {hasLimit ? (
                  // R12.3: value + unit grouped unambiguously (tabular figures,
                  // unit never orphaned) via NumericValue.
                  <NumericValue
                    value={record.limitValue}
                    unit={record.limitUnit}
                  />
                ) : (
                  // No limit specified: an em dash with an accessible label so
                  // the empty state is unambiguous rather than a blank cell.
                  <span
                    className="text-text-secondary"
                    aria-label="No limit specified"
                    data-no-limit="true"
                  >
                    {"\u2014"}
                  </span>
                )}
              </TableCell>

              <TableCell>
                {record.ruleReference ? (
                  record.ruleReference
                ) : (
                  <span
                    className="text-text-secondary"
                    aria-label="No rule reference provided"
                    data-no-rule="true"
                  >
                    {"\u2014"}
                  </span>
                )}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export default RegulatoryComparisonTable;
