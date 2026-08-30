/**
 * Design-system primitives barrel (Requirement 9.1).
 *
 * These primitives are domain-agnostic: they receive all content via props and
 * hold no FoodSignal domain knowledge (Requirement 9.7). Domain components and
 * pages compose from these consistent, accessible building blocks.
 */
export { Button } from "./Button";
export type { ButtonProps, ButtonVariant, ButtonSize } from "./Button";

export { Chip } from "./Chip";
export type { ChipProps, ChipBaseProps } from "./Chip";

export { Badge } from "./Badge";
export type { BadgeProps, BadgeTone } from "./Badge";

export { Card } from "./Card";
export type { CardProps, CardPadding, CardElevation } from "./Card";

export {
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableHeaderCell,
  TableCell,
} from "./Table";
export type {
  TableProps,
  TableSectionProps,
  TableRowProps,
  TableHeaderCellProps,
  TableCellProps,
} from "./Table";

export { Disclosure } from "./Disclosure";
export type { DisclosureProps } from "./Disclosure";

export { Field } from "./Field";
export type { FieldProps, FieldRenderProps } from "./Field";

export { Icon } from "./Icon";
export type { IconProps } from "./Icon";

export { VisuallyHidden } from "./VisuallyHidden";
export type { VisuallyHiddenProps } from "./VisuallyHidden";
