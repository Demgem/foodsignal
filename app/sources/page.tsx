import type { Metadata } from "next";

import { SourceChip } from "@/components/domain/SourceChip";
import { Card } from "@/components/primitives";
import { listSources, type Source } from "@/lib/mock-data";

/**
 * Sources page — `/sources` (Requirements 17.8, 22.1).
 *
 * A transparency catalog that (1) describes the TYPES of source FoodSignal
 * draws on, and (2) lists the actual sample sources from `listSources()`,
 * rendered as SourceChips. All content is mock data read via the selectors
 * only; the page performs no network requests and no computation.
 *
 * Copy is plain-language and non-alarmist, following the design's Content &
 * Language Guidelines.
 */

export const metadata: Metadata = {
  title: "Sources — Where our information comes from — FoodSignal",
  description:
    "The types of source FoodSignal draws on — regulators, scientific literature, manufacturers, databases and other references — and the sample sources used in this prototype.",
};

type SourceType = Source["type"];

interface SourceTypeInfo {
  type: SourceType;
  label: string;
  description: string;
}

/**
 * The five source TYPES the mock-data model supports, each with a short,
 * plain-language description. Ordered from most to least authoritative for a
 * regulatory reading, though every reference is shown with its provenance so
 * readers can judge for themselves.
 */
const SOURCE_TYPES: SourceTypeInfo[] = [
  {
    type: "regulator",
    label: "Regulator",
    description:
      "Official bodies that set or publish the rules for a market, including what is permitted, restricted, or subject to a use-level limit, as well as recall registries.",
  },
  {
    type: "scientific",
    label: "Scientific",
    description:
      "Peer-reviewed research such as systematic reviews and meta-analyses. Used to describe what the wider evidence indicates, with its strengths and limits.",
  },
  {
    type: "manufacturer",
    label: "Manufacturer",
    description:
      "Information provided by the maker of a product, such as the label and specification. Useful for ingredients, allergens and nutrition as declared.",
  },
  {
    type: "database",
    label: "Database",
    description:
      "Structured reference collections of ingredients and additives. Helpful for identification and cross-referencing, and best read alongside primary sources.",
  },
  {
    type: "other",
    label: "Other",
    description:
      "References that do not fall into the categories above, such as editorial methodology notes explaining how information is presented.",
  },
];

/** Human-readable label for a source type, for grouping the sample sources. */
const TYPE_LABEL: Record<SourceType, string> = {
  regulator: "Regulator",
  scientific: "Scientific",
  manufacturer: "Manufacturer",
  database: "Database",
  other: "Other",
};

export default function SourcesPage() {
  const sources = listSources();

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-xl px-lg py-xl">
      {/* Overview (single H1 per page) */}
      <header className="flex flex-col gap-sm">
        <p className="text-label uppercase tracking-wide text-text-secondary">
          Transparency
        </p>
        <h1 className="text-h1 text-text-primary">Where our information comes from</h1>
        <p className="text-body text-text-secondary">
          FoodSignal draws on several kinds of source, and every statement is
          shown with the references behind it so you can check them for yourself.
          Below is what each type of source is, followed by the sample sources
          used in this prototype.
        </p>
      </header>

      {/* Source type catalog */}
      <section
        aria-labelledby="source-types-heading"
        className="flex flex-col gap-md"
      >
        <h2 id="source-types-heading" className="text-h2 text-text-primary">
          Types of source
        </h2>
        <dl className="flex flex-col gap-sm">
          {SOURCE_TYPES.map((info) => (
            <Card key={info.type} as="div" padding="md">
              <dt className="text-body font-semibold text-text-primary">
                {info.label}
              </dt>
              <dd className="mt-xs text-body text-text-secondary">
                {info.description}
              </dd>
            </Card>
          ))}
        </dl>
      </section>

      {/* Actual sample sources, grouped by type */}
      <section
        aria-labelledby="source-catalog-heading"
        className="flex flex-col gap-md"
      >
        <h2 id="source-catalog-heading" className="text-h2 text-text-primary">
          Sample sources in this prototype
        </h2>
        {sources.length > 0 ? (
          <div className="flex flex-col gap-lg">
            {SOURCE_TYPES.map((info) => {
              const forType = sources.filter((s) => s.type === info.type);
              if (forType.length === 0) return null;
              return (
                <section
                  key={info.type}
                  aria-label={`${info.label} sources`}
                  className="flex flex-col gap-sm"
                >
                  <h3 className="text-h3 text-text-primary">
                    {TYPE_LABEL[info.type]}
                  </h3>
                  <ul className="flex list-none flex-wrap gap-xs p-0">
                    {forType.map((source) => (
                      <li key={source.id} className="inline-flex">
                        <SourceChip source={source} />
                      </li>
                    ))}
                  </ul>
                </section>
              );
            })}
          </div>
        ) : (
          <p className="text-body text-text-secondary">
            No sample sources are available in this prototype.
          </p>
        )}
        <p className="text-caption text-text-secondary">
          These sample sources are illustrative placeholders used to demonstrate
          how provenance is shown; they do not point to real publications.
        </p>
      </section>
    </div>
  );
}
