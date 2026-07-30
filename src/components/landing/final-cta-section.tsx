"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import { Magnetic } from "@/components/motion/magnetic";
import { dict } from "@/lib/i18n";

export function FinalCtaSection() {
  return (
    <section className="relative px-6 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl">
        <Reveal className="relative overflow-hidden rounded-3xl border border-border/60 bg-gradient-to-br from-brand-blue/15 via-brand-cyan/10 to-brand-purple/15 px-8 py-16 text-center sm:px-16">
          <div className="pointer-events-none absolute inset-0 bg-grid-fade opacity-30" />
          <div className="relative">
            <h2 className="text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
              {dict.finalCta.heading}
            </h2>
            <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
              {dict.finalCta.paragraph}
            </p>
            <div className="mt-8 flex justify-center">
              <Magnetic strength={0.25} range={80}>
                <Link
                  href="/bond-explorer"
                  className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple px-8 text-sm font-medium text-white shadow-[0_0_30px_-8px_var(--color-brand-blue)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  {dict.finalCta.cta}
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Magnetic>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
