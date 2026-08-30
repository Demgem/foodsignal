import type { Metadata } from "next";
import { StubPage } from "@/components/stubs";

export const metadata: Metadata = {
  title: "Alerts — FoodSignal",
  description: "Alerts layout stub for the FoodSignal prototype.",
};

export default function AlertsPage() {
  return (
    <StubPage
      title="Alerts"
      description="This is where recall and safety alerts for products you follow would appear."
    >
      <p className="text-body text-text-secondary">
        No alerts are delivered in this prototype.
      </p>
    </StubPage>
  );
}
