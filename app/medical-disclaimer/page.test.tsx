import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import MedicalDisclaimerPage from "./page";

/**
 * Component test for the medical-disclaimer page framing.
 *
 * Validates: Requirements 18.3, 19.6 — content is framed as EDUCATIONAL
 * information and NOT diagnosis or treatment, with guidance to rely on
 * official labeling and qualified professionals.
 */
describe("MedicalDisclaimerPage", () => {
  it("renders a single top-level heading", () => {
    render(<MedicalDisclaimerPage />);
    expect(
      screen.getByRole("heading", { level: 1, name: /medical disclaimer/i })
    ).toBeInTheDocument();
  });

  it("frames the content as educational information", () => {
    render(<MedicalDisclaimerPage />);
    // The prominent "key point" states the framing explicitly.
    expect(
      screen.getByText(/provides educational information/i)
    ).toBeInTheDocument();
    // Educational framing also appears in the "What FoodSignal is" section.
    expect(
      screen.getByText(/Everything shown is educational information\./i)
    ).toBeInTheDocument();
  });

  it("states it is NOT diagnosis or treatment", () => {
    render(<MedicalDisclaimerPage />);
    // Key-point copy: "...not diagnosis or treatment."
    expect(
      screen.getByText(/not diagnosis or treatment/i)
    ).toBeInTheDocument();
    // Reinforced in the "What FoodSignal is not" section.
    expect(
      screen.getByText(
        /does not provide diagnosis or treatment.*not a substitute for advice from a qualified professional/i
      )
    ).toBeInTheDocument();
  });

  it("guides users to rely on official labeling and qualified professionals", () => {
    render(<MedicalDisclaimerPage />);
    // Present in the key point up front.
    expect(
      screen.getByText(
        /rely on official labeling and qualified professionals/i
      )
    ).toBeInTheDocument();
    // And in the allergies / dietary needs section, emphasising official labeling.
    expect(
      screen.getByText(
        /rely on the official product labeling and the guidance of qualified professionals/i
      )
    ).toBeInTheDocument();
    expect(
      screen.getByText(
        /official labeling is the authoritative source/i
      )
    ).toBeInTheDocument();
  });

  it("has a section clarifying what FoodSignal is NOT", () => {
    render(<MedicalDisclaimerPage />);
    expect(
      screen.getByRole("heading", { level: 2, name: /what foodsignal is not/i })
    ).toBeInTheDocument();
  });
});
