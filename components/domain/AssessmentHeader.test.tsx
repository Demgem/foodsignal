import { cleanup, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { AssessmentHeader } from "./AssessmentHeader";
import { listProducts } from "@/lib/mock-data";
import type { AssessmentResult, Product } from "@/lib/mock-data/types";

/**
 * Component tests for AssessmentHeader resilience.
 *
 * Validates: Requirements 10.7
 *
 * R10.7: "IF one part of the AssessmentHeader fails to render, THEN the
 * Prototype SHALL still render the remaining parts." Each sub-part (identity /
 * status / score) is wrapped in its own SectionBoundary; when one section
 * throws during render, only that section swaps to its plain-language fallback
 * ("This <section> could not be shown.") while the sibling sections continue
 * rendering.
 *
 * To exercise per-section isolation we pass an assessment whose `status` is an
 * unexpected value (cast). StatusIndicator looks up STATUS_PRESENTATION[status]
 * and then reads `.tone` off the result; for an unknown status that lookup is
 * `undefined`, so reading `.tone` throws — tripping ONLY the status section's
 * boundary while identity and score render normally.
 */

const fixtureProduct: Product = listProducts()[0];
const fixtureAssessment: AssessmentResult = fixtureProduct.assessment;

afterEach(() => {
  cleanup();
});

describe("AssessmentHeader", () => {
  it("renders identity, status, and score for a valid product + assessment", () => {
    const { container } = render(
      <AssessmentHeader
        product={fixtureProduct}
        assessment={fixtureAssessment}
      />,
    );

    // Identity: product name is rendered.
    const identity = container.querySelector('[data-part="identity"]');
    expect(identity).not.toBeNull();
    expect(screen.getByText(fixtureProduct.name)).toBeInTheDocument();

    // Status: the StatusIndicator renders with the fixture status.
    const status = container.querySelector('[data-part="status"]');
    expect(status).not.toBeNull();
    expect(
      status!.querySelector(`[data-status="${fixtureAssessment.status}"]`),
    ).not.toBeNull();

    // Score: the ScoreDisplay renders the (clamped) score value.
    const score = container.querySelector('[data-part="score"]');
    expect(score).not.toBeNull();
    expect(score!.querySelector('[data-numeric="true"]')).not.toBeNull();

    // No section fell back to its error state for valid data.
    expect(
      container.querySelector('[data-part-error="true"]'),
    ).toBeNull();
  });

  describe("per-section resilience (R10.7)", () => {
    // The failing status section logs a React error boundary warning; silence
    // it so the intentional throw doesn't pollute test output.
    beforeEach(() => {
      vi.spyOn(console, "error").mockImplementation(() => {});
    });

    afterEach(() => {
      vi.restoreAllMocks();
    });

    it("keeps rendering identity and score when the status section throws", () => {
      // Force ONLY the status sub-part to throw via an unexpected status value.
      const brokenAssessment = {
        ...fixtureAssessment,
        status: "totally-not-a-status",
      } as unknown as AssessmentResult;

      const { container } = render(
        <AssessmentHeader
          product={fixtureProduct}
          assessment={brokenAssessment}
        />,
      );

      // The status section shows its accessible fallback...
      const statusError = container.querySelector(
        '[data-part="status"][data-part-error="true"]',
      );
      expect(statusError).not.toBeNull();
      expect(statusError).toHaveTextContent(
        "This assessment status could not be shown.",
      );

      // ...while identity still renders.
      const identity = container.querySelector('[data-part="identity"]');
      expect(identity).not.toBeNull();
      expect(identity).not.toHaveAttribute("data-part-error", "true");
      expect(screen.getByText(fixtureProduct.name)).toBeInTheDocument();

      // ...and score still renders.
      const score = container.querySelector('[data-part="score"]');
      expect(score).not.toBeNull();
      expect(score).not.toHaveAttribute("data-part-error", "true");
      expect(score!.querySelector('[data-numeric="true"]')).not.toBeNull();

      // Only ONE section failed — the others are intact.
      expect(
        container.querySelectorAll('[data-part-error="true"]'),
      ).toHaveLength(1);
    });
  });
});
