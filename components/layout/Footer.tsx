import Link from "next/link";

/**
 * Footer (Requirements 1.1, 20.1, 20.3)
 *
 * The persistent footer rendered by the root layout around every route
 * (Requirement 1.1).
 *
 * Accessibility:
 * - Rendered inside the `<footer>` landmark supplied by the root layout; here
 *   the internal groupings use `<nav>` landmarks with accessible names so
 *   assistive technology can distinguish them (Requirement 20.3).
 * - Uses list semantics for grouped links (Requirement 20.3) and all links are
 *   keyboard operable via next/link (Requirement 20.1).
 */

interface FooterLink {
  label: string;
  href: string;
}

interface FooterGroup {
  heading: string;
  links: FooterLink[];
}

const FOOTER_GROUPS: FooterGroup[] = [
  {
    heading: "Explore",
    links: [
      { label: "Products", href: "/products" },
      { label: "Ingredients", href: "/ingredients" },
      { label: "Additives", href: "/additives" },
      { label: "Compare", href: "/compare" },
      { label: "Countries", href: "/countries" },
      { label: "Recalls", href: "/recalls" },
    ],
  },
  {
    heading: "Transparency",
    links: [
      { label: "Methodology", href: "/methodology" },
      { label: "Sources", href: "/sources" },
      { label: "Medical disclaimer", href: "/medical-disclaimer" },
      { label: "Data policy", href: "/data-policy" },
    ],
  },
  {
    heading: "Company",
    links: [
      { label: "About", href: "/about" },
      { label: "Pricing", href: "/pricing" },
      { label: "Blog", href: "/blog" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/privacy" },
      { label: "Terms", href: "/terms" },
    ],
  },
];

const footerLinkClasses =
  "inline-flex rounded-md text-body text-text-secondary " +
  "transition-colors duration-fast ease-base hover:text-text-primary " +
  "focus:outline-none focus-visible:outline-none focus-visible:ring-2 " +
  "focus-visible:ring-focus focus-visible:ring-offset-2 focus-visible:ring-offset-background";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <div className="mx-auto w-full max-w-5xl px-lg py-xl">
      <div className="grid grid-cols-2 gap-lg md:grid-cols-4">
        {FOOTER_GROUPS.map((group) => (
          <nav key={group.heading} aria-label={group.heading}>
            <h2 className="text-label font-semibold text-text-primary">
              {group.heading}
            </h2>
            <ul className="mt-sm flex flex-col gap-xs">
              {group.links.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className={footerLinkClasses}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        ))}
      </div>

      <div className="mt-xl border-t border-border pt-md">
        <p className="text-caption text-text-muted">
          FoodSignal is a prototype. All data shown is mock/sample content and
          no real assessment is performed. &copy; {year} FoodSignal.
        </p>
      </div>
    </div>
  );
}

export default Footer;
