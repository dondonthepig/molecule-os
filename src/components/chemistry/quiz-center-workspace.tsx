"use client";

import * as React from "react";
import { HelpCircle } from "lucide-react";
import { dict } from "@/lib/i18n";
import { QUIZ_SETS, QUIZ_SET_IDS, type QuizCategoryId } from "@/lib/chemistry/quiz-center-data";
import { QuizCenterHero } from "./quiz-center-hero";
import { QuizCenterSearch } from "./quiz-center-search";
import { QuizCenterFilters, type QuizFiltersState } from "./quiz-center-filters";
import { QuizCenterCard } from "./quiz-center-card";
import { QuizCenterSession } from "./quiz-center-session";
import { QuizCenterResults } from "./quiz-center-results";

type ViewState =
  | { mode: "browse" }
  | { mode: "active"; setId: string }
  | { mode: "results"; setId: string; correctCount: number; totalCount: number };

function buildHaystack(setId: string): string {
  const copy = dict.quizCenter.sets[setId as keyof typeof dict.quizCenter.sets];
  const set = QUIZ_SETS.find((s) => s.id === setId)!;
  return [copy.title, copy.description, dict.quizCenter.categories[set.categoryId], dict.quizCenter.difficulties[set.difficulty]]
    .join(" ")
    .toLowerCase();
}

const SEARCH_INDEX: Record<string, string> = Object.fromEntries(QUIZ_SET_IDS.map((id) => [id, buildHaystack(id)]));

export function QuizCenterWorkspace({ initialSetId }: { initialSetId?: string } = {}) {
  const [view, setView] = React.useState<ViewState>(
    initialSetId ? { mode: "active", setId: initialSetId } : { mode: "browse" },
  );
  const [query, setQuery] = React.useState("");
  const [filters, setFilters] = React.useState<QuizFiltersState>({
    categories: new Set<QuizCategoryId>(),
    difficulty: "all",
  });

  const normalizedQuery = query.trim().toLowerCase();

  const filteredSets = React.useMemo(() => {
    return QUIZ_SETS.filter((set) => {
      if (filters.categories.size > 0 && !filters.categories.has(set.categoryId)) return false;
      if (filters.difficulty !== "all" && set.difficulty !== filters.difficulty) return false;
      if (normalizedQuery && !SEARCH_INDEX[set.id].includes(normalizedQuery)) return false;
      return true;
    });
  }, [filters, normalizedQuery]);

  const toggleCategory = (id: QuizCategoryId) => {
    setFilters((f) => {
      const next = new Set(f.categories);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...f, categories: next };
    });
  };

  const clearAll = () => {
    setFilters({ categories: new Set(), difficulty: "all" });
    setQuery("");
  };

  const s = dict.quizCenter.search;

  if (view.mode === "active") {
    return (
      <div className="relative px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-10">
        <div className="mx-auto max-w-2xl">
          <QuizCenterSession
            key={view.setId}
            setId={view.setId}
            onFinish={(correctCount, totalCount) => setView({ mode: "results", setId: view.setId, correctCount, totalCount })}
            onExit={() => setView({ mode: "browse" })}
          />
        </div>
      </div>
    );
  }

  if (view.mode === "results") {
    return (
      <div className="relative px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-10">
        <div className="mx-auto max-w-2xl">
          <QuizCenterResults
            setId={view.setId}
            correctCount={view.correctCount}
            totalCount={view.totalCount}
            onRetry={() => setView({ mode: "active", setId: view.setId })}
            onBackToCenter={() => setView({ mode: "browse" })}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="relative px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <QuizCenterHero />

        <div className="mt-8">
          <h2 className="text-xl font-semibold tracking-tight text-foreground">{dict.quizCenter.pageTitle}</h2>
          <p className="mt-1.5 max-w-xl text-sm text-muted-foreground">{dict.quizCenter.pageSubtitle}</p>
        </div>

        <QuizCenterSearch value={query} onChange={setQuery} className="mt-6 mb-6 max-w-xl" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <QuizCenterFilters
            state={filters}
            onToggleCategory={toggleCategory}
            onChangeDifficulty={(value) => setFilters((f) => ({ ...f, difficulty: value }))}
            onClearAll={clearAll}
          />

          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredSets.length} / {QUIZ_SETS.length}
            </p>

            {filteredSets.length === 0 ? (
              <div className="glass-subtle flex flex-col items-center gap-3 rounded-2xl border-border/60 px-6 py-16 text-center">
                <HelpCircle className="size-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">{s.noResultsTitle}</p>
                <p className="text-xs text-muted-foreground">{s.noResultsHint}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredSets.map((set) => (
                  <QuizCenterCard key={set.id} quizSet={set} onStart={() => setView({ mode: "active", setId: set.id })} />
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="mt-10 text-center text-[11px] text-muted-foreground">{dict.quizCenter.demoNotice}</p>
      </div>
    </div>
  );
}
