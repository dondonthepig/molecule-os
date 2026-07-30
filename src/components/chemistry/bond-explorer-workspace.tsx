"use client";

import * as React from "react";
import { Play, RotateCcw } from "lucide-react";
import { dict } from "@/lib/i18n";
import { BOND_TYPES, type BondTypeId } from "@/lib/chemistry/bond-types";
import { getMolecule } from "@/lib/chemistry/molecules";
import { BondSelector } from "./bond-selector";
import { BondVisualization } from "./bond-visualization";
import { AtomVisualization } from "./atom-visualization";
import { BondInfoPanel } from "./bond-info-panel";
import { BondPolarityPanel } from "./bond-polarity-panel";
import { MoleculeExample } from "./molecule-example";
import { BondQuiz } from "./bond-quiz";
import { LearningModeToggle, type LearningMode } from "./learning-mode-toggle";

export function BondExplorerWorkspace({ initialBondTypeId }: { initialBondTypeId?: BondTypeId } = {}) {
  const startingBondTypeId = initialBondTypeId ?? "ionic";
  const [bondTypeId, setBondTypeId] = React.useState<BondTypeId>(startingBondTypeId);
  const [moleculeId, setMoleculeId] = React.useState(BOND_TYPES[startingBondTypeId].defaultMoleculeId);
  const [learningMode, setLearningMode] = React.useState<LearningMode>("learn");
  const [replayToken, setReplayToken] = React.useState(0);
  const [viewResetToken, setViewResetToken] = React.useState(0);

  const category = BOND_TYPES[bondTypeId];
  const molecule = getMolecule(moleculeId);
  const sections = dict.bondExplorer.sections;

  const handleSelectBondType = (id: BondTypeId) => {
    setBondTypeId(id);
    setMoleculeId(BOND_TYPES[id].defaultMoleculeId);
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
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">{dict.bondExplorer.workspaceTitle}</h1>
            <p className="mt-2 max-w-xl text-sm text-muted-foreground">{dict.bondExplorer.workspaceSubtitle}</p>
          </div>
          <LearningModeToggle mode={learningMode} onChange={setLearningMode} />
        </div>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[220px_1fr_360px] lg:grid-rows-[auto_auto]">
          <div className="lg:col-start-1 lg:row-start-1 lg:row-span-2">
            <p className="mb-2 text-xs font-semibold text-brand-cyan">{sections.categories}</p>
            <BondSelector activeId={bondTypeId} onSelect={handleSelectBondType} />
          </div>

          <div className="lg:col-start-2 lg:row-start-1">
            <p className="mb-2 text-xs font-semibold text-brand-cyan">{sections.visualization}</p>
            <div className="glass relative overflow-hidden rounded-3xl border-border/60">
              <div className="h-[340px] w-full sm:h-[400px] lg:h-[440px]">
                <BondVisualization molecule={molecule} replayToken={replayToken} viewResetToken={viewResetToken} />
              </div>
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-border/60 px-5 py-3">
                <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                  <span>{dict.bondExplorer.controls.rotateHint}</span>
                  <span className="hidden sm:inline">·</span>
                  <span className="hidden sm:inline">{dict.bondExplorer.controls.zoomHint}</span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setReplayToken((t) => t + 1)}
                    className="glass-subtle inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/40 active:scale-95"
                  >
                    <Play className="size-3.5" />
                    {dict.bondExplorer.controls.playElectronFlow}
                  </button>
                  <button
                    type="button"
                    onClick={() => setViewResetToken((t) => t + 1)}
                    className="glass-subtle inline-flex h-9 items-center gap-1.5 rounded-full px-3.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/40 active:scale-95"
                  >
                    <RotateCcw className="size-3.5" />
                    {dict.bondExplorer.controls.reset}
                  </button>
                </div>
              </div>
            </div>

            {learningMode === "learn" ? (
              <div className="glass-subtle mt-6 grid grid-cols-1 gap-6 rounded-3xl border-border/60 p-6 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold text-brand-cyan">{dict.bondExplorer.prompts.electronDirection}</p>
                  <div className="mt-3 h-32">
                    <AtomVisualization moleculeId={moleculeId} size="lg" />
                  </div>
                </div>
                <div>
                  <p className="text-xs font-semibold text-brand-cyan">{sections.polarity}</p>
                  <BondPolarityPanel molecule={molecule} className="mt-3" />
                </div>
              </div>
            ) : null}
          </div>

          <div className="lg:col-start-3 lg:row-start-1 lg:row-span-2">
            <p className="mb-2 text-xs font-semibold text-brand-cyan">{sections.information}</p>
            <div className="glass-subtle rounded-3xl border-border/60 p-6">
              <BondInfoPanel bondTypeId={bondTypeId} learningMode={learningMode} />
            </div>
          </div>

          <div className="lg:col-start-2 lg:row-start-2">
            <p className="mb-2 text-xs font-semibold text-brand-cyan">{sections.examples}</p>
            <div className="flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {category.moleculeIds.map((id) => (
                <MoleculeExample
                  key={id}
                  molecule={getMolecule(id)}
                  active={id === moleculeId}
                  onSelect={() => handleSelectMolecule(id)}
                />
              ))}
            </div>
          </div>
        </div>

        {learningMode === "learn" ? (
          <div className="mt-8 max-w-2xl">
            <p className="mb-3 text-xs font-semibold text-brand-cyan">{sections.quiz}</p>
            <BondQuiz key={bondTypeId} bondTypeId={bondTypeId} />
          </div>
        ) : null}

        <p className="mt-10 text-center text-[11px] text-muted-foreground">{dict.bondExplorer.demoNotice}</p>
      </div>
    </div>
  );
}
