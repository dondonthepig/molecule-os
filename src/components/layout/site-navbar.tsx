"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Atom, Menu } from "lucide-react";
import { PRIMARY_NAV_ITEMS } from "@/lib/nav-items";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { MobileNav } from "@/components/layout/mobile-nav";
import { Magnetic } from "@/components/motion/magnetic";
import { dict } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;

export function SiteNavbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileOpen, setMobileOpen] = React.useState(false);

  React.useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ opacity: 0, y: -16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: EASE }}
        className="fixed inset-x-0 top-0 z-50 flex justify-center px-3 pt-3 sm:px-4 sm:pt-4"
      >
        <div
          className={cn(
            "flex w-full max-w-6xl items-center justify-between gap-3 rounded-2xl border px-3 py-2 transition-all duration-500",
            scrolled
              ? "glass border-border/60 shadow-[0_8px_30px_-12px_rgba(0,0,0,0.5)]"
              : "border-transparent bg-transparent",
          )}
        >
          <Link
            href="/"
            className="group flex items-center gap-2.5 rounded-full py-1 pl-1 pr-3 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
          >
            <span className="relative flex size-8 items-center justify-center rounded-xl bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-purple shadow-[0_0_18px_-4px_var(--color-brand-blue)] transition-transform duration-300 group-hover:scale-105">
              <Atom className="size-4.5 text-white" strokeWidth={2.25} />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-foreground">
              MoleculeOS
            </span>
          </Link>

          <nav className="hidden items-center gap-0.5 xl:flex">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const active = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "relative rounded-full px-3 py-1.5 text-[13px] font-medium tracking-tight text-muted-foreground transition-colors hover:text-foreground",
                    active && "text-foreground",
                  )}
                >
                  {active ? (
                    <motion.span
                      layoutId="nav-active-pill"
                      className="absolute inset-0 rounded-full bg-muted"
                      transition={{ type: "spring", stiffness: 400, damping: 32 }}
                    />
                  ) : null}
                  <span className="relative">{item.label}</span>
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle className="hidden sm:inline-flex" />
            <Magnetic className="hidden sm:block" strength={0.3} range={60}>
              <Link
                href="/bond-explorer"
                className="inline-flex h-8 items-center justify-center rounded-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple px-4 text-[13px] font-medium text-white shadow-[0_0_20px_-6px_var(--color-brand-blue)] transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                {dict.nav.ctaStartExploring}
              </Link>
            </Magnetic>
            <button
              type="button"
              aria-label={dict.nav.ariaOpenMenu}
              aria-expanded={mobileOpen}
              aria-haspopup="dialog"
              onClick={() => setMobileOpen(true)}
              className="inline-flex size-8 items-center justify-center rounded-full border border-border/60 text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50 xl:hidden"
            >
              <Menu className="size-4" />
            </button>
          </div>
        </div>
      </motion.header>

      <MobileNav open={mobileOpen} onOpenChange={setMobileOpen} />
    </>
  );
}
