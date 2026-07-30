"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import { Reveal } from "@/components/motion/reveal";
import {
  OrbitVisual,
  ReactionFlowVisual,
  PeriodicSwatchVisual,
  ChatTypingVisual,
  QuizProgressVisual,
  KnowledgeGraphVisual,
} from "./feature-visuals";
import { dict } from "@/lib/i18n";

type FeatureCard = {
  title: string;
  description: string;
  href: string;
  visual: React.ReactNode;
  span: string;
};

const FEATURES: FeatureCard[] = [
  {
    title: dict.features.items.bondExplorer.title,
    description: dict.features.items.bondExplorer.description,
    href: "/bond-explorer",
    visual: <OrbitVisual />,
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: dict.features.items.reactionAtlas.title,
    description: dict.features.items.reactionAtlas.description,
    href: "/reaction-atlas",
    visual: <ReactionFlowVisual />,
    span: "md:col-span-2",
  },
  {
    title: dict.features.items.periodicTable.title,
    description: dict.features.items.periodicTable.description,
    href: "/periodic-table",
    visual: <PeriodicSwatchVisual />,
    span: "md:col-span-2 md:row-span-2",
  },
  {
    title: dict.features.items.aiTutor.title,
    description: dict.features.items.aiTutor.description,
    href: "/ai-tutor",
    visual: <ChatTypingVisual />,
    span: "md:col-span-2",
  },
  {
    title: dict.features.items.quizCenter.title,
    description: dict.features.items.quizCenter.description,
    href: "/quiz",
    visual: <QuizProgressVisual />,
    span: "md:col-span-3",
  },
  {
    title: dict.features.items.organicGraph.title,
    description: dict.features.items.organicGraph.description,
    href: "/organic-chemistry",
    visual: <KnowledgeGraphVisual />,
    span: "md:col-span-3",
  },
];

export function FeaturesSection() {
  return (
    <section id="features" className="relative px-6 py-24 sm:px-8 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <Reveal>
          <p className="text-xs font-semibold text-brand-cyan">{dict.features.eyebrow}</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-semibold tracking-tight text-balance sm:text-4xl">
            {dict.features.headingPrefix}
            <span className="text-gradient-brand">{dict.features.headingHighlight}</span>
            {dict.features.headingSuffix}
          </h2>
        </Reveal>

        <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-6 md:auto-rows-[210px]">
          {FEATURES.map((feature, i) => (
            <Reveal key={feature.href} delay={i * 0.05} className={feature.span}>
              <Link href={feature.href} className="group block h-full">
                <motion.div
                  whileHover={{ y: -3 }}
                  transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                  className="glass-subtle flex h-full flex-col overflow-hidden rounded-2xl border-border/60 p-6 transition-colors group-hover:border-brand-blue/40"
                >
                  <div className="h-40 shrink-0 md:h-auto md:min-h-0 md:flex-1">
                    {feature.visual}
                  </div>
                  <div className="mt-4">
                    <div className="flex items-center gap-1.5">
                      <h3 className="text-base font-medium text-foreground">
                        {feature.title}
                      </h3>
                      <ArrowUpRight className="size-3.5 text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100" />
                    </div>
                    <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                </motion.div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
