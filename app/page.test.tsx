import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import HomePage from "./page";

describe("HomePage (smoke test)", () => {
  it("renders the placeholder homepage heading", () => {
    render(<HomePage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /foodsignal/i })
    ).toBeInTheDocument();
  });
});
