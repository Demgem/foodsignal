import type {
  ReactNode,
  TableHTMLAttributes,
  ThHTMLAttributes,
  TdHTMLAttributes,
  HTMLAttributes,
} from "react";

/**
 * Table (Requirements 9.1, 9.3, 20.8)
 *
 * A thin set of semantic, screen-reader-friendly table primitives. They render
 * native `<table>`, `<caption>`, `<thead>`, `<tbody>`, `<tr>`, `<th>` and
 * `<td>` elements so tables carry correct semantics (Requirement 20.8) and
 * remain domain-agnostic — all cell content arrives via `children`.
 *
 * `Table.HeaderCell` defaults `scope` to "col" so header associations are
 * explicit; callers pass `scope="row"` for row headers.
 */
export interface TableProps extends TableHTMLAttributes<HTMLTableElement> {
  /**
   * Screen-reader-friendly caption describing the table. Rendered as a
   * `<caption>` element. Strongly recommended for every data table
   * (Requirement 20.8); can be visually hidden by the caller via `captionClassName`.
   */
  caption?: ReactNode;
  captionClassName?: string;
  children: ReactNode;
}

export function Table({
  caption,
  captionClassName,
  className,
  children,
  ...rest
}: TableProps) {
  return (
    <table
      className={[
        "w-full border-collapse text-body text-text-primary",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {caption != null ? (
        <caption
          className={[
            "text-caption text-text-secondary text-left mb-sm",
            captionClassName,
          ]
            .filter(Boolean)
            .join(" ")}
        >
          {caption}
        </caption>
      ) : null}
      {children}
    </table>
  );
}

export interface TableSectionProps
  extends HTMLAttributes<HTMLTableSectionElement> {
  children: ReactNode;
}

export function TableHead({ className, children, ...rest }: TableSectionProps) {
  return (
    <thead className={className} {...rest}>
      {children}
    </thead>
  );
}

export function TableBody({ className, children, ...rest }: TableSectionProps) {
  return (
    <tbody className={className} {...rest}>
      {children}
    </tbody>
  );
}

export interface TableRowProps
  extends HTMLAttributes<HTMLTableRowElement> {
  children: ReactNode;
}

export function TableRow({ className, children, ...rest }: TableRowProps) {
  return (
    <tr
      className={["border-b border-border", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </tr>
  );
}

export interface TableHeaderCellProps
  extends ThHTMLAttributes<HTMLTableCellElement> {
  /** Association scope; defaults to "col". Use "row" for row headers. */
  scope?: "col" | "row" | "colgroup" | "rowgroup";
  children: ReactNode;
}

export function TableHeaderCell({
  scope = "col",
  className,
  children,
  ...rest
}: TableHeaderCellProps) {
  return (
    <th
      scope={scope}
      className={[
        "text-label text-text-secondary text-left px-sm py-xs align-top",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
      {...rest}
    >
      {children}
    </th>
  );
}

export interface TableCellProps
  extends TdHTMLAttributes<HTMLTableCellElement> {
  children: ReactNode;
}

export function TableCell({ className, children, ...rest }: TableCellProps) {
  return (
    <td
      className={["px-sm py-xs align-top", className].filter(Boolean).join(" ")}
      {...rest}
    >
      {children}
    </td>
  );
}

// Attach sub-components for ergonomic `Table.Row` / `Table.Cell` usage while
// keeping named exports available too.
Table.Head = TableHead;
Table.Body = TableBody;
Table.Row = TableRow;
Table.HeaderCell = TableHeaderCell;
Table.Cell = TableCell;

export default Table;
