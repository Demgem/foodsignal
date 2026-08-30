import type { Metadata } from "next";
import { StubPage } from "@/components/stubs";

export const metadata: Metadata = {
  title: "Settings — FoodSignal",
  description: "Settings layout stub for the FoodSignal prototype.",
};

export default function SettingsPage() {
  return (
    <StubPage
      title="Settings"
      description="This is where account, language, market, and unit preferences would be managed."
    >
      <p className="text-body text-text-secondary">
        Interface language, regulatory market, and unit preferences are
        independent settings. No settings are stored in this prototype.
      </p>
    </StubPage>
  );
}
