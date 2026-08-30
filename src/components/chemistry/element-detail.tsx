"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { dict } from "@/lib/i18n";
import { getElement, CATEGORY_COLORS } from "@/lib/chemistry/periodic-table";
import { getMolecule, getMoleculesContainingElement } from "@/lib/chemistry/molecules";
import { LIBRARY_MOLECULE_IDS } from "@/lib/chemistry/molecule-library-data";
import { AtomVisualization } from "./atom-visualization";

function resolveMoleculeName(id: string): string {
  const libraryCopy = dict.moleculeLibrary.molecules[id as keyof typeof dict.moleculeLibrary.molecules];
  if (libraryCopy) return libraryCopy.nameZh;
  const reactionCopy = dict.reactionAtlas.molecules[id as keyof typeof dict.reactionAtlas.molecules];
  if (reactionCopy) return reactionCopy.nameZh;
  return id;
}

export function ElementDetail({ symbol, onClose }: { symbol: string; onClose: () => void }) {
  const element = getElement(symbol);
  const d = dict.periodicTable.detail;
  const nameZh = dict.periodicTable.elements[symbol as keyof typeof dict.periodicTable.elements]?.nameZh;
  const color = CATEGORY_COLORS[element.category];
  const relatedMoleculeIds = React.useMemo(() => getMoleculesContainingElement(symbol).slice(0, 8), [symbol]);

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
          aria-label={nameZh}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass relative flex h-full w-full max-w-2xl flex-col overflow-hidden rounded-3xl border-border/60 lg:h-auto lg:max-h-[85vh]"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={d.close}
            className="absolute top-4 right-4 z-10 inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-muted/40"
          >
            <X className="size-4" />
          </button>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="flex items-center gap-4">
              <div
                className="flex size-20 shrink-0 flex-col items-center justify-center rounded-2xl border text-center"
                style={{
                  borderColor: `color-mix(in oklab, ${color} 55%, transparent)`,
                  backgroundColor: `color-mix(in oklab, ${color} 22%, var(--card))`,
                }}
              >
                <span className="text-[10px] text-muted-foreground">{element.number}</span>
                <span className="text-2xl font-semibold text-foreground">{element.symbol}</span>
              </div>
              <div>
                <div className="flex items-baseline gap-2">
                  <h2 className="text-2xl font-semibold text-foreground">{nameZh}</h2>
                  <span className="text-sm text-muted-foreground">{element.name}</span>
                </div>
                <span
                  className="mt-1 inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-medium"
                  style={{ borderColor: `color-mix(in oklab, ${color} 45%, transparent)`, color }}
                >
                  {dict.periodicTable.categories[element.category]}
                </span>
              </div>
            </div>

            <dl className="mt-6 grid grid-cols-2 gap-4 text-sm sm:grid-cols-3">
              <div>
                <dt className="text-xs text-muted-foreground">{d.atomicNumber}</dt>
                <dd className="mt-0.5 text-foreground">{element.number}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{d.atomicMass}</dt>
                <dd className="mt-0.5 text-foreground">
                  {element.massIsMassNumber ? `[${element.atomicMass}]` : element.atomicMass}
                </dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{d.period}</dt>
                <dd className="mt-0.5 text-foreground">{element.period}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{d.group}</dt>
                <dd className="mt-0.5 text-foreground">{element.group ?? d.noGroup}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{d.state}</dt>
                <dd className="mt-0.5 text-foreground">{dict.periodicTable.states[element.state]}</dd>
              </div>
              <div>
                <dt className="text-xs text-muted-foreground">{d.electronegativity}</dt>
                <dd className="mt-0.5 text-foreground">{element.electronegativity ?? d.noElectronegativity}</dd>
              </div>
            </dl>

            {element.massIsMassNumber ? (
              <p className="mt-2 text-[11px] text-muted-foreground">（{d.massNumberNote}）</p>
            ) : null}

            <div className="mt-6">
              <p className="text-xs font-semibold text-brand-cyan">{d.electronConfiguration}</p>
              <p className="mt-1.5 font-mono text-sm text-foreground/90">{element.electronConfiguration}</p>
            </div>

            <div className="mt-6">
              <p className="text-xs font-semibold text-brand-cyan">{d.oxidationStates}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                {element.oxidationStates.length > 0 ? (
                  element.oxidationStates.map((ox) => (
                    <span
                      key={ox}
                      className="rounded-full border border-border/60 px-2.5 py-1 text-[11px] text-foreground/85"
                    >
                      {ox > 0 ? `+${ox}` : ox}
                    </span>
                  ))
                ) : (
                  <span className="text-xs text-muted-foreground">{d.noOxidationStates}</span>
                )}
              </div>
            </div>

            {relatedMoleculeIds.length > 0 ? (
              <div className="mt-6">
                <p className="text-xs font-semibold text-brand-cyan">{d.relatedMolecules}</p>
                <div className="mt-3 flex gap-3 overflow-x-auto pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
                  {relatedMoleculeIds.map((id) => {
                    const molecule = getMolecule(id);
                    const inLibrary = LIBRARY_MOLECULE_IDS.includes(id);
                    return (
                      <Link
                        key={id}
                        href={inLibrary ? `/molecule-library?molecule=${id}` : `/bond-explorer?bondType=${molecule.bondTypeId}`}
                        className="glass-subtle flex shrink-0 flex-col items-center gap-2 rounded-2xl border-border/60 p-3 text-center transition-colors hover:bg-muted/20"
                        style={{ width: 112 }}
                      >
                        <div className="h-12 w-full">
                          <AtomVisualization moleculeId={id} size="sm" />
                        </div>
                        <div>
                          <div className="text-xs font-semibold text-foreground">{molecule.formula}</div>
                          <div className="mt-0.5 text-[11px] text-muted-foreground">{resolveMoleculeName(id)}</div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}

            <p className="mt-8 text-center text-[10px] text-muted-foreground">{dict.periodicTable.demoNotice}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
