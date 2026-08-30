import { describe, it, expect } from "vitest";

import {
  buildProductStub,
  buildBrandStub,
  buildFaqPageStub,
  LOCALE_URL_NOTE,
} from "./seo";
import { productWithActiveRecall } from "./mock-data";
import type { Product } from "./mock-data/types";

/**
 * Tests for the SEO structured-data placeholder builders (Requirement 22.2,
 * 22.3, 22.4). These verify the stubs are shaped as valid JSON-LD placeholders
 * built from mock content, carry the correct `type`, and never fabricate
 * ratings/prices/offers (R24.8).
 */

describe("buildProductStub", () => {
  const product: Product = productWithActiveRecall;

  it("returns a stub with type 'Product'", () => {
    expect(buildProductStub(product).type).toBe("Product");
  });

  it("builds schema.org Product JSON-LD from the mock product", () => {
    const { data } = buildProductStub(product);
    expect(data["@context"]).toBe("https://schema.org");
    expect(data["@type"]).toBe("Product");
    expect(data.name).toBe(product.name);
    expect(data.description).toContain(product.name);
    expect(data.description).toContain(product.market);
  });

  it("nests the brand as a Brand node", () => {
    const { data } = buildProductStub(product);
    expect(data.brand).toEqual({ "@type": "Brand", name: product.brand });
  });

  it("does not fabricate ratings, prices, or offers", () => {
    const { data } = buildProductStub(product);
    expect(data).not.toHaveProperty("aggregateRating");
    expect(data).not.toHaveProperty("offers");
    expect(data).not.toHaveProperty("price");
    expect(data).not.toHaveProperty("review");
  });

  it("serializes to valid JSON", () => {
    expect(() => JSON.stringify(buildProductStub(product))).not.toThrow();
  });
});

describe("buildBrandStub", () => {
  it("returns a Brand stub built from the product brand", () => {
    const stub = buildBrandStub(productWithActiveRecall);
    expect(stub.type).toBe("Brand");
    expect(stub.data["@type"]).toBe("Brand");
    expect(stub.data.name).toBe(productWithActiveRecall.brand);
  });
});

describe("buildFaqPageStub", () => {
  it("returns a FAQPage stub with a Question/Answer mainEntity", () => {
    const stub = buildFaqPageStub([
      { question: "Q1?", answer: "A1." },
      { question: "Q2?", answer: "A2." },
    ]);
    expect(stub.type).toBe("FAQPage");
    expect(stub.data["@type"]).toBe("FAQPage");
    const mainEntity = stub.data.mainEntity as unknown[];
    expect(mainEntity).toHaveLength(2);
    expect(mainEntity[0]).toEqual({
      "@type": "Question",
      name: "Q1?",
      acceptedAnswer: { "@type": "Answer", text: "A1." },
    });
  });

  it("drops entries with empty question or answer", () => {
    const stub = buildFaqPageStub([
      { question: "Q1?", answer: "A1." },
      { question: "", answer: "orphan" },
      { question: "orphan", answer: "  " },
    ]);
    expect((stub.data.mainEntity as unknown[])).toHaveLength(1);
  });
});

describe("LOCALE_URL_NOTE", () => {
  it("notes hreflang / locale-aware URLs without implementing them (R22.4)", () => {
    expect(LOCALE_URL_NOTE.toLowerCase()).toContain("hreflang");
    expect(LOCALE_URL_NOTE.toLowerCase()).toContain("not implemented");
  });
});
