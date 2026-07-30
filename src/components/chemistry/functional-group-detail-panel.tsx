"use client";

import { AnimatePresence, motion } from "framer-motion";
import { dict } from "@/lib/i18n";
import { ORGANIC_CATEGORIES, type OrganicCategoryId } from "@/lib/chemistry/organic-chemistry";
import { getLibraryEntry } from "@/lib/chemistry/molecule-library-data";
import { PolarityIndicator } from "./polarity-indicator";
import { FunctionalGroupBadge } from "./functional-group-badge";
import type { LearningMode } from "./learning-mode-toggle";

const STEP_FIELDS = ["characteristicAtoms", "bondPattern"] as const;

export function FunctionalGroupDetailPanel({
  categoryId,
  learningMode,
  learnStep,
  className,
}: {
  categoryId: OrganicCategoryId;
  learningMode: LearningMode;
  learnStep: number;
  className?: string;
}) {
  const category = ORGANIC_CATEGORIES[categoryId];
  const info = dict.organicChemistry.categories[categoryId];
  const names = dict.organicChemistry.categoryNames[categoryId];
  const fieldLabels = dict.organicChemistry.info;
  const primaryMolecule = getLibraryEntry(category.representativeMoleculeIds[0]);

  const showStructure = learningMode === "explore" || learnStep >= 1;

  return (
    <div className={className}>
      <AnimatePresence mode="wait">
        <motion.div
          key={categoryId}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="flex items-baseline justify-between gap-3">
            <h3 className="text-lg font-semibold text-foreground">{names.nameZh}</h3>
            <span className="text-xs text-muted-foreground">{names.nameEn}</span>
          </div>

          {category.functionalGroupId ? (
            <div className="mt-2">
              <FunctionalGroupBadge id={category.functionalGroupId} />
            </div>
          ) : null}

          <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{info.generalStructure}</p>

          <div className="mt-3">
            <PolarityIndicator polarity={primaryMolecule.polarity} />
          </div>

          {showStructure ? (
            <dl className="mt-6 space-y-4">
              {STEP_FIELDS.map((field) => (
                <div key={field}>
                  <dt className="text-xs font-semibold text-brand-cyan">{fieldLabels[field]}</dt>
                  <dd className="mt-1.5 text-sm leading-relaxed text-foreground/90">{info[field]}</dd>
                </div>
              ))}
            </dl>
          ) : null}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
