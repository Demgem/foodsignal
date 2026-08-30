import type { Metadata } from "next";
import { LockedState } from "@/components/stubs";

export const metadata: Metadata = {
  title: "Product testing — FoodSignal",
  description:
    "Per-product testing is a future FoodSignal feature and is locked in this prototype.",
};

/**
 * Locked per-product testing route (Requirements 3.3, 3.4, 24.7).
 *
 * The `[product]` param is intentionally ignored: the locked "Unlock soon"
 * state renders regardless of the slug, because no product-testing
 * functionality exists in the prototype.
 */
export default function TestingProductPage() {
  return (
    <LockedState
      title="Product testing"
      description="Testing results for this product are not available yet. Product testing is a feature we plan to add."
    />
  );
}
