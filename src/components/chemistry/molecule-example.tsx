"use client";

import { cn } from "@/lib/utils";
import { dict } from "@/lib/i18n";
import { AtomVisualization } from "./atom-visualization";
import type { MoleculeSpec } from "@/lib/chemistry/molecules";

export function MoleculeExample({
  molecule,
  active,
  onSelect,
}: {
  molecule: MoleculeSpec;
  active: boolean;
  onSelect: () => void;
}) {
  const copy = dict.bondExplorer.molecules[molecule.id as keyof typeof dict.bondExplorer.molecules];

  return (
    <button
      type="button"
      onClick={onSelect}
      aria-pressed={active}
      className={cn(
        "glass-subtle group flex shrink-0 flex-col items-center gap-2 rounded-2xl border-border/60 p-3 text-center transition-colors",
        active ? "border-brand-blue/40 bg-muted/40" : "hover:bg-muted/20",
      )}
      style={{ width: 116 }}
    >
      <div className="h-14 w-full">
        <AtomVisualization moleculeId={molecule.id} size="sm" />
      </div>
      <div>
        <div className="text-xs font-semibold text-foreground">{molecule.formula}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">{copy?.name}</div>
      </div>
    </button>
  );
}
