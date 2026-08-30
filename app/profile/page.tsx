import type { Metadata } from "next";
import Link from "next/link";
import { StubPage } from "@/components/stubs";

export const metadata: Metadata = {
  title: "Profile — FoodSignal",
  description: "Profile layout stub for the FoodSignal prototype.",
};

export default function ProfilePage() {
  return (
    <StubPage
      title="Your profile"
      description="This is where your account details, allergies, and diet preferences would appear."
    >
      <ul className="flex flex-col gap-sm text-body text-text-secondary">
        <li>
          <Link
            href="/profile/allergies"
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Manage allergies
          </Link>
        </li>
        <li>
          <Link
            href="/profile/diet"
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Manage diet preferences
          </Link>
        </li>
        <li>
          <Link
            href="/settings"
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Settings
          </Link>
        </li>
      </ul>
    </StubPage>
  );
}
