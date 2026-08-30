import type { Metadata } from "next";
import Link from "next/link";
import { StubPage, DisabledFieldPreview } from "@/components/stubs";

export const metadata: Metadata = {
  title: "Create account — FoodSignal",
  description:
    "Sign-up layout stub for the FoodSignal prototype. No account is created.",
};

export default function SignupPage() {
  return (
    <StubPage
      title="Create your account"
      description="This is where you would create a FoodSignal account to save products and set preferences."
    >
      <form aria-label="Create-account preview (non-functional)" className="flex flex-col gap-md">
        <DisabledFieldPreview label="Name" placeholder="Your name" />
        <DisabledFieldPreview
          label="Email"
          type="email"
          placeholder="you@example.com"
        />
        <DisabledFieldPreview
          label="Password"
          type="password"
          hint="Would require at least 8 characters."
        />
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="inline-flex items-center justify-center rounded-md bg-brand px-md py-sm text-label font-semibold text-brand-fg opacity-60"
        >
          Create account (disabled in prototype)
        </button>
        <p className="text-caption text-text-secondary">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-brand underline-offset-2 hover:underline focus:outline-none focus-visible:ring-2 focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background"
          >
            Sign in
          </Link>
        </p>
      </form>
    </StubPage>
  );
}
