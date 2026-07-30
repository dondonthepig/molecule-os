"use client";

import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { MOLECULE_CATEGORY_IDS, type MoleculeCategory, type Polarity } from "@/lib/chemistry/molecule-library-data";
import { FUNCTIONAL_GROUP_IDS, type FunctionalGroupId } from "@/lib/chemistry/functional-groups";

export type MoleculeFiltersState = {
  categories: Set<MoleculeCategory>;
  functionalGroups: Set<FunctionalGroupId>;
  polarity: "all" | Polarity;
  weightRange: [number, number];
  atomCountRange: [number, number];
};

export function MoleculeFilters({
  state,
  weightBounds,
  atomCountBounds,
  onToggleCategory,
  onToggleFunctionalGroup,
  onChangePolarity,
  onChangeWeightRange,
  onChangeAtomCountRange,
  onClearAll,
  className,
}: {
  state: MoleculeFiltersState;
  weightBounds: [number, number];
  atomCountBounds: [number, number];
  onToggleCategory: (category: MoleculeCategory) => void;
  onToggleFunctionalGroup: (id: FunctionalGroupId) => void;
  onChangePolarity: (polarity: "all" | Polarity) => void;
  onChangeWeightRange: (range: [number, number]) => void;
  onChangeAtomCountRange: (range: [number, number]) => void;
  onClearAll: () => void;
  className?: string;
}) {
  const f = dict.moleculeLibrary.filters;
  const polarityOptions: { id: "all" | Polarity; label: string }[] = [
    { id: "all", label: f.polarityAll },
    { id: "polar", label: f.polarityPolar },
    { id: "nonpolar", label: f.polarityNonpolar },
    { id: "ionic", label: f.polarityIonic },
  ];

  return (
    <div className={cn("glass-subtle rounded-2xl border-border/60 p-5", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {f.clearAll}
        </button>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-muted-foreground">{f.categoryLabel}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {MOLECULE_CATEGORY_IDS.map((category) => {
            const active = state.categories.has(category);
            return (
              <button
                key={category}
                type="button"
                onClick={() => onToggleCategory(category)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "border-brand-blue/50 bg-brand-blue/15 text-brand-blue"
                    : "border-border/60 text-muted-foreground hover:bg-muted/25",
                )}
              >
                {dict.moleculeLibrary.categories[category]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-muted-foreground">{f.functionalGroupLabel}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {FUNCTIONAL_GROUP_IDS.map((groupId) => {
            const active = state.functionalGroups.has(groupId);
            return (
              <button
                key={groupId}
                type="button"
                onClick={() => onToggleFunctionalGroup(groupId)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "border-brand-purple/50 bg-brand-purple/15 text-brand-purple"
                    : "border-border/60 text-muted-foreground hover:bg-muted/25",
                )}
              >
                {dict.moleculeLibrary.functionalGroups[groupId].name}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-muted-foreground">{f.polarityLabel}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {polarityOptions.map((option) => {
            const active = state.polarity === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChangePolarity(option.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "border-brand-cyan/50 bg-brand-cyan/15 text-brand-cyan"
                    : "border-border/60 text-muted-foreground hover:bg-muted/25",
                )}
              >
                {option.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4 grid grid-cols-2 gap-4">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{f.weightLabel}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <input
              type="number"
              value={state.weightRange[0]}
              min={weightBounds[0]}
              max={state.weightRange[1]}
              onChange={(e) => onChangeWeightRange([Number(e.target.value), state.weightRange[1]])}
              className="glass-subtle w-full rounded-lg border-border/60 px-2 py-1 text-xs text-foreground focus:outline-none"
            />
            <span className="text-xs text-muted-foreground">–</span>
            <input
              type="number"
              value={state.weightRange[1]}
              min={state.weightRange[0]}
              max={weightBounds[1]}
              onChange={(e) => onChangeWeightRange([state.weightRange[0], Number(e.target.value)])}
              className="glass-subtle w-full rounded-lg border-border/60 px-2 py-1 text-xs text-foreground focus:outline-none"
            />
          </div>
        </div>
        <div>
          <p className="text-xs font-medium text-muted-foreground">{f.atomCountLabel}</p>
          <div className="mt-2 flex items-center gap-1.5">
            <input
              type="number"
              value={state.atomCountRange[0]}
              min={atomCountBounds[0]}
              max={state.atomCountRange[1]}
              onChange={(e) => onChangeAtomCountRange([Number(e.target.value), state.atomCountRange[1]])}
              className="glass-subtle w-full rounded-lg border-border/60 px-2 py-1 text-xs text-foreground focus:outline-none"
            />
            <span className="text-xs text-muted-foreground">–</span>
            <input
              type="number"
              value={state.atomCountRange[1]}
              min={state.atomCountRange[0]}
              max={atomCountBounds[1]}
              onChange={(e) => onChangeAtomCountRange([state.atomCountRange[0], Number(e.target.value)])}
              className="glass-subtle w-full rounded-lg border-border/60 px-2 py-1 text-xs text-foreground focus:outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
