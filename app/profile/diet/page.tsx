import type { Metadata } from "next";
import { StubPage } from "@/components/stubs";

export const metadata: Metadata = {
  title: "Diet preferences — FoodSignal",
  description: "Diet preferences layout stub for the FoodSignal prototype.",
};

export default function ProfileDietPage() {
  return (
    <StubPage
      title="Diet preferences"
      description="This is where you would set diet preferences so products can be matched against them."
    >
      <p className="text-body text-text-secondary">
        In the full product, diet preferences chosen here would tailor the
        guidance shown on product pages. No preferences are saved in this
        prototype.
      </p>
    </StubPage>
  );
}
