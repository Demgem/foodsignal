/**
 * FoodSignal — typed mock-data fixtures.
 *
 * A small but realistic catalog instantiating the domain types from
 * `./types`. All content is authored mock data: no computation, no network,
 * no persistence (R23.4, R24.x). Selectors (task 3.3) read from these
 * fixtures only.
 *
 * Content follows the design's Content & Language Guidelines: plain-language
 * first, evidence-first, calm and non-alarmist. Prohibited phrasings
 * ("toxic food", unqualified "causes cancer", "100% safe", "detox",
 * "chemical-free") are avoided in favor of factual statements.
 *
 * Required fixtures guaranteed to exist (R23.2):
 *  - one product with an ACTIVE recall           -> `orchard-crunch-granola`
 *  - one product whose allergen MATCHES the mock  -> `hazelnut-cocoa-spread`
 *    UserProfile's allergies
 *  - one product with an ALTERNATIVE recommendation -> `hazelnut-cocoa-spread`
 *
 * Requirements: 23.2, 23.4
 */

import type {
  Additive,
  AssessmentResult,
  Ingredient,
  Product,
  Recall,
  RegulatoryRecord,
  Source,
  UserProfile,
} from './types';

// ---------------------------------------------------------------------------
// Sources — several, spanning all source types
// ---------------------------------------------------------------------------

export const sources = {
  euRegulator: {
    id: 'src-eu-food-authority',
    name: 'EU Food Safety Authority — additive re-evaluation',
    type: 'regulator',
    url: 'https://example.org/regulator/eu/additives',
    publishedDate: '2023-06-15',
  },
  usRegulator: {
    id: 'src-us-food-agency',
    name: 'US Food Agency — food additive status list',
    type: 'regulator',
    url: 'https://example.org/regulator/us/additives',
    publishedDate: '2022-11-02',
  },
  recallRegistry: {
    id: 'src-recall-registry',
    name: 'National Food Recall Registry',
    type: 'regulator',
    url: 'https://example.org/regulator/recalls',
    publishedDate: '2024-05-20',
  },
  scientificReview: {
    id: 'src-systematic-review-2022',
    name: 'Systematic review of dietary exposure (2022)',
    type: 'scientific',
    url: 'https://example.org/science/review-2022',
    publishedDate: '2022-03-10',
  },
  scientificMeta: {
    id: 'src-meta-analysis-2021',
    name: 'Meta-analysis of intake and outcomes (2021)',
    type: 'scientific',
    url: 'https://example.org/science/meta-2021',
    publishedDate: '2021-09-01',
  },
  manufacturerLabel: {
    id: 'src-manufacturer-label',
    name: 'Manufacturer product label and specification',
    type: 'manufacturer',
    url: 'https://example.org/manufacturer/label',
    publishedDate: '2024-01-12',
  },
  ingredientDatabase: {
    id: 'src-open-ingredient-db',
    name: 'Open Ingredient Database',
    type: 'database',
    url: 'https://example.org/database/ingredients',
    publishedDate: '2024-02-28',
  },
  additiveDatabase: {
    id: 'src-additive-db',
    name: 'Additive Reference Database',
    type: 'database',
    url: 'https://example.org/database/additives',
    publishedDate: '2023-12-05',
  },
  editorialNote: {
    id: 'src-editorial-note',
    name: 'FoodSignal editorial methodology note',
    type: 'other',
    url: 'https://example.org/foodsignal/methodology',
    publishedDate: '2024-04-01',
  },
} satisfies Record<string, Source>;

/** All sources as a flat array for the source catalog / transparency page. */
export const allSources: Source[] = Object.values(sources);

// ---------------------------------------------------------------------------
// Regulatory records — reused by ingredients / additives, span markets/status
// ---------------------------------------------------------------------------

const regAscorbicAcidEU: RegulatoryRecord = {
  market: 'EU',
  substanceId: 'E300',
  status: 'permitted',
  ruleReference: 'Additive permitted under the applicable EU rule for this market',
  sources: [sources.euRegulator, sources.additiveDatabase],
};

const regAscorbicAcidUS: RegulatoryRecord = {
  market: 'US',
  substanceId: 'ascorbic-acid',
  status: 'permitted',
  ruleReference: 'Listed as generally permitted for use in the US market',
  sources: [sources.usRegulator],
};

const regColorEU: RegulatoryRecord = {
  market: 'EU',
  substanceId: 'E110',
  status: 'restricted',
  limitValue: 10,
  limitUnit: 'mg/kg',
  ruleReference: 'Permitted with a use-level limit under the applicable EU rule',
  sources: [sources.euRegulator, sources.scientificReview],
};

const regColorUS: RegulatoryRecord = {
  market: 'US',
  substanceId: 'fd-c-yellow-6',
  status: 'permitted',
  ruleReference: 'Permitted for use in the US market subject to labeling',
  sources: [sources.usRegulator],
};

const regSweetenerEU: RegulatoryRecord = {
  market: 'EU',
  substanceId: 'E951',
  status: 'permitted',
  limitValue: 600,
  limitUnit: 'mg/kg',
  ruleReference: 'Permitted with an acceptable daily intake defined for this market',
  sources: [sources.euRegulator, sources.scientificMeta],
};

// ---------------------------------------------------------------------------
// Ingredients — several, with regulatory + sources
// ---------------------------------------------------------------------------

export const ingredients = {
  wholeGrainOats: {
    slug: 'whole-grain-oats',
    name: 'Whole grain oats',
    aliases: ['oats', 'Avena sativa'],
    explanation:
      'Whole grain oats are a cereal grain used as a base in many breakfast products. They contribute dietary fibre and are commonly included for texture and satiety.',
    sources: [sources.ingredientDatabase, sources.manufacturerLabel],
  },
  cocoaSolids: {
    slug: 'cocoa-solids',
    name: 'Cocoa solids',
    aliases: ['cocoa mass', 'cocoa'],
    explanation:
      'Cocoa solids are derived from cocoa beans and give chocolate products their flavour and colour. Amounts vary by product formulation.',
    sources: [sources.ingredientDatabase],
  },
  hazelnut: {
    slug: 'hazelnut',
    name: 'Hazelnut',
    aliases: ['Corylus avellana', 'filbert'],
    explanation:
      'Hazelnut is a tree nut used for flavour and texture. It is a declarable allergen in many markets; people with a tree-nut allergy typically avoid it.',
    sources: [sources.ingredientDatabase, sources.manufacturerLabel],
  },
  ascorbicAcid: {
    slug: 'ascorbic-acid',
    name: 'Ascorbic acid',
    aliases: ['vitamin C', 'E300'],
    explanation:
      'Ascorbic acid is commonly added as an antioxidant to help preserve colour and freshness. It is the same compound as vitamin C.',
    regulatory: [regAscorbicAcidEU, regAscorbicAcidUS],
    sources: [sources.additiveDatabase, sources.euRegulator],
  },
  palmOil: {
    slug: 'palm-oil',
    name: 'Palm oil',
    aliases: ['Elaeis guineensis oil'],
    explanation:
      'Palm oil is a widely used vegetable fat that provides texture and shelf stability. Sourcing practices vary between manufacturers.',
    sources: [sources.ingredientDatabase, sources.manufacturerLabel],
  },
  caneSugar: {
    slug: 'cane-sugar',
    name: 'Cane sugar',
    aliases: ['sucrose', 'sugar'],
    explanation:
      'Cane sugar is a common sweetener. Higher intake of added sugars is associated with dietary considerations discussed by public-health sources.',
    sources: [sources.ingredientDatabase, sources.scientificReview],
  },
  skimmedMilkPowder: {
    slug: 'skimmed-milk-powder',
    name: 'Skimmed milk powder',
    aliases: ['non-fat dry milk'],
    explanation:
      'Skimmed milk powder is dried milk with most of the fat removed. It contains milk, a declarable allergen in many markets.',
    sources: [sources.ingredientDatabase, sources.manufacturerLabel],
  },
} satisfies Record<string, Ingredient>;

// ---------------------------------------------------------------------------
// Additives — several, with regulatory + sources
// ---------------------------------------------------------------------------

export const additives = {
  ascorbicAcid: {
    slug: 'ascorbic-acid-additive',
    code: 'E300',
    name: 'Ascorbic acid (antioxidant)',
    purpose: 'Antioxidant used to help preserve colour and freshness.',
    explanation:
      'Used as an antioxidant, ascorbic acid is permitted under the applicable rules identified for the markets checked. It is the same compound as vitamin C.',
    regulatory: [regAscorbicAcidEU, regAscorbicAcidUS],
    sources: [sources.additiveDatabase, sources.euRegulator, sources.usRegulator],
  },
  sunsetYellow: {
    slug: 'sunset-yellow',
    code: 'E110',
    name: 'Sunset Yellow FCF (colour)',
    purpose: 'Colouring used to provide an orange-yellow hue.',
    explanation:
      'A colouring permitted with a use-level limit under the applicable EU rule, and permitted subject to labeling in the US market. The available product-level concentration was not provided.',
    regulatory: [regColorEU, regColorUS],
    sources: [sources.euRegulator, sources.usRegulator, sources.scientificReview],
  },
  aspartame: {
    slug: 'aspartame',
    code: 'E951',
    name: 'Aspartame (sweetener)',
    purpose: 'Low-calorie sweetener.',
    explanation:
      'A sweetener permitted with an acceptable daily intake defined for the markets checked. Higher exposure relative to the acceptable daily intake is discussed by the cited sources.',
    regulatory: [regSweetenerEU],
    sources: [sources.euRegulator, sources.scientificMeta],
  },
  lecithin: {
    slug: 'soy-lecithin',
    code: 'E322',
    name: 'Lecithin (emulsifier)',
    purpose: 'Emulsifier that helps blend fat and water phases.',
    explanation:
      'Lecithin is an emulsifier permitted under the applicable rules identified for the markets checked. When derived from soy it may be relevant to people avoiding soy.',
    sources: [sources.additiveDatabase, sources.manufacturerLabel],
  },
} satisfies Record<string, Additive>;

// ---------------------------------------------------------------------------
// Recalls — several, including at least one ACTIVE
// ---------------------------------------------------------------------------

export const recalls = {
  granolaActive: {
    slug: 'orchard-crunch-granola-2024',
    productName: 'Orchard Crunch Granola',
    market: 'EU',
    reason:
      'Precautionary recall due to possible presence of small plastic fragments reported to the recall registry.',
    active: true,
    date: '2024-05-18',
    sources: [sources.recallRegistry, sources.manufacturerLabel],
  },
  spreadResolved: {
    slug: 'hazelnut-cocoa-spread-2022',
    productName: 'Hazelnut Cocoa Spread',
    market: 'EU',
    reason:
      'Earlier recall relating to a labeling correction. The recall has since been closed in the sources checked.',
    active: false,
    date: '2022-08-09',
    sources: [sources.recallRegistry],
  },
  colaResolved: {
    slug: 'clear-fizz-cola-2021',
    productName: 'Clear Fizz Cola',
    market: 'US',
    reason:
      'Resolved recall relating to a packaging seal issue. No active recall found in the sources checked at this time.',
    active: false,
    date: '2021-04-22',
    sources: [sources.recallRegistry],
  },
} satisfies Record<string, Recall>;

/** All recalls as a flat array for the recall listing page. */
export const allRecalls: Recall[] = Object.values(recalls);

// ---------------------------------------------------------------------------
// Assessments — authored mock data (R24.8), one per product
// ---------------------------------------------------------------------------

const assessmentGranola: AssessmentResult = {
  product_id: 'orchard-crunch-granola',
  market: 'EU',
  status: 'avoid',
  score: 34,
  confidence: 'high',
  reasons: [
    'An active recall is currently listed for this product in the recall registry.',
    'Until the recall is resolved, avoiding this product is the cautious option.',
  ],
  data_freshness: '2024-05-20T09:00:00Z',
  sources: [sources.recallRegistry, sources.manufacturerLabel],
};

const assessmentSpread: AssessmentResult = {
  product_id: 'hazelnut-cocoa-spread',
  market: 'EU',
  status: 'caution',
  score: 58,
  confidence: 'moderate',
  reasons: [
    'Declares hazelnut and milk, which are relevant to people with tree-nut or milk allergies.',
    'Contains added sugar and palm oil; intake considerations are described by the cited sources.',
  ],
  data_freshness: '2024-04-30T12:00:00Z',
  sources: [sources.manufacturerLabel, sources.scientificReview],
};

const assessmentPorridge: AssessmentResult = {
  product_id: 'morning-oat-porridge',
  market: 'EU',
  status: 'safe',
  score: 86,
  confidence: 'high',
  reasons: [
    'Simple whole-grain formulation with no additives of concern in the sources checked.',
    'No active recall found in the sources checked.',
  ],
  data_freshness: '2024-05-01T08:00:00Z',
  sources: [sources.manufacturerLabel, sources.ingredientDatabase],
};

const assessmentCola: AssessmentResult = {
  product_id: 'clear-fizz-cola',
  market: 'US',
  status: 'caution',
  score: 61,
  confidence: 'moderate',
  reasons: [
    'Contains a permitted sweetener and a permitted colour; use levels were not provided at the product level.',
    'No active recall found in the sources checked.',
  ],
  data_freshness: '2024-03-15T10:30:00Z',
  sources: [sources.usRegulator, sources.scientificMeta],
};

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------

/**
 * Alternative recommendation target for the hazelnut spread. Defined without
 * its own `alternatives` to keep the object graph acyclic and JSON-serialisable.
 */
const morningOatPorridge: Product = {
  slug: 'morning-oat-porridge',
  name: 'Morning Oat Porridge',
  brand: 'Field & Grain',
  barcode: '5010000000031',
  imageUrl: '/mock/products/morning-oat-porridge.png',
  market: 'EU',
  ingredients: [ingredients.wholeGrainOats],
  additives: [],
  nutrition: [
    { label: 'Energy', value: 375, unit: 'kcal', per: 'per 100 g' },
    { label: 'Fat', value: 7, unit: 'g', per: 'per 100 g' },
    { label: 'Carbohydrate', value: 60, unit: 'g', per: 'per 100 g' },
    { label: 'Sugars', value: 1, unit: 'g', per: 'per 100 g' },
    { label: 'Fibre', value: 10, unit: 'g', per: 'per 100 g' },
    { label: 'Protein', value: 13, unit: 'g', per: 'per 100 g' },
    { label: 'Salt', value: 0.01, unit: 'g', per: 'per 100 g' },
  ],
  allergens: [
    { name: 'Oats (gluten)', declared: true },
    { name: 'Hazelnut', declared: false },
    { name: 'Milk', declared: false },
  ],
  recalls: [],
  assessment: assessmentPorridge,
  known: [
    'Ingredients and nutrition are taken from the manufacturer label.',
    'No additives are declared for this product.',
    'No active recall found in the sources checked.',
  ],
  unknown: [
    'Sourcing details for the oats were not provided.',
    'Batch-level testing data was not available in the sources checked.',
  ],
  sources: [sources.manufacturerLabel, sources.ingredientDatabase],
};

/** Product with an ACTIVE recall. */
const orchardCrunchGranola: Product = {
  slug: 'orchard-crunch-granola',
  name: 'Orchard Crunch Granola',
  brand: 'Sunny Field',
  barcode: '5010000000017',
  imageUrl: '/mock/products/orchard-crunch-granola.png',
  market: 'EU',
  ingredients: [
    ingredients.wholeGrainOats,
    ingredients.caneSugar,
    ingredients.palmOil,
    ingredients.ascorbicAcid,
  ],
  additives: [additives.ascorbicAcid],
  nutrition: [
    { label: 'Energy', value: 452, unit: 'kcal', per: 'per 100 g' },
    { label: 'Fat', value: 16, unit: 'g', per: 'per 100 g' },
    { label: 'Saturates', value: 6, unit: 'g', per: 'per 100 g' },
    { label: 'Carbohydrate', value: 64, unit: 'g', per: 'per 100 g' },
    { label: 'Sugars', value: 22, unit: 'g', per: 'per 100 g' },
    { label: 'Fibre', value: 6, unit: 'g', per: 'per 100 g' },
    { label: 'Protein', value: 8, unit: 'g', per: 'per 100 g' },
    { label: 'Salt', value: 0.2, unit: 'g', per: 'per 100 g' },
  ],
  allergens: [
    { name: 'Oats (gluten)', declared: true },
    { name: 'Hazelnut', declared: false },
  ],
  recalls: [recalls.granolaActive],
  assessment: assessmentGranola,
  known: [
    'An active recall is currently listed for this product in the recall registry.',
    'Ingredients and nutrition are taken from the manufacturer label.',
    'Ascorbic acid is used as an antioxidant and is permitted under the applicable EU rule.',
  ],
  unknown: [
    'The scope of the affected batches was not fully detailed in the sources checked.',
    'The available product-level concentration for the antioxidant was not provided.',
  ],
  alternatives: [morningOatPorridge],
  sources: [sources.recallRegistry, sources.manufacturerLabel, sources.additiveDatabase],
};

/**
 * Product whose allergen MATCHES the mock UserProfile (Hazelnut), and which
 * carries an ALTERNATIVE recommendation.
 */
const hazelnutCocoaSpread: Product = {
  slug: 'hazelnut-cocoa-spread',
  name: 'Hazelnut Cocoa Spread',
  brand: 'Nutmark',
  barcode: '5010000000024',
  imageUrl: '/mock/products/hazelnut-cocoa-spread.png',
  market: 'EU',
  ingredients: [
    ingredients.caneSugar,
    ingredients.palmOil,
    ingredients.hazelnut,
    ingredients.cocoaSolids,
    ingredients.skimmedMilkPowder,
  ],
  additives: [additives.lecithin],
  nutrition: [
    { label: 'Energy', value: 539, unit: 'kcal', per: 'per 100 g' },
    { label: 'Fat', value: 31, unit: 'g', per: 'per 100 g' },
    { label: 'Saturates', value: 11, unit: 'g', per: 'per 100 g' },
    { label: 'Carbohydrate', value: 57, unit: 'g', per: 'per 100 g' },
    { label: 'Sugars', value: 56, unit: 'g', per: 'per 100 g' },
    { label: 'Protein', value: 6, unit: 'g', per: 'per 100 g' },
    { label: 'Salt', value: 0.1, unit: 'g', per: 'per 100 g' },
  ],
  allergens: [
    { name: 'Hazelnut', declared: true },
    { name: 'Milk', declared: true },
    { name: 'Soy', declared: true },
  ],
  recalls: [recalls.spreadResolved],
  assessment: assessmentSpread,
  known: [
    'Declares hazelnut, milk and soy on the manufacturer label.',
    'A previous recall relating to a labeling correction has since been closed in the sources checked.',
    'Contains added sugar and palm oil.',
  ],
  unknown: [
    'The proportion of cocoa solids was not provided at the product level.',
    'The origin of the palm oil was not detailed in the sources checked.',
  ],
  alternatives: [morningOatPorridge],
  sources: [sources.manufacturerLabel, sources.ingredientDatabase, sources.scientificReview],
};

/** Additional product for a richer catalog and a second market (US). */
const clearFizzCola: Product = {
  slug: 'clear-fizz-cola',
  name: 'Clear Fizz Cola',
  brand: 'Brightwave',
  barcode: '0120000000015',
  imageUrl: '/mock/products/clear-fizz-cola.png',
  market: 'US',
  ingredients: [ingredients.caneSugar],
  additives: [additives.aspartame, additives.sunsetYellow],
  nutrition: [
    { label: 'Energy', value: 42, unit: 'kcal', per: 'per 100 ml' },
    { label: 'Carbohydrate', value: 10.6, unit: 'g', per: 'per 100 ml' },
    { label: 'Sugars', value: 10.6, unit: 'g', per: 'per 100 ml' },
    { label: 'Salt', value: 0.02, unit: 'g', per: 'per 100 ml' },
  ],
  allergens: [],
  recalls: [recalls.colaResolved],
  assessment: assessmentCola,
  known: [
    'Contains a permitted sweetener and a permitted colour in the US market.',
    'No active recall found in the sources checked.',
  ],
  unknown: [
    'The available product-level concentration for the colour was not provided.',
    'Serving-level intake relative to the acceptable daily intake was not provided.',
  ],
  sources: [sources.usRegulator, sources.scientificMeta, sources.manufacturerLabel],
};

/** All products, keyed by slug for convenient lookup by selectors. */
export const products = {
  [orchardCrunchGranola.slug]: orchardCrunchGranola,
  [hazelnutCocoaSpread.slug]: hazelnutCocoaSpread,
  [morningOatPorridge.slug]: morningOatPorridge,
  [clearFizzCola.slug]: clearFizzCola,
} satisfies Record<string, Product>;

/** All products as a flat array for listing / search pages. */
export const allProducts: Product[] = Object.values(products);

// ---------------------------------------------------------------------------
// Mock UserProfile — allergies MATCH the hazelnut spread's declared allergen
// ---------------------------------------------------------------------------

export const mockProfile: UserProfile = {
  displayName: 'Sample User',
  // 'Hazelnut' is declared on `hazelnut-cocoa-spread`, guaranteeing a match.
  allergies: ['Hazelnut', 'Milk'],
  dietPreferences: ['lower-sugar'],
  locale: {
    interfaceLanguage: 'en',
    market: 'EU',
    units: 'metric',
  },
};

// ---------------------------------------------------------------------------
// Named references to the three REQUIRED fixtures (R23.2) — convenience exports
// ---------------------------------------------------------------------------

/** Product guaranteed to have an active recall. */
export const productWithActiveRecall: Product = orchardCrunchGranola;

/** Product guaranteed to declare an allergen matching `mockProfile.allergies`. */
export const productWithAllergenMatch: Product = hazelnutCocoaSpread;

/** Product guaranteed to carry a non-empty `alternatives` array. */
export const productWithAlternative: Product = hazelnutCocoaSpread;
