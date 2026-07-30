"use client";

import * as React from "react";
import { ArrowRight } from "lucide-react";
import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { getMolecule } from "@/lib/chemistry/molecules";
import type { Reaction } from "@/lib/chemistry/reactions";
import { BondVisualization } from "./bond-visualization";
import { FunctionalGroupBadge } from "./functional-group-badge";

function moleculeName(id: string): string {
  const molecules = dict.reactionAtlas.molecules;
  return molecules[id as keyof typeof molecules]?.nameZh ?? id;
}

function TransformationPanel({
  moleculeId,
  highlightBonds,
  replayToken,
  viewResetToken,
}: {
  moleculeId: string;
  highlightBonds: { from: string; to: string }[];
  replayToken: number;
  viewResetToken: number;
}) {
  const molecule = getMolecule(moleculeId);
  return (
    <div className="glass-subtle overflow-hidden rounded-2xl border-border/60">
      <div className="h-[200px] w-full">
        <BondVisualization
          molecule={molecule}
          replayToken={replayToken}
          viewResetToken={viewResetToken}
          highlightBonds={highlightBonds}
          enablePan={false}
        />
      </div>
      <p className="border-t border-border/60 px-3 py-2 text-center text-xs text-muted-foreground">
        {moleculeName(moleculeId)} · {molecule.formula}
      </p>
    </div>
  );
}

/**
 * Reactant(s) — arrow — product(s), with the bond that changes highlighted in
 * ice-blue on each side. Reuses `BondVisualization` (the shared 3D viewer);
 * no new renderer.
 */
export function ReactionTransformationView({
  reaction,
  replayToken,
  viewResetToken,
}: {
  reaction: Reaction;
  replayToken: number;
  viewResetToken: number;
}) {
  const reactantMoleculeIds = Array.from(new Set(reaction.reactantHighlights.map((h) => h.moleculeId)));
  const productMoleculeIds = Array.from(new Set(reaction.productHighlights.map((h) => h.moleculeId)));

  const highlightsFor = (side: "reactant" | "product", moleculeId: string) =>
    (side === "reactant" ? reaction.reactantHighlights : reaction.productHighlights)
      .filter((h) => h.moleculeId === moleculeId)
      .map((h) => ({ from: h.from, to: h.to }));

  return (
    <div>
      <div className="grid grid-cols-1 items-center gap-4 sm:grid-cols-[1fr_auto_1fr]">
        <div className={cn("grid grid-cols-1 gap-3", reactantMoleculeIds.length > 1 && "sm:grid-cols-2")}>
          {reactantMoleculeIds.map((id) => (
            <TransformationPanel
              key={id}
              moleculeId={id}
              highlightBonds={highlightsFor("reactant", id)}
              replayToken={replayToken}
              viewResetToken={viewResetToken}
            />
          ))}
        </div>

        <ArrowRight className="mx-auto size-6 shrink-0 rotate-90 text-brand-cyan sm:rotate-0" />

        <div className={cn("grid grid-cols-1 gap-3", productMoleculeIds.length > 1 && "sm:grid-cols-2")}>
          {productMoleculeIds.map((id) => (
            <TransformationPanel
              key={id}
              moleculeId={id}
              highlightBonds={highlightsFor("product", id)}
              replayToken={replayToken}
              viewResetToken={viewResetToken}
            />
          ))}
        </div>
      </div>

      {reaction.functionalGroupFrom || reaction.functionalGroupTo ? (
        <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
          {reaction.functionalGroupFrom ? <FunctionalGroupBadge id={reaction.functionalGroupFrom} /> : null}
          {reaction.functionalGroupFrom && reaction.functionalGroupTo ? (
            <ArrowRight className="size-3.5 text-muted-foreground" />
          ) : null}
          {reaction.functionalGroupTo ? <FunctionalGroupBadge id={reaction.functionalGroupTo} /> : null}
        </div>
      ) : null}
    </div>
  );
}
