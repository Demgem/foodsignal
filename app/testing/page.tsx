import type { Metadata } from "next";
import { LockedState } from "@/components/stubs";

export const metadata: Metadata = {
  title: "Product testing — FoodSignal",
  description:
    "Product testing is a future FoodSignal feature and is locked in this prototype.",
};

export default function TestingPage() {
  return (
    <LockedState
      title="Product testing"
      description="Independent product testing is a feature we plan to add. It is not available yet."
    />
  );
}
