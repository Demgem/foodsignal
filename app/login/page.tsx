import type { Metadata } from "next";
import Link from "next/link";
import { StubPage, DisabledFieldPreview } from "@/components/stubs";

export const metadata: Metadata = {
  title: "Sign in — FoodSignal",
  description:
    "Sign-in layout stub for the FoodSignal prototype. No authentication is performed.",
};

export default function LoginPage() {
  return (
    <StubPage
      title="Sign in"
      description="This is where you would sign in to your FoodSignal account."
    >
      <form aria-label="Sign-in preview (non-functional)" className="flex flex-col gap-md">
        <DisabledFieldPreview
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <DisabledFieldPreview label="Password" type="password" />
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="inline-flex items-center justify-center rounded-md bg-brand px-md py-sm text-label font-semibold text-brand-fg opacity-60"
        >
          Sign in (disabled in prototype)
        </button>
        <p className="text-caption text-text-secondary">
          Need an account?{" "}
          <Link
            href="/signup"
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Create one
          </Link>
        </p>
      </form>
    </StubPage>
  );
}
