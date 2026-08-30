# Requirements Document

## Introduction

FoodSignal is a consumer product that helps people understand what is in their food and interpret the evidence behind it. This spec covers **only the frontend UI and design-system prototype**: a Next.js (App Router) + React + TypeScript + Tailwind CSS application shell with a design-token system, primary navigation, and every public page layout populated with **typed mock/sample data**.

These requirements are derived directly from the approved design document. They describe a **visual, navigable prototype** that validates information architecture, page composition, component patterns, typography, accessibility posture, and content tone. The prototype performs **no real assessment computation**: Safe / Caution / Avoid status, the 0–100 score, evidence confidence, recalls, and all other data are rendered from static, typed mock data only.

Requirements are grouped by design area: application shell and navigation, routing, design tokens and typography, status and confidence semantics, recall precedence, component library, the 17-section product page, individual pages, content and language, accessibility, internationalization, SEO placeholders, the mock-data model, non-goals, and testing expectations.

## Glossary

- **Prototype**: The FoodSignal frontend UI and design-system artifact defined by this spec. It renders mock data only and performs no computation, persistence, or network I/O.
- **App_Shell**: The root layout providing primary navigation, footer, and shared providers around all routes.
- **Primary_Nav**: The primary navigation region containing, in order, Scan, Search, Explore, Recalls, Methodology, and Sign in, plus the emphasized "Scan a product" call-to-action.
- **Design_Token_System**: The single source of truth for color, typography, spacing, radius, shadow, motion, and breakpoint values, mapped into Tailwind theme configuration and CSS variables.
- **Status_Indicator**: The domain component that renders an AssessmentStatus (Safe / Caution / Avoid).
- **Confidence_Indicator**: The domain component that renders a ConfidenceLevel (Very High / High / Moderate / Low / Insufficient).
- **Recall_Banner**: The domain component that renders active recalls prominently.
- **Score_Display**: The domain component that renders the 0–100 score.
- **Alternative_Recommendation_Card**: The domain component that renders a suggested alternative product with a mandatory disclosure sentence.
- **Regulatory_Comparison_Table**: The domain component that renders a substance's regulatory status across markets as a semantic table.
- **Product_Page**: The route at `/products/[slug]` that renders the 17 defined product sections in order.
- **Mock_Data_Layer**: The typed, static fixtures plus synchronous selector helpers that supply all content; the only source of content in the prototype.
- **AssessmentStatus**: One of `safe`, `caution`, `avoid`.
- **ConfidenceLevel**: One of `very_high`, `high`, `moderate`, `low`, `insufficient`.
- **Locale_Preferences**: The independent controls for interface language, regulatory market, and unit preference.
- **Not_Found_Layout**: The accessible 404 layout rendered for unknown routes and unmatched dynamic slugs.
- **Tabular_Figures**: A numeric rendering style in which all digits occupy equal horizontal width so numeric values align vertically.
- **WCAG_AA**: WCAG 2.2 Level AA success criteria.

## Requirements

### Requirement 1: Application Shell and Primary Navigation

**User Story:** As a visitor, I want a consistent application shell with clear primary navigation, so that I can move between the core areas of the product from any page.

#### Acceptance Criteria

1. THE App_Shell SHALL render a persistent primary navigation region and footer around every route.
2. THE Primary_Nav SHALL present the navigation items in the order: Scan, Search, Explore, Recalls, Methodology, Sign in.
3. THE Primary_Nav SHALL render a visually emphasized primary call-to-action labeled "Scan a product" that remains visible across all viewport sizes.
4. WHERE the Explore navigation item is present, THE Primary_Nav SHALL surface browse destinations for products, ingredients, additives, compare, and countries.
5. WHEN a user activates the "Sign in" navigation item, THE App_Shell SHALL navigate to the static `/login` stub route.
6. WHILE the viewport is at a small (mobile) breakpoint, THE Primary_Nav SHALL collapse navigation items into a menu while keeping the "Scan a product" call-to-action always visible.

### Requirement 2: Public Route Inventory

**User Story:** As a visitor, I want every public page to have a full mock-data layout, so that I can navigate a complete, realistic prototype.

#### Acceptance Criteria

1. THE Prototype SHALL provide full mock-data layouts for the public routes `/`, `/scan`, `/search`, `/products/[slug]`, `/ingredients/[slug]`, `/additives/[slug]`, `/compare`, `/recalls`, `/recalls/[slug]`, `/countries/[country]`, `/methodology`, `/sources`, `/about`, `/pricing`, `/blog`, `/privacy`, `/terms`, `/medical-disclaimer`, and `/data-policy`.
2. THE Prototype SHALL render each public route using content supplied by the Mock_Data_Layer only.
3. THE Prototype SHALL render a Not_Found_Layout at the `/404` route.

### Requirement 3: Account and Locked Route Stubs

**User Story:** As a stakeholder reviewing the prototype, I want account and future-feature routes to exist as clearly non-functional stubs, so that the boundary of the prototype is unambiguous.

#### Acceptance Criteria

1. THE Prototype SHALL render the account routes `/login`, `/signup`, `/profile`, `/profile/allergies`, `/profile/diet`, `/history`, `/saved`, `/alerts`, and `/settings` as static layout stubs.
2. WHEN a user interacts with an account stub route, THE Prototype SHALL present a static, non-functional layout that includes a clear prototype note.
3. THE Prototype SHALL render the routes `/testing`, `/testing/[product]`, and `/testing/crowdfund/[product]` in a locked "Unlock soon" state.
4. WHEN a user accesses a locked route, THE Prototype SHALL render the "Unlock soon" locked state and provide a link back to available features.

### Requirement 4: Design Tokens

**User Story:** As a designer or engineer, I want a centralized design-token system, so that visual style is consistent and driven by a single source of truth.

#### Acceptance Criteria

1. THE Design_Token_System SHALL define token categories for color, typography, spacing, radius, shadow, motion, and breakpoints.
2. THE Design_Token_System SHALL expose its tokens through Tailwind theme configuration and CSS variables.
3. THE Design_Token_System SHALL define distinct status color families for Safe, Caution, and Avoid that are used only as reinforcement.
4. THE Design_Token_System SHALL define a neutral confidence color family that is distinct from the status color families.
5. THE Design_Token_System SHALL define focus-ring tokens used to render a visible focus indicator on focusable elements.
6. WHEN the user agent reports a reduced-motion preference, THE Design_Token_System SHALL resolve motion duration tokens to no motion.

### Requirement 5: Typography

**User Story:** As a reader, I want a clear, evidence-first typographic hierarchy with aligned numbers, so that content is readable and numeric data is unambiguous.

#### Acceptance Criteria

1. THE Prototype SHALL provide a typographic scale with the roles Display, H1, H2, H3, Body, Label, and Caption.
2. THE Prototype SHALL render exactly one H1 role element per page.
3. WHEN rendering a score, nutrition amount, regulatory limit value, or other numeric value, THE Prototype SHALL apply tabular figures to the numeric output.
4. WHEN rendering a numeric value that has an associated unit, THE Prototype SHALL group the value and unit so that the unit is unambiguous and never orphaned.
5. THE Prototype SHALL render text/background pairings that meet a contrast ratio of at least 4.5:1 for normal-size text.
6. THE Prototype SHALL render large text and user-interface component boundaries that meet a contrast ratio of at least 3:1.

### Requirement 6: Assessment Status Semantics

**User Story:** As a user, including a color-blind or screen-reader user, I want assessment status to be conveyed by text and icon, so that I can understand it without relying on color.

#### Acceptance Criteria

1. WHEN rendering an AssessmentStatus, THE Status_Indicator SHALL include a non-empty text label.
2. WHEN rendering an AssessmentStatus, THE Status_Indicator SHALL include an icon or shape indicator.
3. THE Status_Indicator SHALL render distinguishable icon or shape indicators for Safe, Caution, and Avoid that remain differentiable without color.
4. THE Status_Indicator SHALL use color only as reinforcement and never as the sole differentiator of status.

### Requirement 7: Confidence Semantics

**User Story:** As a user, I want evidence confidence presented separately from safety status, so that I understand confidence describes how much is known, not how dangerous a product is.

#### Acceptance Criteria

1. THE Confidence_Indicator SHALL support the levels Very High, High, Moderate, Low, and Insufficient.
2. WHEN rendering a ConfidenceLevel, THE Confidence_Indicator SHALL use the neutral confidence treatment rather than a status color family.
3. WHEN rendering a ConfidenceLevel, THE Confidence_Indicator SHALL include a human-readable label.
4. WHEN rendering a ConfidenceLevel with its description, THE Confidence_Indicator SHALL include copy indicating that confidence describes evidence quality, not danger.

### Requirement 8: Recall Precedence

**User Story:** As a user viewing a product with an active recall, I want the recall to be surfaced prominently, so that I never miss a safety-critical notice because of the score or layout.

#### Acceptance Criteria

1. WHEN a product has at least one active recall, THE Recall_Banner SHALL render prominently near the top of the Product_Page.
2. WHEN a product has at least one active recall, THE Prototype SHALL render the active recall banner independent of the Score_Display so that the score never suppresses or replaces the recall banner.
3. THE Recall_Banner SHALL be understandable without reliance on color or animation.

### Requirement 9: Design-System Primitives

**User Story:** As an engineer, I want a set of domain-agnostic UI primitives, so that domain components and pages compose from consistent, accessible building blocks.

#### Acceptance Criteria

1. THE Prototype SHALL provide the primitives Button, Chip, Badge, Card, Table, Disclosure, Field, Icon, and VisuallyHidden.
2. THE Button primitive SHALL render a visible focus state.
3. THE Table primitive SHALL render as a semantic, screen-reader-friendly data table.
4. THE Disclosure primitive SHALL provide an accessible expand and collapse interaction.
5. THE Field primitive SHALL associate a label, input, error message, and hint.
6. THE Icon primitive SHALL render an inline SVG with an accessible name.
7. THE design-system primitives SHALL have no domain knowledge and SHALL receive content only via props.

### Requirement 10: Domain Components

**User Story:** As an engineer, I want domain components that encode FoodSignal invariants, so that critical presentation rules are enforced consistently wherever they are used.

#### Acceptance Criteria

1. THE Prototype SHALL provide the domain components Status_Indicator, Confidence_Indicator, AssessmentHeader, Score_Display, EvidenceCard, SourceChip, Recall_Banner, Regulatory_Comparison_Table, WarningPanel, KnowDontKnowBlock, Alternative_Recommendation_Card, and IngredientExplanation.
2. THE domain components SHALL read data only via props supplied by the route or page layer.
3. WHEN rendering the AssessmentHeader, THE Prototype SHALL render the Status_Indicator with text and icon and render the score using tabular figures.
4. WHEN rendering the Score_Display, THE Prototype SHALL render the numeric value using tabular figures.
5. WHEN rendering an EvidenceCard, THE Prototype SHALL render its claim, explanation, confidence, and associated sources.
6. WHEN rendering the KnowDontKnowBlock, THE Prototype SHALL render a "what we know" list and a "what we don't know" list.
7. IF one part of the AssessmentHeader fails to render, THEN THE Prototype SHALL still render the remaining parts of the AssessmentHeader.

### Requirement 11: Alternative Recommendation Disclosure

**User Story:** As a user, I want any suggested alternative to carry a clear disclosure, so that I understand a suggestion does not change the original product's safety assessment.

#### Acceptance Criteria

1. WHEN an alternative recommendation is rendered, THE Alternative_Recommendation_Card SHALL render the disclosure sentence "Suggested alternative. This recommendation does not change the safety assessment of the original product."
2. IF the disclosure sentence cannot be rendered, THEN THE Alternative_Recommendation_Card SHALL hide the alternative recommendation rather than render it without the disclosure.

### Requirement 12: Regulatory Comparison Table

**User Story:** As a user, I want to compare a substance's regulatory status across markets, so that I can understand how regulatory context differs.

#### Acceptance Criteria

1. THE Regulatory_Comparison_Table SHALL render as a semantic HTML table with header scope associations.
2. THE Regulatory_Comparison_Table SHALL render a screen-reader-friendly caption.
3. WHEN a RegulatoryRecord includes a limit value with a unit, THE Regulatory_Comparison_Table SHALL render the value and unit unambiguously together.

### Requirement 13: Product Page Section Order

**User Story:** As a user, I want the product page organized in a consistent, predictable order, so that I can reliably find the information I need.

#### Acceptance Criteria

1. WHEN rendering a Product_Page, THE Prototype SHALL render the following 17 sections in this exact order: Product identity, Market/country, Assessment status, Score, Key reasons, Ingredients, Ingredient explanations, Additives, Nutrition, Allergens, Safety/regulatory checks, Recalls, Potential health concerns, Evidence confidence, Sources, Data freshness, Report correction.
2. WHEN rendering the Assessment status section, THE Prototype SHALL render the Status_Indicator with text and icon.
3. WHEN rendering the Nutrition section, THE Prototype SHALL render a semantic table using tabular figures with unambiguous units.
4. WHEN a mock UserProfile matches a declared allergen in the Allergens section, THE Prototype SHALL render the personalized WarningPanel.
5. WHEN rendering the Report correction section, THE Prototype SHALL render a "Report a correction" affordance that performs no submission.

### Requirement 14: Homepage

**User Story:** As a first-time visitor, I want a scan-first homepage, so that I immediately understand the product and can start scanning or searching.

#### Acceptance Criteria

1. THE Prototype SHALL render the homepage hero headline "Know what is in your food. Understand the evidence."
2. THE Prototype SHALL render the primary homepage call-to-action "Scan a product".
3. THE Prototype SHALL render the secondary homepage call-to-action "Search a product, ingredient or barcode."
4. THE Prototype SHALL render homepage supporting sections for value proposition, a sample product highlight, a transparency/methodology teaser, and a recall-awareness teaser using mock data.

### Requirement 15: Scan Page

**User Story:** As a user, I want a scan-first entry experience, so that I understand what scanning would do and can fall back to manual search.

#### Acceptance Criteria

1. THE `/scan` page SHALL present camera and upload affordances as user-interface elements only.
2. THE `/scan` page SHALL NOT perform image processing or model inference.
3. THE `/scan` page SHALL provide a clear fallback to manual search.
4. THE `/scan` page SHALL explain what scanning would do.

### Requirement 16: Search Page

**User Story:** As a user, I want to search for products, ingredients, and barcodes, so that I can find items I care about.

#### Acceptance Criteria

1. THE `/search` page SHALL render a search field supporting products, ingredients, and barcodes against mock results.
2. WHEN rendering a search result card, THE Prototype SHALL include the Status_Indicator and the Score_Display.
3. IF a search query is empty, THEN THE `/search` page SHALL render an empty state with plain-language guidance that suggests scanning or browsing Explore.
4. IF a non-empty search query produces no mock matches, THEN THE `/search` page SHALL render a "no results found" message with plain-language guidance that suggests scanning or browsing Explore.

### Requirement 17: Ingredient, Additive, Compare, Recalls, Countries, Methodology, and Sources Pages

**User Story:** As a user, I want detailed browse and transparency pages, so that I can explore ingredients, additives, comparisons, recalls, markets, methodology, and sources.

#### Acceptance Criteria

1. THE `/ingredients/[slug]` page SHALL render identity, a plain-language explanation, a regulatory comparison, associated products, sources, and confidence.
2. THE `/additives/[slug]` page SHALL render identity, a plain-language explanation, a regulatory comparison, associated products, sources, and confidence.
3. THE `/compare` page SHALL render a side-by-side comparison of products or markets using status, score, and key attributes in accessible tables.
4. THE `/recalls` page SHALL render a listing of recalls.
5. THE `/recalls/[slug]` page SHALL render recall specifics, affected markets, and source references.
6. THE `/countries/[country]` page SHALL render a market overview, an explanation of how regulatory context differs, and sample products for the market.
7. THE `/methodology` page SHALL render an educational description of how assessments are presented.
8. THE `/sources` page SHALL render a catalog of source types.

### Requirement 18: Editorial, Policy, and Not-Found Pages

**User Story:** As a visitor, I want editorial and policy pages and a friendly not-found page, so that supporting information and error states are complete and accessible.

#### Acceptance Criteria

1. THE Prototype SHALL render layouts for `/about`, `/pricing`, `/blog`, `/privacy`, `/terms`, `/medical-disclaimer`, and `/data-policy`.
2. THE `/pricing` page SHALL render a layout only and SHALL perform no billing logic.
3. THE `/medical-disclaimer` page SHALL frame its content as educational information and not as diagnosis or treatment.
4. THE `/404` page SHALL render a friendly, accessible Not_Found_Layout with navigation back to key destinations.
5. IF the Not_Found_Layout itself fails to render, THEN THE Prototype SHALL render a minimal accessible fallback message with a link back to the homepage.

### Requirement 19: Content and Language Guidelines

**User Story:** As a reader, I want calm, plain-language, non-alarmist copy, so that I can trust the tone and understand information without fear-based framing.

#### Acceptance Criteria

1. THE Prototype SHALL use plain-language copy first and technical language second.
2. THE Prototype SHALL NOT use the phrasings "toxic food", "causes cancer" without specific evidence, "100% safe", "detox", or "chemical-free".
3. WHEN a product has no active recall in the checked sources, THE Prototype SHALL use the phrasing "No active recall found in the sources checked."
4. WHEN a product has one or more active recalls, THE Prototype SHALL surface an active-recall message in the Recall_Banner that states the recalled product name, market, and reason using plain, non-alarmist language.
5. WHEN an optional product-level concentration value is missing, THE Prototype SHALL render the phrasing "The available product-level concentration was not provided."
6. THE `/medical-disclaimer` page SHALL present a medical disclaimer framed as educational information, not diagnosis or treatment.

### Requirement 20: Accessibility (WCAG 2.2 AA)

**User Story:** As a user relying on assistive technology, I want the prototype to meet WCAG 2.2 AA, so that I can perceive, operate, and understand every page.

#### Acceptance Criteria

1. THE Prototype SHALL make all interactive elements reachable and operable by keyboard.
2. THE Prototype SHALL render a visible focus indicator on every focusable element.
3. THE Prototype SHALL use semantic HTML landmarks, headings, lists, and table semantics.
4. THE Prototype SHALL associate form labels, hints, and error messages with their inputs.
5. THE Prototype SHALL provide meaningful alternative text for informative images and empty alternative text for decorative images.
6. THE Prototype SHALL convey status and safety alerts using text and icon or shape rather than color alone.
7. WHEN the user agent reports a reduced-motion preference, THE Prototype SHALL honor the preference by rendering no motion.
8. THE Prototype SHALL render nutrition and regulatory tables with captions, header scope, and cell associations.
9. WHERE a chart is rendered, THE Prototype SHALL provide an accessible text or table equivalent.
10. IF a form input is invalid, THEN THE Prototype SHALL render a specific, actionable error message that is programmatically associated with the input.
11. THE Recall_Banner and WarningPanel SHALL be fully understandable without color or animation.

### Requirement 21: Internationalization (Design-Level)

**User Story:** As an international user, I want interface language, regulatory market, and units treated as independent preferences, so that changing my reading language does not change which market's regulations I see.

#### Acceptance Criteria

1. THE Prototype SHALL expose independent controls for interface language, regulatory market, and unit preference.
2. THE Prototype SHALL default the interface language to English.
3. WHEN the user changes the interface-language preference, THE Prototype SHALL leave the selected regulatory market value unchanged.
4. THE Prototype SHALL treat interface language and regulatory market as separate concepts that are never coupled.

### Requirement 22: SEO Placeholders (Design-Level)

**User Story:** As a stakeholder, I want per-page metadata and structured-data placeholders, so that the prototype demonstrates the intended SEO posture.

#### Acceptance Criteria

1. THE Prototype SHALL provide per-page metadata including a title and a factual-snippet-style description.
2. WHERE structured data genuinely applies, THE Prototype SHALL provide structured-data placeholder stubs of type Product, Brand, or FAQPage.
3. THE Prototype SHALL render metadata descriptions in a factual snippet style, for example "Ingredients, allergens, nutrition, recalls and evidence for [product] in [market]."
4. THE Prototype SHALL note locale-aware URL and hreflang considerations without fully implementing them.

### Requirement 23: Mock-Data Model and Selectors

**User Story:** As an engineer, I want a typed mock-data layer with synchronous selectors, so that all content is realistic, type-safe, and free of network or persistence dependencies.

#### Acceptance Criteria

1. THE Mock_Data_Layer SHALL define TypeScript domain types for Source, RegulatoryRecord, Ingredient, Additive, Allergen, NutritionFact, Recall, AssessmentResult, Product, UserProfile, and LocalePreferences.
2. THE Mock_Data_Layer SHALL provide fixtures including at least one product with an active recall, one product with an allergen matching a mock UserProfile, and one product with an alternative recommendation.
3. THE Mock_Data_Layer SHALL provide selector helpers, including getProductBySlug, getIngredientBySlug, getAdditiveBySlug, getRecallBySlug, listRecalls, and getMockProfile, that return typed data synchronously.
4. THE Mock_Data_Layer SHALL perform no network requests and no persistence.
5. WHEN a dynamic route slug does not match any fixture, THE Prototype SHALL render the Not_Found_Layout rather than throwing or rendering partial content.

### Requirement 24: Prototype Non-Goals

**User Story:** As a stakeholder, I want the prototype's non-goals enforced, so that no out-of-scope capability is accidentally built.

#### Acceptance Criteria

1. THE Prototype SHALL NOT perform OCR or AI inference.
2. THE Prototype SHALL NOT perform live API calls, backend requests, or server data fetching.
3. THE Prototype SHALL NOT include a database or any persistence layer.
4. THE Prototype SHALL NOT implement authentication logic, sessions, or credential handling.
5. THE Prototype SHALL NOT perform regulatory computation, and it SHALL render regulatory comparisons from mock RegulatoryRecord data.
6. THE Prototype SHALL NOT implement payment, premium, or billing logic.
7. THE Prototype SHALL NOT implement crowdfunding or product-testing functionality, and it SHALL render the testing routes in a locked "Unlock soon" state.
8. THE Prototype SHALL render AssessmentResult values from authored mock data rather than from a computed assessment engine.

### Requirement 25: Testing Expectations

**User Story:** As an engineer, I want component and property-based tests, so that critical presentation invariants are verified automatically.

#### Acceptance Criteria

1. THE Prototype SHALL include component render tests asserting that the Status_Indicator always outputs a text label and an icon, that the Recall_Banner renders active recalls prominently, and that the Alternative_Recommendation_Card always renders the disclosure sentence.
2. THE Prototype SHALL include a component test verifying that the Product_Page renders all 17 sections in order.
3. THE Prototype SHALL implement property-based tests for universal rendering invariants using fast-check.
4. THE Prototype SHALL include navigation smoke tests verifying that primary nav routes resolve and that dynamic routes fall back to the Not_Found_Layout for unknown slugs.
