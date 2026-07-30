"use client";

import { motion } from "framer-motion";
import { dict } from "@/lib/i18n";
import { classifyElectronegativityDifference } from "@/lib/chemistry/bond-types";
import { ELECTRONEGATIVITY, type MoleculeSpec } from "@/lib/chemistry/molecules";

/** Dedicated, data-driven bond polarity visual: ΔEN, electron density shift, and partial charges for the active molecule's primary bond. */
export function BondPolarityPanel({ molecule, className }: { molecule: MoleculeSpec; className?: string }) {
  const bond = molecule.bonds.find((b) => b.kind !== "hydrogen") ?? molecule.bonds[0];
  if (!bond || molecule.isLattice) return null;

  const from = molecule.atoms.find((a) => a.id === bond.from)!;
  const to = molecule.atoms.find((a) => a.id === bond.to)!;
  const enA = ELECTRONEGATIVITY[from.element];
  const enB = ELECTRONEGATIVITY[to.element];
  const delta = Math.abs(enA - enB);
  const character = classifyElectronegativityDifference(delta);
  const panel = dict.bondExplorer.polarityPanel;

  // 0 = fully centered on `from`, 1 = fully centered on `to`.
  const shift =
    character === "ionic" ? (enA > enB ? 0.08 : 0.92) : 0.5 + (enB > enA ? 1 : -1) * Math.min(0.32, delta * 0.22);

  return (
    <div className={className}>
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>{panel.electronegativityDiff}</span>
        <span className="font-mono text-foreground">Δ{delta.toFixed(2)}</span>
      </div>

      <div className="relative mt-3 h-8 overflow-hidden rounded-full bg-gradient-to-r from-brand-blue/40 via-muted to-brand-purple/40">
        <motion.div
          className="absolute top-1/2 size-5 -translate-y-1/2 rounded-full bg-white shadow-[0_0_12px_2px_rgba(255,255,255,0.6)]"
          initial={false}
          animate={{ left: `calc(${shift * 100}% - 10px)` }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        />
      </div>

      <div className="mt-2 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          {from.element}
          {character !== "nonpolar" ? ` (${enA < enB ? panel.deltaPositive : panel.deltaNegative})` : ""}
        </span>
        <span>
          {to.element}
          {character !== "nonpolar" ? ` (${enB < enA ? panel.deltaPositive : panel.deltaNegative})` : ""}
        </span>
      </div>

      <div className="mt-4 flex items-center gap-2 text-xs">
        <span
          className="rounded-full px-2.5 py-1 font-medium"
          style={{
            backgroundColor:
              character === "ionic"
                ? "color-mix(in oklab, var(--color-brand-blue) 20%, transparent)"
                : character === "polar"
                  ? "color-mix(in oklab, var(--color-brand-purple) 20%, transparent)"
                  : "color-mix(in oklab, var(--color-brand-cyan) 20%, transparent)",
            color:
              character === "ionic"
                ? "var(--color-brand-blue)"
                : character === "polar"
                  ? "var(--color-brand-purple)"
                  : "var(--color-brand-cyan)",
          }}
        >
          {character === "nonpolar" ? panel.nonpolar : character === "polar" ? panel.polar : panel.ionicCharacter}
        </span>
      </div>
    </div>
  );
}
