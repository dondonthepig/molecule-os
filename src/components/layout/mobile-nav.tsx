"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";
import { NAV_ITEMS } from "@/lib/nav-items";
import { cn } from "@/lib/utils";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { dict } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;

export function MobileNav({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const pathname = usePathname();
  const closeButtonRef = React.useRef<HTMLButtonElement>(null);
  const triggerRef = React.useRef<Element | null>(null);

  React.useEffect(() => {
    if (!open) return;

    triggerRef.current = document.activeElement;
    closeButtonRef.current?.focus();

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") onOpenChange(false);
    };
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", handleKeyDown);
      if (triggerRef.current instanceof HTMLElement) {
        triggerRef.current.focus();
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const [prevPathname, setPrevPathname] = React.useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    if (open) onOpenChange(false);
  }

  return (
    <AnimatePresence>
      {open ? (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={dict.mobileNav.ariaDialog}
          className="fixed inset-0 z-[60] flex flex-col bg-background/95 backdrop-blur-2xl xl:hidden"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25, ease: EASE }}
        >
          <div className="flex items-center justify-between px-6 py-5">
            <span className="text-sm font-medium tracking-wide text-muted-foreground">
              {dict.mobileNav.menuLabel}
            </span>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <button
                ref={closeButtonRef}
                type="button"
                aria-label={dict.mobileNav.ariaCloseMenu}
                onClick={() => onOpenChange(false)}
                className="inline-flex size-9 items-center justify-center rounded-full border border-border/60 text-foreground transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          <nav className="flex flex-1 flex-col justify-center gap-1 px-6 pb-16">
            {NAV_ITEMS.map((item, i) => {
              const active = pathname === item.href;
              return (
                <motion.div
                  key={item.href}
                  initial={{ opacity: 0, y: 16 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.05 + i * 0.045, ease: EASE }}
                >
                  <Link
                    href={item.href}
                    className={cn(
                      "group flex items-center justify-between gap-4 border-b border-border/40 py-4 text-2xl font-medium tracking-tight transition-colors sm:text-3xl",
                      active
                        ? "text-gradient-brand"
                        : "text-foreground/80 hover:text-foreground",
                    )}
                  >
                    <span className="flex items-center gap-4">
                      <item.icon className="size-5 text-muted-foreground transition-colors group-hover:text-brand-cyan" />
                      {item.label}
                    </span>
                    <span className="hidden text-sm font-normal text-muted-foreground sm:block">
                      {item.description}
                    </span>
                  </Link>
                </motion.div>
              );
            })}
          </nav>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
