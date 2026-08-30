/**
 * FoodSignal mock-data layer barrel.
 *
 * The mock-data layer is the ONLY source of content in the prototype: typed
 * static fixtures plus synchronous selector helpers, with no network,
 * persistence, or I/O (R23.4, R24.2, R24.3). Route/page code should import from
 * here rather than reaching into individual files.
 *
 * Requirements: 23.1, 23.2, 23.3, 23.4, 23.5
 */

// Domain types (R23.1).
export type {
  AssessmentStatus,
  ConfidenceLevel,
  Source,
  RegulatoryRecord,
  Ingredient,
  Additive,
  Allergen,
  NutritionFact,
  Recall,
  AssessmentResult,
  AssessmentResponse,
  Product,
  UserProfile,
  LocalePreferences,
  StructuredDataStub,
  PageMetadata,
} from './types';

// Typed fixtures (R23.2). Individual catalogs plus the required-fixture refs.
export {
  sources,
  allSources,
  ingredients,
  additives,
  recalls,
  allRecalls,
  products,
  allProducts,
  mockProfile,
  productWithActiveRecall,
  productWithAllergenMatch,
  productWithAlternative,
} from './fixtures';

// Synchronous selectors (R23.3, R23.5).
export {
  getProductBySlug,
  getIngredientBySlug,
  getAdditiveBySlug,
  getRecallBySlug,
  listRecalls,
  listActiveRecalls,
  listProducts,
  listSources,
  getMockProfile,
} from './selectors';
