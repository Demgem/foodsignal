/**
 * Domain component barrel.
 *
 * Domain components compose the design-system primitives and understand
 * FoodSignal domain types, but read all content via props only (Requirement
 * 10.2). Pages import from here rather than reaching into individual files.
 */
export { StatusIndicator } from "./StatusIndicator";
export type { StatusIndicatorProps } from "./StatusIndicator";

export { ConfidenceIndicator, CONFIDENCE_MEANING_TEXT } from "./ConfidenceIndicator";
export type { ConfidenceIndicatorProps } from "./ConfidenceIndicator";

export { RecallBanner } from "./RecallBanner";
export type { RecallBannerProps } from "./RecallBanner";

export { AlternativeRecommendationCard, ALTERNATIVE_DISCLOSURE } from "./AlternativeRecommendationCard";
export type { AlternativeRecommendationCardProps } from "./AlternativeRecommendationCard";

export { NumericValue, MISSING_CONCENTRATION_TEXT } from "./NumericValue";
export type { NumericValueProps } from "./NumericValue";

export { ScoreDisplay, SCORE_MIN, SCORE_MAX } from "./ScoreDisplay";
export type { ScoreDisplayProps } from "./ScoreDisplay";

export { EvidenceCard } from "./EvidenceCard";
export type { EvidenceCardProps } from "./EvidenceCard";

export { SourceChip } from "./SourceChip";
export type { SourceChipProps } from "./SourceChip";

export { KnowDontKnowBlock } from "./KnowDontKnowBlock";
export type { KnowDontKnowBlockProps } from "./KnowDontKnowBlock";

export { RegulatoryComparisonTable } from "./RegulatoryComparisonTable";
export type { RegulatoryComparisonTableProps } from "./RegulatoryComparisonTable";

export { WarningPanel } from "./WarningPanel";
export type { WarningPanelProps } from "./WarningPanel";

export { IngredientExplanation } from "./IngredientExplanation";
export type { IngredientExplanationProps } from "./IngredientExplanation";

export { AssessmentHeader } from "./AssessmentHeader";
export type { AssessmentHeaderProps } from "./AssessmentHeader";
