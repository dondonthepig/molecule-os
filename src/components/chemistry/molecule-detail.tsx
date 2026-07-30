"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, RotateCcw, Play, Pause, Tags, Boxes, ArrowUpRight } from "lucide-react";
import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { getMolecule } from "@/lib/chemistry/molecules";
import { getLibraryEntry, getAtomCount } from "@/lib/chemistry/molecule-library-data";
import { BondVisualization } from "./bond-visualization";
import type { MoleculeRenderMode } from "./bond-visualization-scene";
import { FunctionalGroupBadge } from "./functional-group-badge";
import { PolarityIndicator } from "./polarity-indicator";
import { RelatedMolecules } from "./related-molecules";

const BOND_KIND_KEY: Record<string, keyof typeof dict.moleculeLibrary.bondKinds> = {
  "covalent-single": "covalentSingle",
  "covalent-double": "covalentDouble",
  "covalent-triple": "covalentTriple",
  ionic: "ionic",
  hydrogen: "hydrogen",
};

export function MoleculeDetail({
  moleculeId,
  onClose,
  onSelectRelated,
}: {
  moleculeId: string;
  onClose: () => void;
  onSelectRelated: (id: string) => void;
}) {
  const molecule = getMolecule(moleculeId);
  const entry = getLibraryEntry(moleculeId);
  const copy = dict.moleculeLibrary.molecules[moleculeId as keyof typeof dict.moleculeLibrary.molecules];
  const atomCount = getAtomCount(moleculeId);
  const d = dict.moleculeLibrary.detail;
  const vc = dict.moleculeLibrary.viewerControls;

  const [renderMode, setRenderMode] = React.useState<MoleculeRenderMode>("ballAndStick");
  const [showLabels, setShowLabels] = React.useState(true);
  const [showBonds, setShowBonds] = React.useState(true);
  const [autoRotate, setAutoRotate] = React.useState(true);
  const [viewResetToken, setViewResetToken] = React.useState(0);

  const bondKindIds = Array.from(new Set(molecule.bonds.map((b) => b.kind)));

  React.useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [onClose]);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[70] flex items-center justify-center bg-background/80 p-3 backdrop-blur-xl sm:p-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.25 }}
        onClick={onClose}
      >
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={copy?.nameZh}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass relative flex h-full w-full max-w-6xl flex-col overflow-hidden rounded-3xl border-border/60 lg:h-[85vh]"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={d.close}
            className="absolute top-4 right-4 z-10 inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-muted/40"
          >
            <X className="size-4" />
          </button>

          <div className="grid flex-1 grid-cols-1 overflow-y-auto lg:grid-cols-[1fr_420px] lg:overflow-hidden">
            {/* 3D visualization */}
            <div className="relative flex flex-col border-b border-border/60 lg:border-r lg:border-b-0">
              <div className="h-[300px] w-full shrink-0 sm:h-[380px] lg:h-auto lg:flex-1">
                <BondVisualization
                  molecule={molecule}
                  replayToken={0}
                  viewResetToken={viewResetToken}
                  showLabels={showLabels}
                  showBonds={showBonds}
                  renderMode={renderMode}
                  enablePan={false}
                  autoRotate={autoRotate}
                />
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-border/60 px-4 py-3">
                <span className="mr-auto text-[11px] text-muted-foreground">
                  {vc.rotateHint} · {vc.zoomHint}
                </span>
                <button
                  type="button"
                  onClick={() => setAutoRotate((v) => !v)}
                  className="glass-subtle inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium text-foreground hover:bg-muted/40"
                >
                  {autoRotate ? <Pause className="size-3.5" /> : <Play className="size-3.5" />}
                  {autoRotate ? vc.autoRotateOn : vc.autoRotateOff}
                </button>
                <button
                  type="button"
                  onClick={() => setShowLabels((v) => !v)}
                  className={cn(
                    "glass-subtle inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium hover:bg-muted/40",
                    showLabels ? "text-brand-cyan" : "text-foreground",
                  )}
                >
                  <Tags className="size-3.5" />
                  {vc.toggleLabels}
                </button>
                <button
                  type="button"
                  onClick={() => setShowBonds((v) => !v)}
                  className="glass-subtle inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium text-foreground hover:bg-muted/40"
                >
                  <Boxes className="size-3.5" />
                  {showBonds ? vc.hideBonds : vc.showBonds}
                </button>
                <button
                  type="button"
                  onClick={() =>
                    setRenderMode((m) => (m === "ballAndStick" ? "spaceFilling" : "ballAndStick"))
                  }
                  className="glass-subtle inline-flex h-8 items-center rounded-full px-3 text-[11px] font-medium text-foreground hover:bg-muted/40"
                >
                  {renderMode === "ballAndStick" ? vc.ballAndStick : vc.spaceFilling}
                </button>
                <button
                  type="button"
                  onClick={() => setViewResetToken((t) => t + 1)}
                  className="glass-subtle inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium text-foreground hover:bg-muted/40"
                >
                  <RotateCcw className="size-3.5" />
                  {vc.resetView}
                </button>
              </div>
              <p className="border-t border-border/60 px-4 py-2 text-center text-[10px] text-muted-foreground">
                {d.teachingNote}
              </p>
            </div>

            {/* Information + properties */}
            <div className="flex flex-col gap-6 overflow-y-auto p-6">
              <div>
                <div className="flex items-baseline justify-between gap-3">
                  <h2 className="text-2xl font-semibold text-foreground">{copy?.nameZh}</h2>
                  <span className="text-sm text-muted-foreground">{copy?.nameEn}</span>
                </div>
                <p className="mt-1 text-sm font-medium text-brand-cyan">{molecule.formula}</p>
              </div>

              <dl className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <dt className="text-xs text-muted-foreground">{d.molecularWeight}</dt>
                  <dd className="mt-0.5 text-foreground">
                    {entry.molecularWeight} {d.unitGMol}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{d.atomCount}</dt>
                  <dd className="mt-0.5 text-foreground">
                    {atomCount} {d.unitAtoms}
                  </dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{d.geometry}</dt>
                  <dd className="mt-0.5 text-foreground">{dict.moleculeLibrary.geometry[entry.geometry]}</dd>
                </div>
                <div>
                  <dt className="text-xs text-muted-foreground">{d.polarity}</dt>
                  <dd className="mt-0.5">
                    <PolarityIndicator polarity={entry.polarity} />
                  </dd>
                </div>
              </dl>

              <div>
                <p className="text-xs font-semibold text-brand-cyan">{d.bondTypes}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {bondKindIds.map((kind) => (
                    <span
                      key={kind}
                      className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-foreground/85"
                    >
                      {dict.moleculeLibrary.bondKinds[BOND_KIND_KEY[kind]]}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-brand-cyan">{d.functionalGroups}</p>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {entry.functionalGroups.length > 0 ? (
                    entry.functionalGroups.map((groupId) => <FunctionalGroupBadge key={groupId} id={groupId} />)
                  ) : (
                    <span className="text-xs text-muted-foreground">{d.noFunctionalGroups}</span>
                  )}
                </div>
              </div>

              <div>
                <p className="text-xs font-semibold text-brand-cyan">{d.commonUses}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{copy?.commonUses}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-brand-cyan">{d.safetyNotes}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{copy?.safetyNotes}</p>
              </div>

              <div>
                <p className="text-xs font-semibold text-brand-cyan">{d.funFact}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{copy?.funFact}</p>
              </div>

              <Link
                href={`/bond-explorer?bondType=${molecule.bondTypeId}`}
                className="glass-subtle inline-flex items-center justify-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium text-foreground transition-colors hover:bg-muted/40"
              >
                {d.exploreBonds}
                <ArrowUpRight className="size-4" />
              </Link>

              <RelatedMolecules moleculeIds={entry.relatedMoleculeIds} onSelect={onSelectRelated} />
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
