import Link from "next/link";
import { Atom, Globe, MessageCircle, Rss } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-items";
import { dict } from "@/lib/i18n";

const EXPLORE_LINKS = NAV_ITEMS.filter((item) =>
  ["/bond-explorer", "/organic-chemistry", "/molecule-library", "/reaction-atlas", "/periodic-table"].includes(
    item.href,
  ),
);

const LEARN_LINKS = NAV_ITEMS.filter((item) =>
  ["/ai-tutor", "/quiz", "/settings"].includes(item.href),
);

const COMPANY_LINKS = [
  { label: dict.footer.companyLinks.about, href: "#" },
  { label: dict.footer.companyLinks.careers, href: "#" },
  { label: dict.footer.companyLinks.blog, href: "#" },
  { label: dict.footer.companyLinks.contact, href: "#" },
];

const SOCIALS = [
  { label: dict.footer.socials.website, href: "#", icon: Globe },
  { label: dict.footer.socials.community, href: "#", icon: MessageCircle },
  { label: dict.footer.socials.updates, href: "#", icon: Rss },
];

export function SiteFooter() {
  return (
    <footer className="relative mt-24 border-t border-border/60">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-blue/60 to-transparent" />

      <div className="mx-auto max-w-7xl px-6 py-16 sm:px-8 lg:px-10">
        <div className="grid grid-cols-2 gap-10 sm:grid-cols-2 md:grid-cols-6">
          <div className="col-span-2 md:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-purple">
                <Atom className="size-4.5 text-white" strokeWidth={2.25} />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-foreground">
                MoleculeOS
              </span>
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              {dict.footer.tagline}
            </p>
            <div className="mt-6 flex items-center gap-2">
              {SOCIALS.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:border-brand-blue/40 hover:text-foreground"
                >
                  <social.icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-foreground">
              {dict.footer.columnExplore}
            </h3>
            <ul className="mt-4 space-y-3">
              {EXPLORE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-foreground">
              {dict.footer.columnLearn}
            </h3>
            <ul className="mt-4 space-y-3">
              {LEARN_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-xs font-semibold tracking-wide text-foreground">
              {dict.footer.columnCompany}
            </h3>
            <ul className="mt-4 space-y-3">
              {COMPANY_LINKS.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 flex flex-col items-start justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} MoleculeOS. {dict.footer.copyright}
          </p>
          <p className="text-xs text-muted-foreground">{dict.footer.builtFor}</p>
        </div>
      </div>
    </footer>
  );
}
