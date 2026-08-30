import type { Metadata } from "next";
import { Card } from "@/components/primitives";

/**
 * Blog index (`/blog`) — Requirements 18.1, 19.1, 19.2, 22.1.
 *
 * Editorial index listing sample post entries. This is a static prototype
 * layout: the entries are illustrative and do not navigate to real articles.
 * Copy is plain-language and non-alarmist (Requirement 19.2).
 *
 * Server component with a single `<h1>` and semantic sections (Requirements
 * 5.2, 20.3).
 */
export const metadata: Metadata = {
  title: "Blog — FoodSignal",
  description:
    "Editorial writing from FoodSignal on reading food labels, understanding evidence, and how regulatory context differs across markets. Sample entries in the prototype.",
};

interface Post {
  title: string;
  category: string;
  date: string;
  readableDate: string;
  excerpt: string;
}

const posts: ReadonlyArray<Post> = [
  {
    title: "How to read a food label without the panic",
    category: "Reading labels",
    date: "2024-05-14",
    readableDate: "14 May 2024",
    excerpt:
      "A calm, step-by-step look at ingredient lists, allergen statements, and nutrition panels — and what they can and cannot tell you.",
  },
  {
    title: "Confidence is not the same as safety",
    category: "Evidence",
    date: "2024-04-02",
    readableDate: "2 April 2024",
    excerpt:
      "Why we show how much is known about a product separately from its safety status, and how to read the two together.",
  },
  {
    title: "The same additive, different rules",
    category: "Regulation",
    date: "2024-03-11",
    readableDate: "11 March 2024",
    excerpt:
      "Regulatory context differs from market to market. Here is how to make sense of a substance's status across regions.",
  },
  {
    title: "What a recall notice actually means",
    category: "Recalls",
    date: "2024-02-05",
    readableDate: "5 February 2024",
    excerpt:
      "A plain-language guide to recall notices — who issues them, what they cover, and how to check the sources.",
  },
];

export default function BlogPage() {
  return (
    <div className="mx-auto flex w-full max-w-3xl flex-col gap-xl px-lg py-2xl">
      <header className="flex flex-col gap-sm">
        <h1 className="text-h1 font-display text-text-primary">Blog</h1>
        <p className="text-body text-text-secondary">
          Writing on reading food labels, understanding the evidence behind them,
          and how regulatory context differs across markets.
        </p>
      </header>

      <div
        role="note"
        className="rounded-md border border-border bg-surface-muted px-md py-sm text-caption text-text-secondary"
      >
        <span className="font-semibold text-text-primary">Prototype note:</span>{" "}
        These entries are samples that illustrate the editorial layout. They do
        not link to full articles in this prototype.
      </div>

      <section aria-labelledby="posts-heading" className="flex flex-col gap-md">
        <h2 id="posts-heading" className="text-h2 text-text-primary">
          Latest entries
        </h2>
        <ul className="flex flex-col gap-md">
          {posts.map((post) => (
            <li key={post.title}>
              <Card
                as="article"
                padding="lg"
                aria-labelledby={`post-${post.date}-title`}
                className="flex flex-col gap-xs"
              >
                <p className="flex flex-wrap items-center gap-sm text-caption text-text-secondary">
                  <span className="font-semibold text-text-primary">
                    {post.category}
                  </span>
                  <span aria-hidden="true">&middot;</span>
                  <time dateTime={post.date}>{post.readableDate}</time>
                </p>
                <h3 id={`post-${post.date}-title`} className="text-h3 text-text-primary">
                  {post.title}
                </h3>
                <p className="text-body text-text-secondary">{post.excerpt}</p>
                <p className="text-caption text-text-muted">
                  Full article not available in the prototype.
                </p>
              </Card>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
