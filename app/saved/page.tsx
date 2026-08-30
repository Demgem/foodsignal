import type { Metadata } from "next";
import { StubPage } from "@/components/stubs";

export const metadata: Metadata = {
  title: "Saved — FoodSignal",
  description: "Saved products layout stub for the FoodSignal prototype.",
};

export default function SavedPage() {
  return (
    <StubPage
      title="Saved products"
      description="This is where products you have saved for later would appear."
    >
      <p className="text-body text-text-secondary">
        Nothing is saved in this prototype.
      </p>
    </StubPage>
  );
}
