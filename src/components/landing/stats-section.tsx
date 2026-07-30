"use client";

import { Reveal, RevealGroup, RevealItem } from "@/components/motion/reveal";
import { CountUp } from "@/components/motion/count-up";
import { DemoDataBadge } from "@/components/ui/demo-data-badge";
import { DEMO_STATS } from "@/lib/mock-data";
import { dict } from "@/lib/i18n";

export function StatsSection() {
  return (
    <section className="relative px-6 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="glass-subtle relative overflow-hidden rounded-3xl border-border/60 px-6 py-14 sm:px-12">
          <div className="pointer-events-none absolute inset-0 bg-gradient-aurora opacity-40" />

          <Reveal className="relative flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">
              {dict.stats.heading}
            </h2>
            <DemoDataBadge />
          </Reveal>

          <RevealGroup className="relative mt-10 grid grid-cols-2 gap-8 lg:grid-cols-4">
            {DEMO_STATS.map((stat) => (
              <RevealItem key={stat.id} className="text-center lg:text-left">
                <div className="text-3xl font-semibold tracking-tight text-gradient-brand sm:text-4xl">
                  {stat.prefix}
                  <CountUp value={stat.value} />
                  {stat.suffix}
                </div>
                <p className="mt-2 text-sm text-muted-foreground">{stat.label}</p>
              </RevealItem>
            ))}
          </RevealGroup>
        </div>
      </div>
    </section>
  );
}
