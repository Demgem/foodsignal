import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { KnowDontKnowBlock } from "./KnowDontKnowBlock";

/**
 * Component tests for KnowDontKnowBlock (Requirement 10.6).
 *
 * Renders BOTH a "What we know" list and a "What we don't know" list, each
 * under a clear heading. When a list is empty, a plain-language placeholder is
 * shown so the section is never silently blank.
 */

// Exact placeholder copy used by the component for empty lists.
const KNOWN_EMPTY_TEXT =
  "No confirmed findings are available in the sources checked.";
const UNKNOWN_EMPTY_TEXT =
  "No outstanding evidence gaps were noted in the sources checked.";

afterEach(() => {
  cleanup();
});

describe("KnowDontKnowBlock", () => {
  it("renders both headings and every item under the right list", () => {
    const known = [
      "The additive is approved in this market.",
      "A daily intake limit is defined.",
    ];
    const unknown = [
      "Long-term effects at high intake are unclear.",
      "Data for children is limited.",
    ];

    render(<KnowDontKnowBlock known={known} unknown={unknown} />);

    // Both headings are present.
    expect(
      screen.getByRole("heading", { name: "What we know" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "What we don't know" }),
    ).toBeInTheDocument();

    // Every known item renders.
    for (const item of known) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
    // Every unknown item renders.
    for (const item of unknown) {
      expect(screen.getByText(item)).toBeInTheDocument();
    }
  });

  it("renders the placeholder copy for empty lists", () => {
    render(<KnowDontKnowBlock known={[]} unknown={[]} />);

    // Headings still render so the two-column framing stays intact.
    expect(
      screen.getByRole("heading", { name: "What we know" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "What we don't know" }),
    ).toBeInTheDocument();

    // Both placeholders appear.
    expect(screen.getByText(KNOWN_EMPTY_TEXT)).toBeInTheDocument();
    expect(screen.getByText(UNKNOWN_EMPTY_TEXT)).toBeInTheDocument();
  });
});
