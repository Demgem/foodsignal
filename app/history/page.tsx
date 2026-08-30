import type { Metadata } from "next";
import { StubPage } from "@/components/stubs";

export const metadata: Metadata = {
  title: "History — FoodSignal",
  description: "History layout stub for the FoodSignal prototype.",
};

export default function HistoryPage() {
  return (
    <StubPage
      title="Your history"
      description="This is where products you have recently scanned or viewed would appear."
    >
      <p className="text-body text-text-secondary">
        No history is recorded in this prototype.
      </p>
    </StubPage>
  );
}
