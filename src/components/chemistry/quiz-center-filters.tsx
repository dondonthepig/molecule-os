"use client";

import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { QUIZ_CATEGORY_IDS, QUIZ_DIFFICULTIES, type QuizCategoryId, type QuizDifficulty } from "@/lib/chemistry/quiz-center-data";

export type QuizFiltersState = {
  categories: Set<QuizCategoryId>;
  difficulty: "all" | QuizDifficulty;
};

export function QuizCenterFilters({
  state,
  onToggleCategory,
  onChangeDifficulty,
  onClearAll,
  className,
}: {
  state: QuizFiltersState;
  onToggleCategory: (id: QuizCategoryId) => void;
  onChangeDifficulty: (value: "all" | QuizDifficulty) => void;
  onClearAll: () => void;
  className?: string;
}) {
  const f = dict.quizCenter.filters;
  const difficultyOptions: { id: "all" | QuizDifficulty; label: string }[] = [
    { id: "all", label: dict.moleculeLibrary.filters.polarityAll },
    ...QUIZ_DIFFICULTIES.map((id) => ({ id, label: dict.quizCenter.difficulties[id] })),
  ];

  return (
    <div className={cn("glass-subtle rounded-2xl border-border/60 p-5", className)}>
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-foreground">{f.title}</h3>
        <button
          type="button"
          onClick={onClearAll}
          className="rounded-full text-xs text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          {f.clearAll}
        </button>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-muted-foreground">{f.categoryLabel}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {QUIZ_CATEGORY_IDS.map((id) => {
            const active = state.categories.has(id);
            return (
              <button
                key={id}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleCategory(id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                  active
                    ? "border-brand-blue/50 bg-brand-blue/15 text-brand-blue"
                    : "border-border/60 text-muted-foreground hover:bg-muted/25",
                )}
              >
                {dict.quizCenter.categories[id]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-4">
        <p className="text-xs font-medium text-muted-foreground">{f.difficultyLabel}</p>
        <div className="mt-2 flex flex-wrap gap-1.5">
          {difficultyOptions.map((option) => {
            const active = state.difficulty === option.id;
            return (
              <button
                key={option.id}
                type="button"
                aria-pressed={active}
                onClick={() => onChangeDifficulty(option.id)}
                className={cn(
                  "rounded-full border px-2.5 py-1 text-[11px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
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
