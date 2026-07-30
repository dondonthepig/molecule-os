"use client";

import * as React from "react";
import { FlaskConical } from "lucide-react";
import { dict } from "@/lib/i18n";
import {
  LIBRARY_MOLECULE_IDS,
  MOLECULE_LIBRARY,
  getAtomCount,
  type MoleculeCategory,
  type Polarity,
} from "@/lib/chemistry/molecule-library-data";
import { getMolecule } from "@/lib/chemistry/molecules";
import type { FunctionalGroupId } from "@/lib/chemistry/functional-groups";
import { MoleculeSearch, type SearchSuggestion } from "./molecule-search";
import { MoleculeFilters, type MoleculeFiltersState } from "./molecule-filters";
import { MoleculeCard } from "./molecule-card";
import { MoleculeDetail } from "./molecule-detail";

function computeBounds(): { weight: [number, number]; atoms: [number, number] } {
  const weights = LIBRARY_MOLECULE_IDS.map((id) => MOLECULE_LIBRARY[id].molecularWeight);
  const atomCounts = LIBRARY_MOLECULE_IDS.map((id) => getAtomCount(id));
  return {
    weight: [Math.floor(Math.min(...weights)), Math.ceil(Math.max(...weights))],
    atoms: [Math.min(...atomCounts), Math.max(...atomCounts)],
  };
}

const BOUNDS = computeBounds();

type SearchIndexItem = { id: string; haystack: string; label: string; sublabel: string };

function buildSearchIndex(): SearchIndexItem[] {
  return LIBRARY_MOLECULE_IDS.map((id) => {
    const molecule = getMolecule(id);
    const entry = MOLECULE_LIBRARY[id];
    const copy = dict.moleculeLibrary.molecules[id as keyof typeof dict.moleculeLibrary.molecules];
    const haystack = [
      copy.nameZh,
      copy.nameEn,
      molecule.formula,
      dict.moleculeLibrary.categories[entry.category],
      ...entry.functionalGroups.map((g) => dict.moleculeLibrary.functionalGroups[g].name),
    ]
      .join(" ")
      .toLowerCase();
    return { id, haystack, label: `${copy.nameZh} · ${copy.nameEn}`, sublabel: molecule.formula };
  });
}

const SEARCH_INDEX = buildSearchIndex();

export function MoleculeLibraryWorkspace({ initialSelectedId }: { initialSelectedId?: string } = {}) {
  const [query, setQuery] = React.useState("");
  const [selectedId, setSelectedId] = React.useState<string | null>(initialSelectedId ?? null);
  const [filters, setFilters] = React.useState<MoleculeFiltersState>({
    categories: new Set(),
    functionalGroups: new Set(),
    polarity: "all",
    weightRange: BOUNDS.weight,
    atomCountRange: BOUNDS.atoms,
  });

  const normalizedQuery = query.trim().toLowerCase();

  const filteredIds = React.useMemo(() => {
    return LIBRARY_MOLECULE_IDS.filter((id) => {
      const entry = MOLECULE_LIBRARY[id];

      if (filters.categories.size > 0) {
        const matchesCategory =
          filters.categories.has(entry.category) ||
          (filters.categories.has("organic") && entry.isOrganic) ||
          (filters.categories.has("inorganic") && !entry.isOrganic);
        if (!matchesCategory) return false;
      }

      if (filters.functionalGroups.size > 0) {
        const hasAny = entry.functionalGroups.some((g) => filters.functionalGroups.has(g));
        if (!hasAny) return false;
      }

      if (filters.polarity !== "all" && entry.polarity !== filters.polarity) return false;

      if (entry.molecularWeight < filters.weightRange[0] || entry.molecularWeight > filters.weightRange[1]) {
        return false;
      }

      const atomCount = getAtomCount(id);
      if (atomCount < filters.atomCountRange[0] || atomCount > filters.atomCountRange[1]) return false;

      if (normalizedQuery) {
        const item = SEARCH_INDEX.find((s) => s.id === id)!;
        if (!item.haystack.includes(normalizedQuery)) return false;
      }

      return true;
    });
  }, [filters, normalizedQuery]);

  const suggestions: SearchSuggestion[] = React.useMemo(() => {
    if (!normalizedQuery) return [];
    return SEARCH_INDEX.filter((s) => s.haystack.includes(normalizedQuery))
      .slice(0, 6)
      .map((s) => ({ id: s.id, label: s.label, sublabel: s.sublabel }));
  }, [normalizedQuery]);

  const toggleCategory = (category: MoleculeCategory) => {
    setFilters((f) => {
      const next = new Set(f.categories);
      if (next.has(category)) next.delete(category);
      else next.add(category);
      return { ...f, categories: next };
    });
  };

  const toggleFunctionalGroup = (id: FunctionalGroupId) => {
    setFilters((f) => {
      const next = new Set(f.functionalGroups);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...f, functionalGroups: next };
    });
  };

  const clearAll = () => {
    setFilters({
      categories: new Set(),
      functionalGroups: new Set(),
      polarity: "all",
      weightRange: BOUNDS.weight,
      atomCountRange: BOUNDS.atoms,
    });
    setQuery("");
  };

  const handleSelectSuggestion = (id: string) => {
    setSelectedId(id);
    setQuery("");
  };

  const s = dict.moleculeLibrary.search;

  return (
    <div className="relative px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
            {dict.moleculeLibrary.pageTitle}
          </h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{dict.moleculeLibrary.pageSubtitle}</p>
        </div>

        <MoleculeSearch
          value={query}
          onChange={setQuery}
          suggestions={suggestions}
          onSelectSuggestion={handleSelectSuggestion}
          className="mb-6 max-w-xl"
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <MoleculeFilters
            state={filters}
            weightBounds={BOUNDS.weight}
            atomCountBounds={BOUNDS.atoms}
            onToggleCategory={toggleCategory}
            onToggleFunctionalGroup={toggleFunctionalGroup}
            onChangePolarity={(polarity: "all" | Polarity) => setFilters((f) => ({ ...f, polarity }))}
            onChangeWeightRange={(weightRange) => setFilters((f) => ({ ...f, weightRange }))}
            onChangeAtomCountRange={(atomCountRange) => setFilters((f) => ({ ...f, atomCountRange }))}
            onClearAll={clearAll}
          />

          <div>
            <p className="mb-4 text-sm text-muted-foreground">
              {filteredIds.length} {s.resultsLabel}
            </p>

            {filteredIds.length === 0 ? (
              <div className="glass-subtle flex flex-col items-center gap-3 rounded-2xl border-border/60 px-6 py-16 text-center">
                <FlaskConical className="size-8 text-muted-foreground" />
                <p className="text-sm font-medium text-foreground">{s.noResultsTitle}</p>
                <p className="text-xs text-muted-foreground">{s.noResultsHint}</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {filteredIds.map((id) => (
                  <MoleculeCard key={id} moleculeId={id} onSelect={() => setSelectedId(id)} />
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="mt-10 text-center text-[11px] text-muted-foreground">{dict.moleculeLibrary.demoNotice}</p>
      </div>

      {selectedId ? (
        <MoleculeDetail
          moleculeId={selectedId}
          onClose={() => setSelectedId(null)}
          onSelectRelated={(id) => setSelectedId(id)}
        />
      ) : null}
    </div>
  );
}
