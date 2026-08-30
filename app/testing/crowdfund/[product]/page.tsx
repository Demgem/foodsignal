import type { Metadata } from "next";
import { LockedState } from "@/components/stubs";

export const metadata: Metadata = {
  title: "Crowdfund testing — FoodSignal",
  description:
    "Crowdfunding product testing is a future FoodSignal feature and is locked in this prototype.",
};

/**
 * Locked crowdfund-testing route (Requirements 3.3, 3.4, 24.7).
 *
 * The `[product]` param is intentionally ignored: the locked "Unlock soon"
 * state renders regardless of the slug. No crowdfunding functionality exists in
 * the prototype.
 */
export default function CrowdfundTestingProductPage() {
  return (
    <LockedState
      title="Crowdfund a product test"
      description="Crowdfunding independent testing for this product is not available yet. This is a feature we plan to add."
    />
  );
}
