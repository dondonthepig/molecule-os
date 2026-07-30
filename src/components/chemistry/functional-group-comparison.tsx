"use client";

import { X } from "lucide-react";
import { dict } from "@/lib/i18n";
import { ORGANIC_CATEGORY_IDS, ORGANIC_CATEGORIES, type OrganicCategoryId } from "@/lib/chemistry/organic-chemistry";
import { getLibraryEntry } from "@/lib/chemistry/molecule-library-data";
import { AtomVisualization } from "./atom-visualization";
import { FunctionalGroupBadge } from "./functional-group-badge";
import { PolarityIndicator } from "./polarity-indicator";

function CategoryColumn({ categoryId }: { categoryId: OrganicCategoryId }) {
  const category = ORGANIC_CATEGORIES[categoryId];
  const names = dict.organicChemistry.categoryNames[categoryId];
  const info = dict.organicChemistry.categories[categoryId];
  const fieldLabels = dict.organicChemistry.info;
  const moleculeId = category.representativeMoleculeIds[0];
  const entry = getLibraryEntry(moleculeId);

  return (
    <div className="glass-subtle rounded-2xl border-border/60 p-5">
      <div className="flex items-baseline justify-between gap-2">
        <h4 className="text-base font-semibold text-foreground">{names.nameZh}</h4>
        <span className="text-xs text-muted-foreground">{names.nameEn}</span>
      </div>

      <div className="mt-3 h-24">
        <AtomVisualization moleculeId={moleculeId} size="lg" />
      </div>

      {category.functionalGroupId ? (
        <div className="mt-3">
          <FunctionalGroupBadge id={category.functionalGroupId} />
        </div>
      ) : null}

      <dl className="mt-4 space-y-3 text-sm">
        <div>
          <dt className="text-xs text-muted-foreground">{fieldLabels.generalStructure}</dt>
          <dd className="mt-0.5 text-foreground/90">{info.generalStructure}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{fieldLabels.bondPattern}</dt>
          <dd className="mt-0.5 text-foreground/90">{info.bondPattern}</dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{fieldLabels.polarity}</dt>
          <dd className="mt-0.5">
            <PolarityIndicator polarity={entry.polarity} />
          </dd>
        </div>
        <div>
          <dt className="text-xs text-muted-foreground">{fieldLabels.commonReactions}</dt>
          <dd className="mt-0.5 text-foreground/90">{info.commonReactions}</dd>
        </div>
      </dl>
    </div>
  );
}

export function FunctionalGroupComparison({
  categoryA,
  categoryB,
  onChangeB,
  onClose,
}: {
  categoryA: OrganicCategoryId;
  categoryB: OrganicCategoryId | null;
  onChangeB: (id: OrganicCategoryId) => void;
  onClose: () => void;
}) {
  const actions = dict.organicChemistry.actions;

  return (
    <div className="glass-subtle rounded-3xl border-border/60 p-5">
      <div className="flex items-center justify-between">
        <p className="text-sm font-semibold text-foreground">{dict.organicChemistry.sections.comparison}</p>
        <button
          type="button"
          onClick={onClose}
          aria-label={dict.moleculeLibrary.detail.close}
          className="inline-flex size-8 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted/40 hover:text-foreground"
        >
          <X className="size-4" />
        </button>
      </div>

      <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
        <CategoryColumn categoryId={categoryA} />

        {categoryB ? (
          <CategoryColumn categoryId={categoryB} />
        ) : (
          <div className="glass-subtle flex flex-col items-center justify-center gap-3 rounded-2xl border-border/60 p-5 text-center">
            <p className="text-sm text-muted-foreground">{actions.selectSecond}</p>
            <select
              value=""
              onChange={(e) => onChangeB(e.target.value as OrganicCategoryId)}
              className="glass-subtle rounded-lg border-border/60 px-3 py-1.5 text-sm text-foreground"
            >
              <option value="" disabled>
                {actions.compareWith}
              </option>
              {ORGANIC_CATEGORY_IDS.filter((id) => id !== categoryA).map((id) => (
                <option key={id} value={id}>
                  {dict.organicChemistry.categoryNames[id].nameZh}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>
    </div>
  );
}
