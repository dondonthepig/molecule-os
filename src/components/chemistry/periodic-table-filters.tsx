"use client";

import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ELEMENT_CATEGORY_IDS, CATEGORY_COLORS, type ElementCategory, type ElementState } from "@/lib/chemistry/periodic-table";

export type PeriodicTableFiltersState = {
  categories: Set<ElementCategory>;
  state: "all" | ElementState;
};

export function PeriodicTableFilters({
  state,
  onToggleCategory,
  onChangeState,
  onClearAll,
  className,
}: {
  state: PeriodicTableFiltersState;
  onToggleCategory: (id: ElementCategory) => void;
  onChangeState: (value: "all" | ElementState) => void;
  onClearAll: () => void;
  className?: string;
}) {
  const f = dict.periodicTable.filters;
  const stateOptions: { id: "all" | ElementState; label: string }[] = [
    { id: "all", label: dict.moleculeLibrary.filters.polarityAll },
    { id: "solid", label: dict.periodicTable.states.solid },
    { id: "liquid", label: dict.periodicTable.states.liquid },
    { id: "gas", label: dict.periodicTable.states.gas },
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
          {ELEMENT_CATEGORY_IDS.map((id) => {
            const active = state.categories.has(id);
            return (
              <button
                key={id}
                type="button"
                onClick={() => onToggleCategory(id)}
                style={active ? { borderColor: CATEGORY_COLORS[id], backgroundColor: `color-mix(in oklab, ${CATEGORY_COLORS[id]} 20%, transparent)`, color: CATEGORY_COLORS[id] } : undefined}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors",
                  !active && "border-border/60 text-muted-foreground hover:bg-muted/25",
                )}
              >
                {dict.periodicTable.categories[id]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-muted-foreground">{f.stateLabel}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {stateOptions.map((option) => {
            const active = state.state === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => onChangeState(option.id)}
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
