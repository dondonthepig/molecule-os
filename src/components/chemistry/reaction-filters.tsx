"use client";

import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import type { ReactionTypeId } from "@/lib/chemistry/organic-reactions";
import type { OrganicCategoryId } from "@/lib/chemistry/organic-chemistry";
import type { ReactionDifficulty } from "@/lib/chemistry/reactions";

export type ReactionFiltersState = {
  types: Set<ReactionTypeId>;
  categories: Set<OrganicCategoryId>;
  difficulty: "all" | ReactionDifficulty;
};

export function ReactionFilters({
  state,
  typeIds,
  categoryIds,
  onToggleType,
  onToggleCategory,
  onChangeDifficulty,
  onClearAll,
  className,
}: {
  state: ReactionFiltersState;
  typeIds: ReactionTypeId[];
  categoryIds: OrganicCategoryId[];
  onToggleType: (id: ReactionTypeId) => void;
  onToggleCategory: (id: OrganicCategoryId) => void;
  onChangeDifficulty: (difficulty: "all" | ReactionDifficulty) => void;
  onClearAll: () => void;
  className?: string;
}) {
  const f = dict.reactionAtlas.filters;
  const difficultyOptions: { id: "all" | ReactionDifficulty; label: string }[] = [
    { id: "all", label: dict.moleculeLibrary.filters.polarityAll },
    { id: "beginner", label: dict.reactionAtlas.difficulty.beginner },
    { id: "intermediate", label: dict.reactionAtlas.difficulty.intermediate },
    { id: "advanced", label: dict.reactionAtlas.difficulty.advanced },
  ];

  return (
    <div className={cn("flex flex-col", className)}>
      <div className="flex items-center justify-between pb-4">
        <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">{f.title}</h3>
        <button
          type="button"
          onClick={onClearAll}
          className="text-xs text-muted-foreground transition-colors hover:text-foreground"
        >
          {f.clearAll}
        </button>
      </div>

      <div className="border-t border-border/40 py-4">
        <p className="text-xs font-medium text-foreground">{f.typeLabel}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {typeIds.map((id) => {
            const active = state.types.has(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggleType(id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "border-brand-blue/50 bg-brand-blue/15 text-brand-blue"
                    : "border-border/60 text-muted-foreground hover:bg-muted/25",
                )}
              >
                {dict.organicChemistry.reactionTypes[id]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border/40 py-4">
        <p className="text-xs font-medium text-foreground">{f.categoryLabel}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {categoryIds.map((id) => {
            const active = state.categories.has(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggleCategory(id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  active
                    ? "border-brand-purple/50 bg-brand-purple/15 text-brand-purple"
                    : "border-border/60 text-muted-foreground hover:bg-muted/25",
                )}
              >
                {dict.organicChemistry.categoryNames[id].nameZh}
              </button>
            );
          })}
        </div>
      </div>

      <div className="border-t border-border/40 py-4">
        <p className="text-xs font-medium text-foreground">{f.difficultyLabel}</p>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {difficultyOptions.map((option) => {
            const active = state.difficulty === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChangeDifficulty(option.id)}
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
    </div>
  );
}
