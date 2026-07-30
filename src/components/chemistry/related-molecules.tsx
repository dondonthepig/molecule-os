"use client";

import { dict } from "@/lib/i18n";
import { getMolecule } from "@/lib/chemistry/molecules";
import { AtomVisualization } from "./atom-visualization";

export function RelatedMolecules({
  moleculeIds,
  onSelect,
}: {
  moleculeIds: string[];
  onSelect: (id: string) => void;
}) {
  if (moleculeIds.length === 0) return null;

  return (
    <div>
      <p className="text-xs font-semibold text-brand-cyan">{dict.moleculeLibrary.detail.relatedMolecules}</p>
      <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {moleculeIds.map((id) => {
          const molecule = getMolecule(id);
          const copy = dict.moleculeLibrary.molecules[id as keyof typeof dict.moleculeLibrary.molecules];
          return (
            <button
              key={id}
              type="button"
              onClick={() => onSelect(id)}
              className="glass-subtle flex shrink-0 flex-col items-center gap-2 rounded-2xl border-border/60 p-3 text-center transition-colors hover:bg-muted/20"
              style={{ width: 112 }}
            >
              <div className="h-12 w-full">
                <AtomVisualization moleculeId={id} size="sm" />
              </div>
              <div>
                <div className="text-xs font-semibold text-foreground">{molecule.formula}</div>
                <div className="mt-0.5 text-[11px] text-muted-foreground">{copy?.nameZh}</div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
