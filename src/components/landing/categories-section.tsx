"use client";

import { motion } from "framer-motion";
import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { DEMO_CATEGORIES } from "@/lib/mock-data";
import { dict } from "@/lib/i18n";

const ACCENT_GRADIENT: Record<string, string> = {
  blue: "from-brand-blue/25 to-transparent",
  cyan: "from-brand-cyan/25 to-transparent",
  purple: "from-brand-purple/25 to-transparent",
};

export function CategoriesSection() {
  return (
    <section className="relative px-6 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold text-brand-cyan">
              {dict.categories.eyebrow}
            </p>
            <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {dict.categories.heading}
            </h2>
          </div>
          <DemoDataBadge />
        </Reveal>

        <RevealGroup className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {DEMO_CATEGORIES.map((category) => (
            <RevealItem key={category.id}>
              <motion.div
                whileHover={{ y: -4 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="glass-subtle group relative h-full overflow-hidden rounded-2xl border-border/60 p-6"
              >
                <div
                  className={`pointer-events-none absolute -top-10 -right-10 size-32 rounded-full bg-gradient-to-br blur-2xl ${ACCENT_GRADIENT[category.accent]}`}
                />
                <div className="relative">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-medium text-foreground">
                      {category.name}
                    </h3>
                    <span className="font-mono text-xs text-muted-foreground">
                      {category.count}
                    </span>
                  </div>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {category.description}
                  </p>
                </div>
              </motion.div>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
