"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ChevronDown, Sparkles } from "lucide-react";
import { HeroBackground } from "./hero-background";
import { HeroMolecule } from "./hero-molecule";
import { Magnetic } from "@/components/motion/magnetic";
import { dict } from "@/lib/i18n";

const EASE = [0.16, 1, 0.3, 1] as const;

export function HeroSection() {
  return (
    <section className="relative flex min-h-[100svh] items-center overflow-hidden pt-28 pb-16">
      <HeroBackground />

      <div className="relative z-10 mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 px-6 sm:px-8 lg:grid-cols-2 lg:gap-8 lg:px-10">
        <div className="flex flex-col items-start text-left">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: EASE }}
            className="glass-subtle mb-6 inline-flex items-center gap-2 rounded-full px-3.5 py-1.5 text-xs font-medium text-muted-foreground"
          >
            <Sparkles className="size-3.5 text-brand-cyan" />
            {dict.hero.badge}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.05 }}
            className="text-4xl leading-[1.15] font-semibold tracking-tight text-balance sm:text-5xl lg:text-6xl"
          >
            {dict.hero.headlineLine1}
            <br />
            <span className="text-gradient-brand">{dict.hero.headlineLine2}</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.15 }}
            className="mt-6 max-w-lg text-base leading-relaxed text-muted-foreground sm:text-lg"
          >
            {dict.hero.subheadline}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.75, ease: EASE, delay: 0.25 }}
            className="mt-10 flex flex-col gap-3 sm:flex-row sm:items-center"
          >
            <Magnetic strength={0.25} range={70}>
              <Link
                href="/bond-explorer"
                className="group inline-flex h-12 items-center justify-center gap-2 rounded-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple px-7 text-sm font-medium text-white shadow-[0_0_30px_-8px_var(--color-brand-blue)] transition-transform hover:scale-[1.02] active:scale-[0.98]"
              >
                {dict.hero.ctaPrimary}
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Magnetic>
            <Magnetic strength={0.25} range={70}>
              <Link
                href="/molecule-library"
                className="glass-subtle inline-flex h-12 items-center justify-center gap-2 rounded-full px-7 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
              >
                {dict.hero.ctaSecondary}
              </Link>
            </Magnetic>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-12 flex items-center gap-6 text-xs text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <span className="flex h-6 -space-x-2">
                {["#4361ee", "#4cc9f0", "#2b3566"].map((color) => (
                  <span
                    key={color}
                    className="size-6 rounded-full border-2 border-background"
                    style={{ backgroundColor: color }}
                  />
                ))}
              </span>
              {dict.hero.trustedBy}
            </div>
          </motion.div>
        </div>

        <div className="relative flex items-center justify-center lg:justify-end">
          <HeroMolecule />
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9, duration: 0.6 }}
        className="absolute bottom-6 left-1/2 hidden -translate-x-1/2 flex-col items-center gap-1.5 text-muted-foreground sm:flex"
      >
        <span className="text-[11px] tracking-wide">{dict.hero.scroll}</span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
        >
          <ChevronDown className="size-4" />
        </motion.div>
      </motion.div>
    </section>
  );
}
