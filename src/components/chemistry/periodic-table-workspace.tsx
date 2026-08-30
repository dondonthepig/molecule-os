"use client";

import * as React from "react";
import { dict } from "@/lib/i18n";
import { ELEMENTS, type ElementCategory } from "@/lib/chemistry/periodic-table";
import { PeriodicTableSearch } from "./periodic-table-search";
import { PeriodicTableFilters, type PeriodicTableFiltersState } from "./periodic-table-filters";
import { PeriodicTableLegend } from "./periodic-table-legend";
import { PeriodicTableGrid } from "./periodic-table-grid";
import { ElementDetail } from "./element-detail";

type SearchIndexItem = { symbol: string; haystack: string };

function buildSearchIndex(): SearchIndexItem[] {
  return ELEMENTS.map((element) => {
    const nameZh = dict.periodicTable.elements[element.symbol as keyof typeof dict.periodicTable.elements]?.nameZh;
    const haystack = [element.symbol, element.name, nameZh, dict.periodicTable.categories[element.category], String(element.number)]
      .join(" ")
      .toLowerCase();
    return { symbol: element.symbol, haystack };
  });
}

const SEARCH_INDEX = buildSearchIndex();

export function PeriodicTableWorkspace({ initialSelectedSymbol }: { initialSelectedSymbol?: string } = {}) {
  const [query, setQuery] = React.useState("");
  const [selectedSymbol, setSelectedSymbol] = React.useState<string | null>(initialSelectedSymbol ?? null);
  const [filters, setFilters] = React.useState<PeriodicTableFiltersState>({
    categories: new Set<ElementCategory>(),
    state: "all",
  });

  const normalizedQuery = query.trim().toLowerCase();
  const hasActiveFilter = Boolean(normalizedQuery) || filters.categories.size > 0 || filters.state !== "all";

  const visibleSymbols = React.useMemo(() => {
    if (!hasActiveFilter) return null;
    const set = new Set<string>();
    for (const element of ELEMENTS) {
      if (filters.categories.size > 0 && !filters.categories.has(element.category)) continue;
      if (filters.state !== "all" && element.state !== filters.state) continue;
      if (normalizedQuery) {
        const item = SEARCH_INDEX.find((s) => s.symbol === element.symbol)!;
        if (!item.haystack.includes(normalizedQuery)) continue;
      }
      set.add(element.symbol);
    }
    return set;
  }, [filters, normalizedQuery, hasActiveFilter]);

  const toggleCategory = (id: ElementCategory) => {
    setFilters((f) => {
      const next = new Set(f.categories);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...f, categories: next };
    });
  };

  const clearAll = () => {
    setFilters({ categories: new Set(), state: "all" });
    setQuery("");
  };

  const s = dict.periodicTable.search;

  return (
    <div className="relative px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{dict.periodicTable.pageTitle}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{dict.periodicTable.pageSubtitle}</p>
        </div>

        <PeriodicTableSearch value={query} onChange={setQuery} className="mb-6 max-w-xl" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <div className="flex flex-col gap-6">
            <PeriodicTableFilters
              state={filters}
              onToggleCategory={toggleCategory}
              onChangeState={(value) => setFilters((f) => ({ ...f, state: value }))}
              onClearAll={clearAll}
            />
            <PeriodicTableLegend className="glass-subtle rounded-2xl border-border/60 p-5" />
          </div>

          <div>
            {hasActiveFilter ? (
              <p className="mb-4 text-sm text-muted-foreground">
                {visibleSymbols?.size ?? 0} {s.resultsLabel}
              </p>
            ) : null}
            {hasActiveFilter && visibleSymbols?.size === 0 ? (
              <div className="glass-subtle mb-4 rounded-2xl border-border/60 px-6 py-6 text-center">
                <p className="text-sm font-medium text-foreground">{s.noResultsTitle}</p>
                <p className="text-xs text-muted-foreground">{s.noResultsHint}</p>
              </div>
            ) : null}
            <PeriodicTableGrid visibleSymbols={visibleSymbols} onSelect={setSelectedSymbol} />
          </div>
        </div>

        <p className="mt-10 text-center text-[11px] text-muted-foreground">{dict.periodicTable.demoNotice}</p>
      </div>

      {selectedSymbol ? <ElementDetail symbol={selectedSymbol} onClose={() => setSelectedSymbol(null)} /> : null}
    </div>
  );
}
