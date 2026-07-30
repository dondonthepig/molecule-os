"use client";

import * as React from "react";
import { FlaskConical, Sparkles, X } from "lucide-react";
import { dict } from "@/lib/i18n";
import {
  REACTION_IDS,
  getReaction,
  getReactionsForMolecule,
  getAllReactionTypeIds,
  getAllReactionCategoryIds,
} from "@/lib/chemistry/reactions";
import { getMolecule } from "@/lib/chemistry/molecules";
import type { ReactionTypeId } from "@/lib/chemistry/organic-reactions";
import { ORGANIC_CATEGORY_IDS, type OrganicCategoryId } from "@/lib/chemistry/organic-chemistry";
import { ReactionSearch, type ReactionSearchSuggestion } from "./reaction-search";
import { ReactionFilters, type ReactionFiltersState } from "./reaction-filters";
import { ReactionCard } from "./reaction-card";
import { ReactionDetail } from "./reaction-detail";

const FEATURED_REACTION_IDS = [
  "combustionMethane",
  "additionEthyleneToEthanol",
  "esterificationAceticAcidMethanol",
];

type SearchIndexItem = { id: string; haystack: string; label: string; sublabel: string };

function buildSearchIndex(): SearchIndexItem[] {
  return REACTION_IDS.map((id) => {
    const reaction = getReaction(id);
    const copy = dict.reactionAtlas.reactions[id as keyof typeof dict.reactionAtlas.reactions];
    const typeLabel = dict.organicChemistry.reactionTypes[reaction.reactionTypeId];
    const participantNames = [...reaction.reactants, ...reaction.products].map((p) => {
      const molecule = getMolecule(p.moleculeId);
      const nameCopy = dict.reactionAtlas.molecules[p.moleculeId as keyof typeof dict.reactionAtlas.molecules];
      return [molecule.formula, nameCopy?.nameZh, nameCopy?.nameEn].join(" ");
    });
    const categoryNames = [reaction.organicCategoryFrom, reaction.organicCategoryTo]
      .filter((c): c is OrganicCategoryId => Boolean(c))
      .map((c) => dict.organicChemistry.categoryNames[c].nameZh);
    const haystack = [
      copy.name,
      copy.summary,
      typeLabel,
      dict.reactionAtlas.difficulty[reaction.difficulty],
      ...participantNames,
      ...categoryNames,
    ]
      .join(" ")
      .toLowerCase();
    return { id, haystack, label: copy.name, sublabel: typeLabel };
  });
}

const SEARCH_INDEX = buildSearchIndex();

function isOrganicCategoryId(value: string | undefined): value is OrganicCategoryId {
  return (ORGANIC_CATEGORY_IDS as string[]).includes(value ?? "");
}

export function ReactionAtlasWorkspace({
  initialReactionId,
  initialCategoryFilter,
  initialMoleculeQuery,
}: {
  initialReactionId?: string;
  initialCategoryFilter?: string;
  initialMoleculeQuery?: string;
} = {}) {
  const [query, setQuery] = React.useState("");
  const [selectedReactionId, setSelectedReactionId] = React.useState<string | null>(initialReactionId ?? null);
  const [moleculeFilterId, setMoleculeFilterId] = React.useState<string | undefined>(initialMoleculeQuery);
  const [filters, setFilters] = React.useState<ReactionFiltersState>({
    types: new Set<ReactionTypeId>(),
    categories: new Set<OrganicCategoryId>(isOrganicCategoryId(initialCategoryFilter) ? [initialCategoryFilter] : []),
    difficulty: "all",
  });

  const typeIds = React.useMemo(() => getAllReactionTypeIds(), []);
  const categoryIds = React.useMemo(() => getAllReactionCategoryIds(), []);

  const normalizedQuery = query.trim().toLowerCase();
  const moleculeFilterReactionIds = React.useMemo(
    () => (moleculeFilterId ? new Set(getReactionsForMolecule(moleculeFilterId).map((r) => r.id)) : null),
    [moleculeFilterId],
  );

  const noActiveFilters =
    !normalizedQuery &&
    !moleculeFilterId &&
    filters.types.size === 0 &&
    filters.categories.size === 0 &&
    filters.difficulty === "all";

  const filteredIds = React.useMemo(() => {
    return REACTION_IDS.filter((id) => {
      const reaction = getReaction(id);

      if (moleculeFilterReactionIds && !moleculeFilterReactionIds.has(id)) return false;

      if (filters.types.size > 0 && !filters.types.has(reaction.reactionTypeId)) return false;

      if (filters.categories.size > 0) {
        const matches =
          (reaction.organicCategoryFrom && filters.categories.has(reaction.organicCategoryFrom)) ||
          (reaction.organicCategoryTo && filters.categories.has(reaction.organicCategoryTo));
        if (!matches) return false;
      }

      if (filters.difficulty !== "all" && reaction.difficulty !== filters.difficulty) return false;

      if (normalizedQuery) {
        const item = SEARCH_INDEX.find((s) => s.id === id)!;
        if (!item.haystack.includes(normalizedQuery)) return false;
      }

      return true;
    });
  }, [filters, normalizedQuery, moleculeFilterReactionIds]);

  const suggestions: ReactionSearchSuggestion[] = React.useMemo(() => {
    if (!normalizedQuery) return [];
    return SEARCH_INDEX.filter((s) => s.haystack.includes(normalizedQuery))
      .slice(0, 6)
      .map((s) => ({ id: s.id, label: s.label, sublabel: s.sublabel }));
  }, [normalizedQuery]);

  const toggleType = (id: ReactionTypeId) => {
    setFilters((f) => {
      const next = new Set(f.types);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...f, types: next };
    });
  };

  const toggleCategory = (id: OrganicCategoryId) => {
    setFilters((f) => {
      const next = new Set(f.categories);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return { ...f, categories: next };
    });
  };

  const clearAll = () => {
    setFilters({ types: new Set(), categories: new Set(), difficulty: "all" });
    setQuery("");
    setMoleculeFilterId(undefined);
  };

  const handleSelectSuggestion = (id: string) => {
    setSelectedReactionId(id);
    setQuery("");
  };

  const s = dict.reactionAtlas.search;
  const sections = dict.reactionAtlas.sections;
  const moleculeFilterName = moleculeFilterId
    ? dict.reactionAtlas.molecules[moleculeFilterId as keyof typeof dict.reactionAtlas.molecules]?.nameZh
    : undefined;

  return (
    <div className="relative px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{dict.reactionAtlas.pageTitle}</h1>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">{dict.reactionAtlas.pageSubtitle}</p>
        </div>

        {noActiveFilters ? (
          <div className="mb-10">
            <p className="mb-3 flex items-center gap-1.5 text-xs font-semibold text-brand-cyan">
              <Sparkles className="size-3.5" />
              {sections.featured}
            </p>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              {FEATURED_REACTION_IDS.map((id) => (
                <ReactionCard key={id} reaction={getReaction(id)} onSelect={() => setSelectedReactionId(id)} />
              ))}
            </div>
          </div>
        ) : null}

        <ReactionSearch
          value={query}
          onChange={setQuery}
          suggestions={suggestions}
          onSelectSuggestion={handleSelectSuggestion}
          className="mb-4 max-w-xl"
        />

        {moleculeFilterName ? (
          <button
            type="button"
            onClick={() => setMoleculeFilterId(undefined)}
            className="glass-subtle mb-6 inline-flex items-center gap-2 rounded-full border-brand-blue/40 bg-brand-blue/10 px-3.5 py-1.5 text-xs font-medium text-brand-blue transition-colors hover:bg-brand-blue/20"
          >
            {moleculeFilterName}
            <X className="size-3.5" />
          </button>
        ) : null}

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[280px_1fr]">
          <ReactionFilters
            state={filters}
            typeIds={typeIds}
            categoryIds={categoryIds}
            onToggleType={toggleType}
            onToggleCategory={toggleCategory}
            onChangeDifficulty={(difficulty) => setFilters((f) => ({ ...f, difficulty }))}
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
                  <ReactionCard key={id} reaction={getReaction(id)} onSelect={() => setSelectedReactionId(id)} />
                ))}
              </div>
            )}
          </div>
        </div>

        <p className="mt-10 text-center text-[11px] text-muted-foreground">{dict.reactionAtlas.demoNotice}</p>
      </div>

      {selectedReactionId ? (
        <ReactionDetail
          reactionId={selectedReactionId}
          onClose={() => setSelectedReactionId(null)}
          onSelectReaction={(id) => setSelectedReactionId(id)}
        />
      ) : null}
    </div>
  );
}
