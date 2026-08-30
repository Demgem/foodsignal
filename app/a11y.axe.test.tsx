import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { axe } from "jest-axe";

import HomePage from "@/app/page";
import NotFound from "@/app/not-found";
import ProductDetail from "@/app/products/[slug]/ProductDetail";
import { productWithActiveRecall, getMockProfile } from "@/lib/mock-data";

/**
 * Task 20.3 — axe accessibility checks on representative pages
 * (Requirements 25.3, 20.1, 20.3).
 *
 * Runs jest-axe against a representative sample of the rendered UI and asserts
 * no accessibility violations:
 *   - the homepage (`app/page.tsx`),
 *   - the product-page rich content view (`ProductDetail` — the server
 *     `page.tsx` just resolves the slug and wraps this), rendered with a
 *     fixture product carrying an active recall + the mock profile, and
 *   - the not-found layout (`app/not-found.tsx`).
 *
 * `toHaveNoViolations` is registered globally in `vitest.setup.ts`.
 *
 * axe traversal is comparatively slow, so each case is given a generous
 * timeout.
 */

const AXE_TIMEOUT_MS = 20_000;

describe("accessibility (axe) — representative pages", () => {
  it(
    "homepage has no axe violations",
    async () => {
      const { container } = render(<HomePage />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    },
    AXE_TIMEOUT_MS,
  );

  it(
    "product detail (with active recall) has no axe violations",
    async () => {
      const { container } = render(
        <ProductDetail
          product={productWithActiveRecall}
          profile={getMockProfile()}
        />,
      );

      /*
       * When a product has an active recall, `ProductDetail` renders
       * `RecallBanner` twice: once as the prominent top-of-page banner
       * (Requirements 8.1/8.2) and once inside the Recalls section (#12,
       * Requirement 19.3). `RecallBanner` now derives a unique heading `id` and
       * region `aria-labelledby` per instance via React's `useId()`, so the two
       * `role="region"` landmarks have distinct accessible names and the DOM
       * carries no duplicate ids. `landmark-unique` is therefore fully enforced
       * here alongside every other axe rule.
       */
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    },
    AXE_TIMEOUT_MS,
  );

  it(
    "not-found layout has no axe violations",
    async () => {
      const { container } = render(<NotFound />);
      const results = await axe(container);
      expect(results).toHaveNoViolations();
    },
    AXE_TIMEOUT_MS,
  );
});
