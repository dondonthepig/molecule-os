"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { dict } from "@/lib/i18n";
import { ORGANIC_CATEGORIES, type OrganicCategoryId } from "@/lib/chemistry/organic-chemistry";
import { getMolecule } from "@/lib/chemistry/molecules";
import { RelatedMolecules } from "./related-molecules";
import type { LearningMode } from "./learning-mode-toggle";

export function OrganicPropertiesPanel({
  categoryId,
  selectedMoleculeId,
  onSelectMolecule,
  learningMode,
  learnStep,
  className,
}: {
  categoryId: OrganicCategoryId;
  selectedMoleculeId: string;
  onSelectMolecule: (id: string) => void;
  learningMode: LearningMode;
  learnStep: number;
  className?: string;
}) {
  const category = ORGANIC_CATEGORIES[categoryId];
  const info = dict.organicChemistry.categories[categoryId];
  const fieldLabels = dict.organicChemistry.info;
  const actions = dict.organicChemistry.actions;
  const molecule = getMolecule(selectedMoleculeId);

  const showProperties = learningMode === "explore" || learnStep >= 2;
  const showMolecule = learningMode === "explore" || learnStep >= 3;
  const showReactions = learningMode === "explore" || learnStep >= 4;

  return (
    <div className={className}>
      {showProperties ? (
        <div>
          <p className="text-xs font-semibold text-brand-cyan">{fieldLabels.keyProperties}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{info.keyProperties}</p>
        </div>
      ) : null}

      {showMolecule ? (
        <div className="mt-6">
          <p className="text-xs font-semibold text-brand-cyan">{fieldLabels.representativeMolecules}</p>
          <div className="mt-3">
            <RelatedMolecules moleculeIds={category.representativeMoleculeIds} onSelect={onSelectMolecule} />
          </div>
          <Link
            href={`/molecule-library?molecule=${selectedMoleculeId}`}
            className="glass-subtle mt-3 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
          >
            {actions.viewInLibrary}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      ) : null}

      {showReactions ? (
        <div className="mt-6">
          <p className="text-xs font-semibold text-brand-cyan">{fieldLabels.commonReactions}</p>
          <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{info.commonReactions}</p>
          <Link
            href={`/bond-explorer?bondType=${molecule.bondTypeId}`}
            className="glass-subtle mt-3 inline-flex items-center justify-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
          >
            {actions.exploreBond}
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      ) : null}
    </div>
  );
}
