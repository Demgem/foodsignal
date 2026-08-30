import { describe, expect, it } from "vitest";
import fc from "fast-check";

import {
  setLanguage,
  setMarket,
  setUnits,
  DEFAULT_LOCALE_PREFERENCES,
} from "./LocalePreferences";
import type { LocalePreferences as LocalePreferencesValue } from "@/lib/mock-data";

/**
 * Property 7: Language change does not change market.
 *
 * For any change to the interface language, the selected regulatory market
 * value (and unit preference) remains unchanged, and the two concepts are
 * never coupled. This is verified against the pure state helpers that are the
 * single source of truth for the independence invariant.
 *
 * Validates: Requirements 21.3, 21.4
 */

// Smart generator constrained to the LocalePreferences input space:
// - interfaceLanguage / market are arbitrary strings (the type allows any string)
// - units is exactly the 'metric' | 'imperial' union
const localePreferences = (): fc.Arbitrary<LocalePreferencesValue> =>
  fc.record({
    interfaceLanguage: fc.string(),
    market: fc.string(),
    units: fc.constantFrom<LocalePreferencesValue["units"]>(
      "metric",
      "imperial",
    ),
  });

const NUM_RUNS = 100;

describe("LocalePreferences — Property 7: language change does not change market", () => {
  it("setLanguage preserves market and units while updating interfaceLanguage", () => {
    fc.assert(
      fc.property(
        localePreferences(),
        fc.string(),
        (prefs, newLang) => {
          const next = setLanguage(prefs, newLang);

          // The targeted field changes...
          expect(next.interfaceLanguage).toBe(newLang);
          // ...but market and units are carried through unchanged (R21.3).
          expect(next.market).toBe(prefs.market);
          expect(next.units).toBe(prefs.units);
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it("inverse guardrail: setMarket preserves interfaceLanguage and units (R21.4)", () => {
    fc.assert(
      fc.property(
        localePreferences(),
        fc.string(),
        (prefs, newMarket) => {
          const next = setMarket(prefs, newMarket);

          expect(next.market).toBe(newMarket);
          expect(next.interfaceLanguage).toBe(prefs.interfaceLanguage);
          expect(next.units).toBe(prefs.units);
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it("helpers are pure and never mutate the input object", () => {
    fc.assert(
      fc.property(
        localePreferences(),
        fc.string(),
        fc.string(),
        (prefs, newLang, newMarket) => {
          const snapshot: LocalePreferencesValue = { ...prefs };

          const afterLang = setLanguage(prefs, newLang);
          const afterMarket = setMarket(prefs, newMarket);
          const afterUnits = setUnits(prefs, "imperial");

          // Input object is unchanged by any helper (referential purity).
          expect(prefs).toEqual(snapshot);

          // Each helper returns a brand-new object, not the same reference.
          expect(afterLang).not.toBe(prefs);
          expect(afterMarket).not.toBe(prefs);
          expect(afterUnits).not.toBe(prefs);
        },
      ),
      { numRuns: NUM_RUNS },
    );
  });

  it("default preferences use English so language/market start decoupled", () => {
    // Sanity anchor for the documented default (R21.2) that the property
    // transitions operate on.
    expect(DEFAULT_LOCALE_PREFERENCES.interfaceLanguage).toBe("en");
    expect(setLanguage(DEFAULT_LOCALE_PREFERENCES, "de").market).toBe(
      DEFAULT_LOCALE_PREFERENCES.market,
    );
  });
});
