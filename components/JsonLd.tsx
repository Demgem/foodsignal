import type { StructuredDataStub } from "@/lib/mock-data/types";

/**
 * JsonLd — renders structured-data placeholder stubs as JSON-LD script tags
 * (Design "SEO (Design-Level)", Requirement 22.2).
 *
 * Each `StructuredDataStub` (`Product` | `Brand` | `FAQPage`) is serialized
 * into a `<script type="application/ld+json">` element. This is the standard,
 * search-engine-recognized way to embed structured data, and it renders no
 * visible UI. It works in both server and client components because it only
 * emits static markup via `dangerouslySetInnerHTML` (the content is
 * JSON produced by `JSON.stringify`, not user input).
 *
 * The stubs are design-level placeholders; see `lib/seo.ts` for the builders
 * that shape them from mock content.
 */
export function JsonLd({ stubs }: { stubs: StructuredDataStub[] }) {
  if (!stubs || stubs.length === 0) {
    return null;
  }

  return (
    <>
      {stubs.map((stub, index) => (
        <script
          key={`${stub.type}-${index}`}
          type="application/ld+json"
          // JSON-LD payload built from mock content in lib/seo.ts (not user
          // input). Serialized so search engines can read the placeholder
          // structured data (R22.2).
          dangerouslySetInnerHTML={{ __html: JSON.stringify(stub.data) }}
        />
      ))}
    </>
  );
}

export default JsonLd;
