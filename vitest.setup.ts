import "@testing-library/jest-dom/vitest";
import { expect } from "vitest";
import { toHaveNoViolations } from "jest-axe";

// Register jest-axe's accessibility matcher for use in tests.
expect.extend(toHaveNoViolations);
