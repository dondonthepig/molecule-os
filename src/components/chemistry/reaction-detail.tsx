"use client";

import * as React from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronLeft, ChevronRight, ArrowUpRight, RotateCcw, Play } from "lucide-react";
import { dict } from "@/lib/i18n";
import { getMolecule } from "@/lib/chemistry/molecules";
import { LIBRARY_MOLECULE_IDS } from "@/lib/chemistry/molecule-library-data";
import { getReaction, type ReactionParticipant } from "@/lib/chemistry/reactions";
import { ReactionEquation } from "./reaction-equation";
import { ReactionTransformationView } from "./reaction-transformation-view";
import { LearningModeToggle, type LearningMode } from "./learning-mode-toggle";

const LEARN_STEPS = ["reactants", "whatChanges", "transformation", "products", "keyTakeaway"] as const;

function moleculeName(id: string): string {
  const molecules = dict.reactionAtlas.molecules;
  return molecules[id as keyof typeof molecules]?.nameZh ?? id;
}

function ParticipantList({ participants }: { participants: ReactionParticipant[] }) {
  const t = dict.reactionAtlas;
  return (
    <div className="flex flex-wrap gap-3">
      {participants.map((p) => {
        const molecule = getMolecule(p.moleculeId);
        const inLibrary = LIBRARY_MOLECULE_IDS.includes(p.moleculeId);
        return (
          <div
            key={p.moleculeId}
            className="glass-subtle flex flex-col items-center gap-1 rounded-2xl border-border/60 px-4 py-3 text-center"
          >
            <span className="text-sm font-semibold text-foreground">
              {p.coefficient && p.coefficient > 1 ? `${p.coefficient} × ` : ""}
              {molecule.formula}
            </span>
            <span className="text-xs text-muted-foreground">{moleculeName(p.moleculeId)}</span>
            {inLibrary ? (
              <Link
                href={`/molecule-library?molecule=${p.moleculeId}`}
                className="mt-1 inline-flex items-center gap-1 text-[11px] text-brand-cyan hover:underline"
              >
                {t.actions.viewInLibrary}
                <ArrowUpRight className="size-3" />
              </Link>
            ) : (
              <Link
                href={`/bond-explorer?bondType=${molecule.bondTypeId}`}
                className="mt-1 inline-flex items-center gap-1 text-[11px] text-brand-cyan hover:underline"
              >
                {t.actions.exploreBond}
                <ArrowUpRight className="size-3" />
              </Link>
            )}
          </div>
        );
      })}
    </div>
  );
}

export function ReactionDetail({
  reactionId,
  onClose,
  onSelectReaction,
}: {
  reactionId: string;
  onClose: () => void;
  onSelectReaction: (id: string) => void;
}) {
  const reaction = getReaction(reactionId);
  const copy = dict.reactionAtlas.reactions[reactionId as keyof typeof dict.reactionAtlas.reactions];
  const t = dict.reactionAtlas;

  const [learningMode, setLearningMode] = React.useState<LearningMode>("learn");
  const [learnStep, setLearnStep] = React.useState(0);
  const [replayToken, setReplayToken] = React.useState(0);
  const [viewResetToken, setViewResetToken] = React.useState(0);
  const [lastReactionId, setLastReactionId] = React.useState(reactionId);

  if (reactionId !== lastReactionId) {
    setLastReactionId(reactionId);
    setLearnStep(0);
    setReplayToken((v) => v + 1);
  }

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

  const showReactants = learningMode === "explore" || learnStep >= 0;
  const showWhatChanges = learningMode === "explore" || learnStep >= 1;
  const showTransformation = learningMode === "explore" || learnStep >= 2;
  const showProducts = learningMode === "explore" || learnStep >= 3;
  const showKeyTakeaway = learningMode === "explore" || learnStep >= 4;

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
          aria-label={copy?.name}
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 16, scale: 0.98 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
          className="glass relative flex h-full w-full max-w-4xl flex-col overflow-hidden rounded-3xl border-border/60 lg:h-[85vh]"
        >
          <button
            type="button"
            onClick={onClose}
            aria-label={t.actions.close}
            className="absolute top-4 right-4 z-10 inline-flex size-9 items-center justify-center rounded-full border border-border/60 bg-background/60 text-foreground backdrop-blur-sm transition-colors hover:bg-muted/40"
          >
            <X className="size-4" />
          </button>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="mb-4 flex flex-wrap items-start justify-between gap-4 pr-10">
              <div>
                <div className="flex flex-wrap items-center gap-1.5">
                  <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
                    {dict.organicChemistry.reactionTypes[reaction.reactionTypeId]}
                  </span>
                  <span className="rounded-full border border-brand-blue/40 bg-brand-blue/10 px-2.5 py-0.5 text-[11px] font-medium text-brand-blue">
                    {t.difficulty[reaction.difficulty]}
                  </span>
                </div>
                <h2 className="mt-2 text-2xl font-semibold text-foreground">{copy?.name}</h2>
              </div>
              <LearningModeToggle mode={learningMode} onChange={setLearningMode} />
            </div>

            <div className="glass-subtle rounded-2xl border-border/60 p-4">
              <ReactionEquation reaction={reaction} />
              <p className="mt-2 text-xs text-muted-foreground">
                {t.labels.temperature}：{t.temperatures[reaction.temperatureId]}
                {reaction.symbolicOxidant ? ` · ${t.labels.symbolicOxidantNote}` : ""}
              </p>
            </div>

            <p className="mt-4 text-sm leading-relaxed text-foreground/90">{copy?.summary}</p>

            {showReactants ? (
              <div className="mt-6">
                <p className="text-xs font-semibold text-brand-cyan">{t.learningSteps.reactants}</p>
                <div className="mt-3">
                  <ParticipantList participants={reaction.reactants} />
                </div>
              </div>
            ) : null}

            {showWhatChanges ? (
              <div className="mt-6">
                <p className="text-xs font-semibold text-brand-cyan">{t.learningSteps.whatChanges}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{copy?.whatChanges}</p>
              </div>
            ) : null}

            {showTransformation ? (
              <div className="mt-6">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-xs font-semibold text-brand-cyan">{t.sections.transformation}</p>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setReplayToken((v) => v + 1)}
                      className="glass-subtle inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium text-foreground hover:bg-muted/40"
                    >
                      <Play className="size-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewResetToken((v) => v + 1)}
                      className="glass-subtle inline-flex h-8 items-center gap-1.5 rounded-full px-3 text-[11px] font-medium text-foreground hover:bg-muted/40"
                    >
                      <RotateCcw className="size-3.5" />
                    </button>
                  </div>
                </div>
                <ReactionTransformationView reaction={reaction} replayToken={replayToken} viewResetToken={viewResetToken} />
              </div>
            ) : null}

            {showProducts ? (
              <div className="mt-6">
                <p className="text-xs font-semibold text-brand-cyan">{t.learningSteps.products}</p>
                <div className="mt-3">
                  <ParticipantList participants={reaction.products} />
                </div>
              </div>
            ) : null}

            {showKeyTakeaway ? (
              <div className="mt-6">
                <p className="text-xs font-semibold text-brand-cyan">{t.learningSteps.keyTakeaway}</p>
                <p className="mt-1.5 text-sm leading-relaxed text-foreground/90">{copy?.keyTakeaway}</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {reaction.organicCategoryFrom ? (
                    <Link
                      href={`/organic-chemistry?category=${reaction.organicCategoryFrom}`}
                      className="glass-subtle inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
                    >
                      {t.actions.viewInOrganicChemistry}
                      <ArrowUpRight className="size-3.5" />
                    </Link>
                  ) : null}
                  {reaction.reversePairId ? (
                    <button
                      type="button"
                      onClick={() => onSelectReaction(reaction.reversePairId!)}
                      className="glass-subtle inline-flex items-center gap-2 rounded-full px-4 py-2 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
                    >
                      {t.labels.viewReverse}
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            {learningMode === "learn" ? (
              <div className="glass-subtle mt-6 flex items-center justify-between rounded-2xl border-border/60 px-4 py-3">
                <button
                  type="button"
                  onClick={() => setLearnStep((s) => Math.max(0, s - 1))}
                  disabled={learnStep === 0}
                  className="inline-flex items-center gap-1 text-xs font-medium text-foreground disabled:opacity-30"
                >
                  <ChevronLeft className="size-4" />
                  {t.actions.stepBack}
                </button>
                <span className="text-xs text-muted-foreground">
                  {t.actions.stepLabel} {learnStep + 1} / {LEARN_STEPS.length} · {t.learningSteps[LEARN_STEPS[learnStep]]}
                </span>
                <button
                  type="button"
                  onClick={() => setLearnStep((s) => Math.min(LEARN_STEPS.length - 1, s + 1))}
                  disabled={learnStep === LEARN_STEPS.length - 1}
                  className="inline-flex items-center gap-1 text-xs font-medium text-foreground disabled:opacity-30"
                >
                  {t.actions.stepNext}
                  <ChevronRight className="size-4" />
                </button>
              </div>
            ) : null}

            <p className="mt-6 text-center text-[10px] text-muted-foreground">{t.demoNotice}</p>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
