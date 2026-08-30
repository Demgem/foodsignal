/**
 * FoodSignal — TypeScript domain types for the mock-data layer.
 *
 * These interfaces define the shapes for all mock content. Fixtures (task 3.2)
 * instantiate them and selectors (task 3.3) read from those fixtures only —
 * no network, no persistence, no I/O.
 *
 * Field shapes match the design document's "Data Models (Mock Entities)",
 * "Status & Confidence Semantics", and "SEO (Design-Level)" sections exactly.
 *
 * Requirements: 23.1
 */

// ---------------------------------------------------------------------------
// Status & Confidence Semantics
// ---------------------------------------------------------------------------

/** Assessment status axis: Safe / Caution / Avoid. */
export type AssessmentStatus = 'safe' | 'caution' | 'avoid';

/** Confidence axis: evidence quality, not danger. */
export type ConfidenceLevel =
  | 'very_high'
  | 'high'
  | 'moderate'
  | 'low'
  | 'insufficient';

// ---------------------------------------------------------------------------
// Data Models (Mock Entities)
// ---------------------------------------------------------------------------

export interface Source {
  id: string;
  name: string;
  type: 'regulator' | 'scientific' | 'manufacturer' | 'database' | 'other';
  url?: string;
  publishedDate?: string; // ISO date
}

export interface RegulatoryRecord {
  market: string; // regulatory market identifier
  substanceId: string;
  status: 'permitted' | 'restricted' | 'prohibited' | 'not_evaluated';
  limitValue?: number;
  limitUnit?: string; // unit must render unambiguously
  ruleReference?: string;
  sources: Source[];
}

export interface Ingredient {
  slug: string;
  name: string;
  aliases?: string[];
  explanation: string; // plain-language first
  regulatory?: RegulatoryRecord[];
  sources: Source[];
}

export interface Additive {
  slug: string;
  code?: string; // e.g. E-number style identifier
  name: string;
  purpose?: string;
  explanation: string;
  regulatory?: RegulatoryRecord[];
  sources: Source[];
}

export interface Allergen {
  name: string;
  declared: boolean;
}

export interface NutritionFact {
  label: string;
  value: number;
  unit: string; // unambiguous unit
  per?: string; // e.g. "per 100g"
}

export interface Recall {
  slug: string;
  productName: string;
  market: string;
  reason: string;
  active: boolean;
  date: string; // ISO date
  sources: Source[];
}

export interface AssessmentResult {
  product_id: string;
  market: string;
  status: AssessmentStatus;
  score: number; // 0..100
  confidence: ConfidenceLevel;
  reasons: string[];
  data_freshness: string; // ISO date/time of last update
  sources: Source[];
}

export interface Product {
  slug: string;
  name: string;
  brand: string;
  barcode?: string;
  imageUrl?: string;
  market: string;
  ingredients: Ingredient[];
  additives: Additive[];
  nutrition: NutritionFact[];
  allergens: Allergen[];
  recalls: Recall[];
  assessment: AssessmentResult;
  known: string[]; // "what we know"
  unknown: string[]; // "what we don't know"
  alternatives?: Product[];
  sources: Source[];
}

export interface UserProfile {
  // Mock only; no auth, no persistence.
  displayName: string;
  allergies: string[];
  dietPreferences: string[];
  locale: LocalePreferences;
}

// ---------------------------------------------------------------------------
// Internationalization (Design-Level Only)
// ---------------------------------------------------------------------------

export interface LocalePreferences {
  interfaceLanguage: string; // e.g. "en"
  market: string; // regulatory market, independent of language
  units: 'metric' | 'imperial';
}

// ---------------------------------------------------------------------------
// Assessment JSON Response Shape (Type Reference)
//
// The prototype models the eventual assessment response shape via
// AssessmentResult:
// { product_id, market, status, score, confidence, reasons[],
//   data_freshness, sources[] }
// ---------------------------------------------------------------------------

export type AssessmentResponse = AssessmentResult;

// ---------------------------------------------------------------------------
// SEO (Design-Level)
// ---------------------------------------------------------------------------

export interface StructuredDataStub {
  type: 'Product' | 'Brand' | 'FAQPage';
  data: Record<string, unknown>; // placeholder shape
}

export interface PageMetadata {
  title: string;
  description: string; // factual snippet style
  structuredData?: StructuredDataStub[]; // Product | Brand | FAQPage
  canonical?: string;
  hreflangNote?: string; // noted, not fully implemented
}
