"use client";

import { useState } from "react";
import { Field } from "@/components/primitives";
import type { LocalePreferences as LocalePreferencesValue } from "@/lib/mock-data";

/**
 * LocalePreferences controls (Requirements 21.1, 21.2, 21.3, 21.4)
 *
 * Provides three INDEPENDENT controls wired into the app shell:
 * - interface language (default English)
 * - regulatory market
 * - unit preference (metric | imperial)
 *
 * Correctness Property 7 (critical): changing the interface language MUST NOT
 * change the selected regulatory market, and vice versa. To make this
 * independence easy to unit/property-test, the state transitions are expressed
 * as PURE helpers (`setLanguage`, `setMarket`, `setUnits`) that each return a
 * NEW LocalePreferences object with only the targeted field changed — every
 * other field (notably `market` when the language changes) is carried through
 * unchanged. The component simply applies these helpers via setState.
 *
 * Accessibility (Requirements 20.1, 20.2, 20.4):
 * - Each control is a native `<select>` associated with a visible `<label>`
 *   via the Field primitive (label/`htmlFor` association).
 * - Native `<select>` elements are keyboard operable.
 * - A visible focus ring is applied via focus-visible utility classes.
 */

/** Interface language option (design-level; V1 primary language is English). */
export interface LanguageOption {
  /** BCP-47-ish code stored in `interfaceLanguage`, e.g. "en". */
  value: string;
  /** Human-readable label shown in the select. */
  label: string;
}

/** Regulatory market option, independent of interface language. */
export interface MarketOption {
  /** Market identifier stored in `market`, e.g. "EU", "US". */
  value: string;
  /** Human-readable label shown in the select. */
  label: string;
}

/** Unit preference option. */
export interface UnitOption {
  value: LocalePreferencesValue["units"];
  label: string;
}

/**
 * Default interface language is English (Requirement 21.2).
 * Exported so tests and callers can rely on the same default.
 */
export const DEFAULT_INTERFACE_LANGUAGE = "en";

/** Default locale preferences: English language, EU market, metric units. */
export const DEFAULT_LOCALE_PREFERENCES: LocalePreferencesValue = {
  interfaceLanguage: DEFAULT_INTERFACE_LANGUAGE,
  market: "EU",
  units: "metric",
};

export const DEFAULT_LANGUAGE_OPTIONS: readonly LanguageOption[] = [
  { value: "en", label: "English" },
  { value: "de", label: "Deutsch" },
  { value: "fr", label: "Français" },
  { value: "es", label: "Español" },
];

export const DEFAULT_MARKET_OPTIONS: readonly MarketOption[] = [
  { value: "EU", label: "European Union" },
  { value: "US", label: "United States" },
];

export const DEFAULT_UNIT_OPTIONS: readonly UnitOption[] = [
  { value: "metric", label: "Metric" },
  { value: "imperial", label: "Imperial" },
];

// ---------------------------------------------------------------------------
// Pure state helpers — each changes exactly one field and preserves the rest.
//
// These are the single source of truth for the "independence" invariant
// (Correctness Property 7 / Requirements 21.3, 21.4). They are pure: given the
// same input they return an equivalent new object and never mutate the input.
// ---------------------------------------------------------------------------

/**
 * Return new preferences with only `interfaceLanguage` changed.
 *
 * CRITICAL (Property 7 / R21.3, R21.4): `market` (and `units`) are carried
 * through unchanged, so changing the language never changes the market.
 */
export function setLanguage(
  prefs: LocalePreferencesValue,
  interfaceLanguage: string,
): LocalePreferencesValue {
  return { ...prefs, interfaceLanguage };
}

/**
 * Return new preferences with only `market` changed.
 *
 * `interfaceLanguage` (and `units`) are carried through unchanged, so changing
 * the market never changes the interface language (R21.4).
 */
export function setMarket(
  prefs: LocalePreferencesValue,
  market: string,
): LocalePreferencesValue {
  return { ...prefs, market };
}

/**
 * Return new preferences with only `units` changed. Language and market are
 * carried through unchanged.
 */
export function setUnits(
  prefs: LocalePreferencesValue,
  units: LocalePreferencesValue["units"],
): LocalePreferencesValue {
  return { ...prefs, units };
}

export interface LocalePreferencesProps {
  /** Initial preferences; defaults to English / EU / metric. */
  initialPreferences?: LocalePreferencesValue;
  languageOptions?: readonly LanguageOption[];
  marketOptions?: readonly MarketOption[];
  unitOptions?: readonly UnitOption[];
  /** Optional observer notified whenever preferences change. */
  onChange?: (prefs: LocalePreferencesValue) => void;
  className?: string;
}

const selectClasses =
  "min-h-10 rounded-md border border-border bg-surface px-sm py-xs text-label " +
  "text-text-primary transition-colors duration-fast ease-base hover:bg-surface-muted " +
  "focus:outline-none focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function LocalePreferences({
  initialPreferences = DEFAULT_LOCALE_PREFERENCES,
  languageOptions = DEFAULT_LANGUAGE_OPTIONS,
  marketOptions = DEFAULT_MARKET_OPTIONS,
  unitOptions = DEFAULT_UNIT_OPTIONS,
  onChange,
  className,
}: LocalePreferencesProps) {
  const [prefs, setPrefs] = useState<LocalePreferencesValue>(initialPreferences);

  function apply(next: LocalePreferencesValue) {
    setPrefs(next);
    onChange?.(next);
  }

  return (
    <div
      className={[
        "flex flex-col gap-sm sm:flex-row sm:items-end sm:gap-md",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Interface language — independent of market (R21.1, R21.2, R21.3). */}
      <Field label="Language">
        {({ inputId }) => (
          <select
            id={inputId}
            className={selectClasses}
            value={prefs.interfaceLanguage}
            onChange={(event) => apply(setLanguage(prefs, event.target.value))}
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </Field>

      {/* Regulatory market — independent of language (R21.1, R21.4). */}
      <Field label="Market">
        {({ inputId }) => (
          <select
            id={inputId}
            className={selectClasses}
            value={prefs.market}
            onChange={(event) => apply(setMarket(prefs, event.target.value))}
          >
            {marketOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </Field>

      {/* Unit preference — independent of language and market (R21.1). */}
      <Field label="Units">
        {({ inputId }) => (
          <select
            id={inputId}
            className={selectClasses}
            value={prefs.units}
            onChange={(event) =>
              apply(setUnits(prefs, event.target.value as LocalePreferencesValue["units"]))
            }
          >
            {unitOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        )}
      </Field>
    </div>
  );
}

export default LocalePreferences;
