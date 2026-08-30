import { render, screen, within, cleanup } from "@testing-library/react";
import { afterEach, describe, it, expect } from "vitest";
import {
  StatusIndicator,
  RecallBanner,
  AlternativeRecommendationCard,
  ALTERNATIVE_DISCLOSURE,
} from "@/components/domain";
import type { AssessmentStatus } from "@/lib/mock-data";
import {
  productWithActiveRecall,
  productWithAlternative,
} from "@/lib/mock-data";

/**
 * Consolidated domain-component invariant tests (Task 20.2).
 *
 * These are example-based checks that assert the key domain invariants
 * together, complementing the per-component property tests. They exercise the
 * public component barrel (`@/components/domain`) and the mock-data fixtures
 * (`@/lib/mock-data`) exactly as the app pages consume them.
 *
 * Requirements: 25.1
 */

afterEach(cleanup);

describe("Domain component invariants (consolidated)", () => {
  describe("StatusIndicator always outputs a text label + an icon (R6.1–R6.4)", () => {
    const cases: Array<{ status: AssessmentStatus; label: string }> = [
      { status: "safe", label: "Safe" },
      { status: "caution", label: "Caution" },
      { status: "avoid", label: "Avoid" },
    ];

    it.each(cases)(
      "renders a visible '$label' label and an <svg> for status '$status'",
      ({ status, label }) => {
        const { container } = render(<StatusIndicator status={status} />);

        // Mandatory, non-empty text label is always present (R6.1).
        expect(screen.getByText(label)).toBeInTheDocument();

        // A distinct icon is always rendered as an inline <svg> (R6.2/R6.3);
        // meaning never relies on color alone (R6.4).
        const svg = container.querySelector("svg");
        expect(svg).not.toBeNull();
      },
    );
  });

  describe("RecallBanner renders active recalls prominently (R8.1/R8.3/R19.4)", () => {
    it("surfaces a recall heading plus the product name and reason", () => {
      const activeRecalls = productWithActiveRecall.recalls.filter(
        (recall) => recall.active,
      );

      // Sanity: the fixture is expected to carry at least one active recall so
      // this invariant is actually exercised.
      expect(activeRecalls.length).toBeGreaterThan(0);

      render(<RecallBanner recalls={activeRecalls} />);

      // The banner is surfaced as a labelled region with a recall heading.
      const region = screen.getByRole("region", {
        name: /recall/i,
      });
      expect(region).toBeInTheDocument();
      expect(
        within(region).getByRole("heading", { name: /recall/i }),
      ).toBeInTheDocument();

      // Every active recall's product name and reason are stated in the banner.
      for (const recall of activeRecalls) {
        expect(within(region).getByText(recall.productName)).toBeInTheDocument();
        expect(within(region).getByText(recall.reason)).toBeInTheDocument();
      }
    });
  });

  describe("AlternativeRecommendationCard always renders the disclosure (R11.1)", () => {
    it("includes the exact ALTERNATIVE_DISCLOSURE sentence", () => {
      const alternative = productWithAlternative.alternatives?.[0];

      // Sanity: the fixture is expected to provide an alternative to render.
      expect(alternative).toBeDefined();

      render(<AlternativeRecommendationCard alternative={alternative!} />);

      expect(screen.getByText(ALTERNATIVE_DISCLOSURE)).toBeInTheDocument();
    });
  });
});
