"use client";

import { AnimatePresence, motion } from "framer-motion";
import { dict } from "@/lib/i18n";
import type { BondTypeId } from "@/lib/chemistry/bond-types";
import type { LearningMode } from "./learning-mode-toggle";

const DETAIL_FIELDS = [
  "formation",
  "electronBehavior",
  "characteristics",
  "typicalExamples",
  "commonSubstances",
  "realWorldUses",
  "misconceptions",
] as const;

export function BondInfoPanel({
  bondTypeId,
  learningMode,
  className,
}: {
  bondTypeId: BondTypeId;
  learningMode: LearningMode;
  className?: string;
}) {
  const bond = dict.bondExplorer.bonds[bondTypeId];
  const info = dict.bondExplorer.info;

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={bondTypeId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold text-foreground">{bond.nameZh}</h3>
            <span className="text-xs text-muted-foreground">{bond.nameEn}</span>
          </div>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{bond.tagline}</p>

          {learningMode === "learn" ? (
            <dl className="mt-6 space-y-5">
              {DETAIL_FIELDS.map((field) => (
                <div key={field}>
                  <dt className="text-xs font-semibold text-brand-cyan">{info[field]}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-foreground/90">{bond[field]}</dd>
                </div>
              ))}
            </dl>
          ) : (
            <p className="mt-6 text-xs text-muted-foreground">
              {dict.bondExplorer.modeToggle.learn} → {info.formation} · {info.electronBehavior} · {info.characteristics}
            </p>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
