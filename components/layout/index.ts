/**
 * App shell layout components barrel.
 *
 * These components compose the persistent application shell — primary
 * navigation and footer — rendered by the root layout around every route
 * (Requirement 1.1).
 */
export { PrimaryNav } from "./PrimaryNav";
export { Footer } from "./Footer";
export {
  LocalePreferences,
  setLanguage,
  setMarket,
  setUnits,
  DEFAULT_INTERFACE_LANGUAGE,
  DEFAULT_LOCALE_PREFERENCES,
  DEFAULT_LANGUAGE_OPTIONS,
  DEFAULT_MARKET_OPTIONS,
  DEFAULT_UNIT_OPTIONS,
} from "./LocalePreferences";
export type {
  LocalePreferencesProps,
  LanguageOption,
  MarketOption,
  UnitOption,
} from "./LocalePreferences";
