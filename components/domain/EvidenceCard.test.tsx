import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { EvidenceCard } from "./EvidenceCard";
import type { Source } from "@/lib/mock-data/types";

/**
 * Component tests for EvidenceCard (Requirement 10.5).
 *
 * When rendered, an EvidenceCard shows its claim (title), explanation (body),
 * confidence, and associated sources.
 */

afterEach(() => {
  cleanup();
});

const sources: Source[] = [
  {
    id: "efsa-2011",
    name: "EFSA Scientific Opinion",
    type: "regulator",
    url: "https://example.org/efsa-2011",
  },
  {
    id: "who-1998",
    name: "WHO Technical Report",
    type: "scientific",
  },
];

describe("EvidenceCard", () => {
  it("renders the claim, explanation, confidence, and each source name", () => {
    render(
      <EvidenceCard
        title="Aspartame is permitted within defined limits"
        body="Regulators permit aspartame up to a specified acceptable daily intake."
        confidence="high"
        sources={sources}
      />,
    );

    // Claim (title).
    expect(
      screen.getByText("Aspartame is permitted within defined limits"),
    ).toBeInTheDocument();

    // Explanation (body).
    expect(
      screen.getByText(
        "Regulators permit aspartame up to a specified acceptable daily intake.",
      ),
    ).toBeInTheDocument();

    // Confidence indicator — the human-readable label for the given level.
    expect(screen.getByText("High confidence")).toBeInTheDocument();

    // Each source's name is rendered.
    expect(screen.getByText("EFSA Scientific Opinion")).toBeInTheDocument();
    expect(screen.getByText("WHO Technical Report")).toBeInTheDocument();
  });

  it("omits the confidence indicator when no confidence is provided", () => {
    render(
      <EvidenceCard
        title="A claim without a stated confidence"
        body="Some supporting explanation."
        sources={sources}
      />,
    );

    expect(
      screen.getByText("A claim without a stated confidence"),
    ).toBeInTheDocument();
    // No confidence label variants should appear.
    expect(screen.queryByText("High confidence")).toBeNull();
    expect(screen.queryByText("Moderate confidence")).toBeNull();
    expect(screen.queryByText("Low confidence")).toBeNull();
  });
});
