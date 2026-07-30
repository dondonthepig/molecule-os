"use client";

import * as React from "react";
import { Play, RotateCcw, ChevronLeft, ChevronRight, GitCompare } from "lucide-react";
import { dict } from "@/lib/i18n";
import { ORGANIC_CATEGORIES, type OrganicCategoryId } from "@/lib/chemistry/organic-chemistry";
import { getMolecule } from "@/lib/chemistry/molecules";
import { OrganicCategorySelector } from "./organic-category-selector";
import { OrganicKnowledgeMap } from "./organic-knowledge-map";
import { FunctionalGroupDetailPanel } from "./functional-group-detail-panel";
import { OrganicPropertiesPanel } from "./organic-properties-panel";
import { FunctionalGroupComparison } from "./functional-group-comparison";
import { BondVisualization } from "./bond-visualization";
import { LearningModeToggle, type LearningMode } from "./learning-mode-toggle";

const LEARN_STEPS = ["identify", "structure", "properties", "molecule", "reactions"] as const;

export function OrganicChemistryWorkspace({
  initialCategoryId,
}: {
  initialCategoryId?: OrganicCategoryId;
} = {}) {
  const [categoryId, setCategoryId] = React.useState<OrganicCategoryId>(initialCategoryId ?? "alcohol");
  const [moleculeId, setMoleculeId] = React.useState(
    ORGANIC_CATEGORIES[initialCategoryId ?? "alcohol"].representativeMoleculeIds[0],
  );
  const [learningMode, setLearningMode] = React.useState<LearningMode>("learn");
  const [learnStep, setLearnStep] = React.useState(0);
  const [compareOpen, setCompareOpen] = React.useState(false);
  const [compareCategoryB, setCompareCategoryB] = React.useState<OrganicCategoryId | null>(null);
  const [replayToken, setReplayToken] = React.useState(0);
  const [viewResetToken, setViewResetToken] = React.useState(0);

  const molecule = getMolecule(moleculeId);
  const sections = dict.organicChemistry.sections;
  const actions = dict.organicChemistry.actions;

  const handleSelectCategory = (id: OrganicCategoryId) => {
    setCategoryId(id);
    setMoleculeId(ORGANIC_CATEGORIES[id].representativeMoleculeIds[0]);
    setLearnStep(0);
    setReplayToken((t) => t + 1);
  };

  const handleSelectMolecule = (id: string) => {
    setMoleculeId(id);
    setReplayToken((t) => t + 1);
  };

  return (
    <div className="relative px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {dict.organicChemistry.pageTitle}
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{dict.organicChemistry.pageSubtitle}</p>
          </div>
          <LearningModeToggle mode={learningMode} onChange={setLearningMode} />
        </div>

        <p className="mb-2 text-xs font-semibold text-brand-cyan">{sections.categories}</p>
        <OrganicCategorySelector activeId={categoryId} onSelect={handleSelectCategory} className="mb-8" />

        <p className="mb-2 text-xs font-semibold text-brand-cyan">{sections.map}</p>
        <OrganicKnowledgeMap activeId={categoryId} onSelect={handleSelectCategory} className="mb-8" />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[340px_1fr_320px]">
          <div className="glass-subtle rounded-3xl border-border/60 p-6 lg:order-1">
            <FunctionalGroupDetailPanel categoryId={categoryId} learningMode={learningMode} learnStep={learnStep} />
          </div>

          <div className="lg:order-2">
            <p className="mb-2 text-xs font-semibold text-brand-cyan">{sections.structure}</p>
            <div className="glass relative overflow-hidden rounded-3xl border-border/60">
              <div className="h-[320px] w-full sm:h-[380px] lg:h-[420px]">
                <BondVisualization molecule={molecule} replayToken={replayToken} viewResetToken={viewResetToken} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-3">
                <span className="text-[11px] text-muted-foreground">
                  {dict.bondExplorer.controls.rotateHint} · {dict.bondExplorer.controls.zoomHint}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReplayToken((t) => t + 1)}
                    className="glass-subtle inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
                  >
                    <Play className="size-3.5" />
                    {dict.bondExplorer.controls.playElectronFlow}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewResetToken((t) => t + 1)}
                    className="glass-subtle inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
                  >
                    <RotateCcw className="size-3.5" />
                    {dict.bondExplorer.controls.reset}
                  </button>
                </div>
              </div>
            </div>

            {learningMode === "learn" ? (
              <div className="glass-subtle mt-4 flex items-center justify-between rounded-2xl border-border/60 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setLearnStep((s) => Math.max(0, s - 1))}
                  disabled={learnStep === 0}
                  className="inline-flex items-center gap-1 text-xs font-medium text-foreground disabled:opacity-30"
                >
                  <ChevronLeft className="size-4" />
                  {actions.stepBack}
                </button>
                <span className="text-xs text-muted-foreground">
                  {actions.stepLabel} {learnStep + 1} / {LEARN_STEPS.length} ·{" "}
                  {dict.organicChemistry.learningSteps[LEARN_STEPS[learnStep]]}
                </span>
                <button
                  type="button"
                  onClick={() => setLearnStep((s) => Math.min(LEARN_STEPS.length - 1, s + 1))}
                  disabled={learnStep === LEARN_STEPS.length - 1}
                  className="inline-flex items-center gap-1 text-xs font-medium text-foreground disabled:opacity-30"
                >
                  {actions.stepNext}
                  <ChevronRight className="size-4" />
                </button>
              </div>
            ) : null}
          </div>

          <div className="lg:order-3">
            <p className="mb-2 text-xs font-semibold text-brand-cyan">{sections.properties}</p>
            <OrganicPropertiesPanel
              categoryId={categoryId}
              selectedMoleculeId={moleculeId}
              onSelectMolecule={handleSelectMolecule}
              learningMode={learningMode}
              learnStep={learnStep}
            />
          </div>
        </div>

        <div className="mt-8">
          {compareOpen ? (
            <FunctionalGroupComparison
              categoryA={categoryId}
              categoryB={compareCategoryB}
              onChangeB={setCompareCategoryB}
              onClose={() => {
                setCompareOpen(false);
                setCompareCategoryB(null);
              }}
            />
          ) : (
            <button
              type="button"
              onClick={() => setCompareOpen(true)}
              className="glass-subtle inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
            >
              <GitCompare className="size-4" />
              {actions.compareWith}
            </button>
          )}
        </div>

        <p className="mt-10 text-center text-[11px] text-muted-foreground">{dict.organicChemistry.demoNotice}</p>
      </div>
    </div>
  );
}
