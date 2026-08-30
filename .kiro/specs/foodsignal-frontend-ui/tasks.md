# Implementation Plan: FoodSignal Frontend UI + Design System Prototype

## Overview

This plan builds the FoodSignal frontend prototype incrementally on a fixed stack: **Next.js (App Router) + React + TypeScript + Tailwind CSS**, with **Vitest + Testing Library + fast-check + jest-axe** for testing. Each step builds on the previous one and ends by wiring pieces into the running app, so no code is left orphaned. Work proceeds bottom-up: scaffolding and tokens first, then the typed mock-data layer, then design-system primitives, then domain components (with their invariants and property-based tests), then the app shell and routing, then the 17-section product page, then the remaining pages, then cross-cutting content/accessibility/i18n/SEO passes, and finally the integration test suite.

The prototype renders mock data only and performs no computation, network I/O, persistence, auth, OCR/AI, billing, or crowdfunding (R24). Test sub-tasks marked with `*` are optional and can be skipped for a faster MVP; core implementation tasks are always required.

## Tasks

- [x] 1. Scaffold the Next.js App Router project and test tooling
  - Initialize a Next.js App Router + TypeScript project with Tailwind CSS configured
  - Add the base `app/` directory with a minimal root layout and a placeholder homepage so the app builds and runs
  - Configure Vitest + React Testing Library + jest-dom, fast-check, and jest-axe; add a test script and a single smoke test that renders the placeholder homepage
  - Establish the source folder structure: `lib/tokens`, `lib/mock-data`, `components/primitives`, `components/domain`, `app/` routes
  - _Requirements: 2.2, 24.2, 24.3, 24.4_

- [x] 2. Establish the design-token system and Tailwind theme
  - [x] 2.1 Define the design-token contract and values
    - Create the typed `DesignTokens` shape (color, typography, space, radius, shadow, motion, breakpoints) with concrete values, including distinct Safe/Caution/Avoid status color families, a neutral confidence family distinct from status, brand/interactive colors, and focus-ring tokens
    - Expose tokens as CSS variables and wire them into Tailwind theme configuration
    - Add the typographic scale roles (Display, H1, H2, H3, Body, Label, Caption) and a `tabular-nums` numeric style
    - Define motion duration tokens that resolve to no motion under `prefers-reduced-motion`
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6, 5.1_

  - [x]* 2.2 Write tests for token exposure and reduced-motion resolution
    - Assert status families are distinct from the confidence family and that focus-ring and reduced-motion tokens are present/resolvable
    - _Requirements: 4.3, 4.4, 4.5, 4.6_

- [x] 3. Build the typed mock-data layer, fixtures, and selectors
  - [x] 3.1 Define TypeScript domain types
    - Declare `Source`, `RegulatoryRecord`, `Ingredient`, `Additive`, `Allergen`, `NutritionFact`, `Recall`, `AssessmentResult`, `Product`, `UserProfile`, `LocalePreferences`, plus `AssessmentStatus`, `ConfidenceLevel`, `PageMetadata`, and `StructuredDataStub`
    - _Requirements: 23.1_

  - [x] 3.2 Author typed fixtures
    - Create a realistic catalog: multiple products, ingredients, additives, recalls, sources, and one mock `UserProfile`
    - Guarantee the required fixtures exist: at least one product with an **active recall**, one product whose allergen **matches** the mock `UserProfile`, and one product with an **alternative recommendation**
    - _Requirements: 23.2, 23.4_

  - [x] 3.3 Implement synchronous selector helpers
    - Implement `getProductBySlug`, `getIngredientBySlug`, `getAdditiveBySlug`, `getRecallBySlug`, `listRecalls`, and `getMockProfile`, returning typed data synchronously with no network or persistence, and returning null/undefined for unknown slugs
    - _Requirements: 23.3, 23.4, 23.5, 24.1, 24.2, 24.3, 24.5, 24.8_

  - [x]* 3.4 Write unit tests for selectors and required fixtures
    - Verify each selector returns typed data for known slugs and null/undefined for unknown slugs, and assert the three required fixtures (active recall, allergen match, alternative recommendation) are present
    - _Requirements: 23.2, 23.3, 23.5_

- [x] 4. Build design-system primitives (no domain knowledge)
  - [x] 4.1 Implement the primitives
    - Implement `Button` (visible focus state), `Chip`, `Badge`, `Card`, `Table` (semantic data table), `Disclosure` (accessible expand/collapse), `Field` (label/input/error/hint association), `Icon` (inline SVG with accessible name), and `VisuallyHidden`
    - Ensure primitives receive all content via props and hold no domain knowledge
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5, 9.6, 9.7_

  - [x]* 4.2 Write component tests for primitive accessibility contracts
    - Assert `Button` renders a visible focus state, `Table` renders semantic table markup, `Disclosure` toggles accessibly, `Field` associates label/error/hint, and `Icon` exposes an accessible name
    - _Requirements: 9.2, 9.3, 9.4, 9.5, 9.6_

- [x] 5. Build status and confidence domain components with invariants
  - [x] 5.1 Implement `StatusIndicator`
    - Render an `AssessmentStatus` with a mandatory non-empty text label and a distinct icon/shape per status; use color only as reinforcement
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 10.1, 10.2, 20.6_

  - [x]* 5.2 Write property-based test for status text + icon invariant
    - **Property 1: Status is never color-only** — for any `AssessmentStatus`, output contains a non-empty text label and a non-color icon/shape indicator
    - Use fast-check with at least 100 iterations
    - **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 20.6**

  - [x] 5.3 Implement `ConfidenceIndicator`
    - Support Very High / High / Moderate / Low / Insufficient; use the neutral confidence treatment (never a status family); include a human-readable label and copy stating confidence describes evidence quality, not danger
    - _Requirements: 7.1, 7.2, 7.3, 7.4, 10.1, 10.2_

  - [x]* 5.4 Write property-based test for confidence separation
    - **Property 5: Confidence is visually separated from status** — for any `ConfidenceLevel`, output uses the neutral treatment and includes evidence-quality-not-danger copy
    - Use fast-check with at least 100 iterations
    - **Validates: Requirements 7.2, 7.4**

- [x] 6. Build score, recall, and alternative domain components with invariants
  - [x] 6.1 Implement `ScoreDisplay`
    - Render the 0–100 score with tabular figures; keep it independent so it never suppresses the recall banner
    - _Requirements: 10.4, 5.3, 8.2_

  - [x] 6.2 Implement `RecallBanner`
    - Render active recalls prominently and understandably without reliance on color or animation; surface recalled product name, market, and reason in plain, non-alarmist language
    - _Requirements: 8.1, 8.3, 10.1, 10.2, 19.4, 20.11_

  - [x]* 6.3 Write property-based test for active-recall surfacing
    - **Property 2: Active recall is always surfaced** — for any product with at least one active recall, the recall banner is present and not replaced/suppressed by the score
    - Use fast-check with at least 100 iterations
    - **Validates: Requirements 8.1, 8.2, 13.1**

  - [x] 6.4 Implement `AlternativeRecommendationCard`
    - Always render the exact disclosure sentence "Suggested alternative. This recommendation does not change the safety assessment of the original product."; if the disclosure cannot be rendered, hide the alternative rather than render it without disclosure
    - _Requirements: 11.1, 11.2, 10.1, 10.2_

  - [x]* 6.5 Write property-based test for alternative disclosure
    - **Property 3: Alternative recommendation always discloses** — for any rendered alternative, the mandatory disclosure sentence is present
    - Use fast-check with at least 100 iterations
    - **Validates: Requirements 11.1, 11.2**

- [x] 7. Build tabular-figure numeric rendering and evidence/source components
  - [x] 7.1 Implement a numeric value + unit rendering helper
    - Render scores, nutrition amounts, and regulatory limits with tabular figures; group value and unit so the unit is never orphaned; render the "The available product-level concentration was not provided." copy when an optional concentration is missing
    - _Requirements: 5.3, 5.4, 19.5_

  - [x]* 7.2 Write property-based test for tabular figures + units
    - **Property 8: Numeric values use tabular figures** — for any score, nutrition value, or regulatory limit, output uses tabular figures and any unit renders unambiguously alongside the value
    - Use fast-check with at least 100 iterations
    - **Validates: Requirements 5.3, 5.4**

  - [x] 7.3 Implement `EvidenceCard`, `SourceChip`, and `KnowDontKnowBlock`
    - `EvidenceCard` renders claim, explanation, confidence, and associated sources; `SourceChip` renders provenance; `KnowDontKnowBlock` renders a "what we know" list and a "what we don't know" list
    - _Requirements: 10.1, 10.2, 10.5, 10.6_

  - [x]* 7.4 Write component tests for evidence and know/don't-know rendering
    - Assert `EvidenceCard` shows claim/explanation/confidence/sources and `KnowDontKnowBlock` renders both lists
    - _Requirements: 10.5, 10.6_

- [x] 8. Build regulatory, warning, ingredient, and assessment-header components
  - [x] 8.1 Implement `RegulatoryComparisonTable`
    - Render a semantic `<table>` with header scope associations, a screen-reader-friendly caption, and value+unit rendered unambiguously together for records with a limit value
    - _Requirements: 12.1, 12.2, 12.3, 10.1, 10.2, 20.8_

  - [x] 8.2 Implement `WarningPanel` and `IngredientExplanation`
    - `WarningPanel` surfaces personalized allergen/diet matches derived from mock `UserProfile` data and is understandable without color or animation; `IngredientExplanation` renders a plain-language explanation built on the `Disclosure` primitive with sources
    - _Requirements: 10.1, 10.2, 20.11_

  - [x] 8.3 Implement `AssessmentHeader`
    - Compose identity + `StatusIndicator` (text + icon) + score with tabular figures; render remaining parts if one part fails to render (resilient composition)
    - _Requirements: 10.1, 10.2, 10.3, 10.7_

  - [x]* 8.4 Write component tests for regulatory table and assessment-header resilience
    - Assert the table has caption/header scope and grouped value+unit, and that `AssessmentHeader` still renders remaining parts when one part fails
    - _Requirements: 12.1, 12.2, 12.3, 10.7_

- [x] 9. Build the app shell, primary navigation, and footer
  - [x] 9.1 Implement the root layout, primary navigation, and footer
    - Render a persistent primary navigation region and footer around every route via the root layout
    - Present nav items in order: Scan, Search, Explore, Recalls, Methodology, Sign in; render an emphasized "Scan a product" CTA visible at all viewport sizes; surface Explore browse destinations (products, ingredients, additives, compare, countries); link "Sign in" to `/login`; collapse to a mobile menu while keeping the CTA visible
    - Use semantic landmarks and keyboard-operable navigation
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 20.1, 20.3_

  - [x]* 9.2 Write component tests for nav order, CTA, and mobile collapse
    - Assert nav item order, the persistent "Scan a product" CTA, Explore destinations, the `/login` link, and mobile-menu collapse behavior
    - _Requirements: 1.2, 1.3, 1.4, 1.5, 1.6_

- [x] 10. Implement i18n (design-level) locale controls
  - [x] 10.1 Implement independent interface-language, market, and unit controls
    - Provide independent controls for interface language (default English), regulatory market, and unit preference, wired into the app shell; treat language and market as separate concepts so changing language never changes the selected market
    - _Requirements: 21.1, 21.2, 21.3, 21.4_

  - [x]* 10.2 Write property-based test that language change preserves market
    - **Property 7: Language change does not change market** — for any change to interface language, the selected market value remains unchanged
    - Use fast-check with at least 100 iterations
    - **Validates: Requirements 21.3, 21.4**

- [x] 11. Implement routing, not-found layout, and route fallbacks
  - [x] 11.1 Implement the Not_Found_Layout and account/locked stubs
    - Create a friendly, accessible not-found layout (used at `/404` and for unmatched dynamic slugs) with navigation back to key destinations and a minimal fallback message if the layout itself fails
    - Render account routes (`/login`, `/signup`, `/profile`, `/profile/allergies`, `/profile/diet`, `/history`, `/saved`, `/alerts`, `/settings`) as static stubs with a clear prototype note
    - Render locked routes (`/testing`, `/testing/[product]`, `/testing/crowdfund/[product]`) in an "Unlock soon" state with a link back to available features
    - _Requirements: 2.3, 3.1, 3.2, 3.3, 3.4, 18.4, 18.5, 24.4, 24.7_

  - [x]* 11.2 Write property-based test for unknown-slug fallback
    - **Property 6: Unknown slugs resolve to not-found** — for any dynamic slug not matching a fixture, the route renders the not-found layout rather than throwing or rendering partial content
    - Use fast-check with at least 100 iterations
    - **Validates: Requirements 2.3, 23.5**

- [x] 12. Checkpoint — ensure component and property tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Build the Product page (`/products/[slug]`) with 17 sections in order
  - [x] 13.1 Implement the product page composition
    - Resolve the slug via `getProductBySlug`, falling back to the not-found layout for unknown slugs
    - Render the 17 sections in exact order: Product identity, Market/country, Assessment status, Score, Key reasons, Ingredients, Ingredient explanations, Additives, Nutrition, Allergens, Safety/regulatory checks, Recalls, Potential health concerns, Evidence confidence, Sources, Data freshness, Report correction
    - Render Assessment status with `StatusIndicator` (text + icon); render the Nutrition section as a semantic table with tabular figures and unambiguous units; render the personalized `WarningPanel` when the mock profile matches a declared allergen; render a "Report a correction" affordance that performs no submission
    - Keep the active recall banner prominent and independent of the score
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 8.1, 8.2, 20.8_

  - [x]* 13.2 Write property-based test for section order invariance
    - **Property 4: Product page section order is invariant** — for any product, the 17 sections render in the specified order
    - Use fast-check with at least 100 iterations
    - **Validates: Requirements 13.1**

  - [x]* 13.3 Write component test for the 17-section order and allergen warning
    - Assert all 17 sections render in order for a representative product and that the personalized `WarningPanel` appears when the mock profile matches an allergen
    - _Requirements: 13.1, 13.4_

- [x] 14. Build the homepage, scan, and search pages
  - [x] 14.1 Implement the homepage (`/`)
    - Render hero headline "Know what is in your food. Understand the evidence.", primary CTA "Scan a product", secondary CTA "Search a product, ingredient or barcode.", and supporting sections (value proposition, sample product highlight, transparency/methodology teaser, recall-awareness teaser) from mock data
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 2.2_

  - [x] 14.2 Implement the scan page (`/scan`)
    - Present camera and upload affordances as UI only (no image processing or inference), explain what scanning would do, and provide a clear fallback to manual search
    - _Requirements: 15.1, 15.2, 15.3, 15.4, 24.1_

  - [x] 14.3 Implement the search page (`/search`)
    - Render a search field for products, ingredients, and barcodes against mock results; result cards include `StatusIndicator` and `ScoreDisplay`; render an empty-state with plain-language guidance for empty queries and a "no results found" message with guidance for non-matching queries
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [x]* 14.4 Write component tests for homepage copy and search states
    - Assert homepage hero/CTA copy and that search renders empty and no-results states with guidance suggesting scan or Explore
    - _Requirements: 14.1, 14.2, 14.3, 16.3, 16.4_

- [x] 15. Build the browse, transparency, and comparison pages
  - [x] 15.1 Implement ingredient and additive detail pages
    - `/ingredients/[slug]` and `/additives/[slug]` render identity, plain-language explanation, `RegulatoryComparisonTable`, associated products, sources, and confidence; unknown slugs fall back to the not-found layout
    - _Requirements: 17.1, 17.2, 23.5_

  - [x] 15.2 Implement the compare page (`/compare`)
    - Render a side-by-side comparison of products/markets using status, score, and key attributes in accessible tables with captions and header scope
    - _Requirements: 17.3, 20.8_

  - [x] 15.3 Implement the recalls list and recall detail pages
    - `/recalls` renders a recall listing via `listRecalls`; `/recalls/[slug]` renders recall specifics, affected markets, and source references, falling back to not-found for unknown slugs
    - _Requirements: 17.4, 17.5, 23.5_

  - [x] 15.4 Implement the countries, methodology, and sources pages
    - `/countries/[country]` renders a market overview, how regulatory context differs, and sample products; `/methodology` renders an educational description of how assessments are presented; `/sources` renders a catalog of source types
    - _Requirements: 17.6, 17.7, 17.8_

- [x] 16. Build the editorial and policy pages
  - [x] 16.1 Implement editorial and policy layouts
    - Render layouts for `/about`, `/pricing` (layout only, no billing logic), `/blog`, `/privacy`, `/terms`, `/medical-disclaimer` (framed as educational information, not diagnosis or treatment), and `/data-policy`
    - _Requirements: 18.1, 18.2, 18.3, 19.6, 24.6_

  - [x]* 16.2 Write component test for the medical-disclaimer framing and pricing
    - Assert the medical disclaimer is framed as educational information and that `/pricing` renders a layout without billing logic
    - _Requirements: 18.2, 18.3, 19.6_

- [x] 17. Apply cross-cutting content and language rules
  - Apply plain-language-first copy across pages and components; ensure the prohibited phrasings ("toxic food", "causes cancer" without specific evidence, "100% safe", "detox", "chemical-free") are absent; render "No active recall found in the sources checked." when a product has no active recall; ensure the active-recall message states product name, market, and reason in plain, non-alarmist language; render the missing-concentration copy where applicable
  - _Requirements: 19.1, 19.2, 19.3, 19.4, 19.5_

- [x] 18. Apply the accessibility pass across pages and components
  - Ensure keyboard reachability/operability and a visible focus indicator on every focusable element; use semantic landmarks, headings, lists, and table semantics; associate form labels/hints/errors with inputs and render specific, programmatically-associated error messages for invalid inputs; provide meaningful alt text for informative images and empty alt for decorative; honor `prefers-reduced-motion`; render nutrition/regulatory tables with captions, header scope, and cell associations; provide accessible text/table equivalents for any chart; ensure recall banner and warning panel are understandable without color or animation
  - _Requirements: 20.1, 20.2, 20.3, 20.4, 20.5, 20.7, 20.8, 20.9, 20.10, 20.11_

- [x] 19. Add SEO metadata and structured-data placeholders
  - Provide per-page metadata (title + factual-snippet-style description, e.g. "Ingredients, allergens, nutrition, recalls and evidence for [product] in [market]."); add structured-data placeholder stubs (Product, Brand, or FAQPage) where genuinely applicable; note locale-aware URL and hreflang considerations without fully implementing them
  - _Requirements: 22.1, 22.2, 22.3, 22.4_

- [x] 20. Build the integration and accessibility test suite
  - [x]* 20.1 Write navigation smoke tests
    - Verify primary nav routes resolve, dynamic routes resolve known slugs, and dynamic routes fall back to the Not_Found_Layout for unknown slugs
    - _Requirements: 25.4, 2.3, 23.5_

  - [x]* 20.2 Write consolidated domain-component invariant tests
    - Assert `StatusIndicator` always outputs a text label + icon, `RecallBanner` renders active recalls prominently, and `AlternativeRecommendationCard` always renders the disclosure sentence
    - _Requirements: 25.1_

  - [x]* 20.3 Write axe accessibility checks on representative pages
    - Run jest-axe against the homepage, a product page, and the not-found page and assert no violations
    - _Requirements: 25.3, 20.1, 20.3_

- [x] 21. Final checkpoint — ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional test sub-tasks and can be skipped for a faster MVP; all non-`*` tasks are required for a buildable prototype.
- Each task references specific requirement sub-IDs for traceability.
- Property-based tests use **fast-check** with at least 100 iterations and each references a numbered correctness property (P1–P8) from the design document.
- Checkpoints (tasks 12 and 21) ensure incremental validation.
- The prototype performs no computation, network I/O, persistence, auth, OCR/AI, billing, or crowdfunding (R24).

## Task Dependency Graph

```json
{
  "waves": [
    { "id": 0, "tasks": ["1.1"] },
    { "id": 1, "tasks": ["2.1", "3.1"] },
    { "id": 2, "tasks": ["2.2", "3.2", "4.1"] },
    { "id": 3, "tasks": ["3.3", "4.2"] },
    { "id": 4, "tasks": ["3.4", "5.1", "5.3", "6.1", "6.2", "6.4", "7.1", "7.3"] },
    { "id": 5, "tasks": ["5.2", "5.4", "6.3", "6.5", "7.2", "7.4", "8.1", "8.2", "8.3"] },
    { "id": 6, "tasks": ["8.4", "9.1", "10.1", "11.1"] },
    { "id": 7, "tasks": ["9.2", "10.2", "11.2", "13.1", "14.1", "14.2", "14.3", "16.1"] },
    { "id": 8, "tasks": ["13.2", "13.3", "14.4", "15.1", "15.2", "15.3", "15.4", "16.2"] },
    { "id": 9, "tasks": ["17", "18", "19"] },
    { "id": 10, "tasks": ["20.1", "20.2", "20.3"] }
  ]
}
```
