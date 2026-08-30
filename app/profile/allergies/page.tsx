import type { Metadata } from "next";
import { StubPage } from "@/components/stubs";

export const metadata: Metadata = {
  title: "Allergies — FoodSignal",
  description: "Allergy preferences layout stub for the FoodSignal prototype.",
};

export default function ProfileAllergiesPage() {
  return (
    <StubPage
      title="Allergies"
      description="This is where you would tell FoodSignal about your allergies so products can be checked against them."
    >
      <p className="text-body text-text-secondary">
        In the full product, selecting allergies here would power the
        personalized warnings shown on product pages. No selections are saved in
        this prototype.
      </p>
    </StubPage>
  );
}
