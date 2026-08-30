"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dict } from "@/lib/i18n";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";
import { getQuizSet } from "@/lib/chemistry/quiz-center-data";

function formatCounter(template: string, current: number, total: number): string {
  return template.replace("{current}", String(current)).replace("{total}", String(total));
}

/** One quiz-taking session for a single set. Unmounted/remounted by the parent workspace to reset state between attempts. */
export function QuizCenterSession({
  setId,
  onFinish,
  onExit,
}: {
  setId: string;
  onFinish: (correctCount: number, totalCount: number) => void;
  onExit: () => void;
}) {
  const quizSet = getQuizSet(setId);
  const questionsCopy = dict.quizCenter.questions[setId as keyof typeof dict.quizCenter.questions];
  const s = dict.quizCenter.session;
  const reducedMotion = usePrefersReducedMotion();

  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [revealed, setRevealed] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [showExitConfirm, setShowExitConfirm] = React.useState(false);

  const total = quizSet.questions.length;
  const current = quizSet.questions[questionIndex];
  const currentCopy = questionsCopy[current.id as keyof typeof questionsCopy];
  const isCorrect = selectedIndex === current.correctIndex;
  const isLastQuestion = questionIndex === total - 1;

  const handleCheck = React.useCallback(() => {
    if (selectedIndex === null || revealed) return;
    setRevealed(true);
    if (isCorrect) setScore((sc) => sc + 1);
  }, [selectedIndex, revealed, isCorrect]);

  const handleAdvance = React.useCallback(() => {
    if (!revealed) return;
    if (isLastQuestion) {
      onFinish(score, total);
      return;
    }
    setSelectedIndex(null);
    setRevealed(false);
    setQuestionIndex((i) => i + 1);
  }, [revealed, isLastQuestion, onFinish, score, total]);

  React.useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (showExitConfirm) {
        if (e.key === "Escape") setShowExitConfirm(false);
        return;
      }
      if (e.key === "Escape") {
        setShowExitConfirm(true);
        return;
      }
      if (!revealed && /^[1-4]$/.test(e.key)) {
        const idx = Number(e.key) - 1;
        if (idx < currentCopy.options.length) setSelectedIndex(idx);
        return;
      }
      if (e.key === "Enter") {
        if (!revealed) handleCheck();
        else handleAdvance();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [revealed, showExitConfirm, currentCopy, handleCheck, handleAdvance]);

  const progressPercent = ((questionIndex + (revealed ? 1 : 0)) / total) * 100;

  return (
    <div className="glass-subtle relative rounded-2xl border-border/60 p-5 sm:p-6">
      <div className="flex items-center justify-between gap-3">
        <div className="flex-1">
          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span>{formatCounter(s.questionCounter, questionIndex + 1, total)}</span>
            <span>
              {s.scoreLabel}: {score}
            </span>
          </div>
          <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-muted/40">
            <div
              className={cn("h-full rounded-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple", !reducedMotion && "transition-[width] duration-300")}
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
        <button
          type="button"
          onClick={() => setShowExitConfirm(true)}
          aria-label={s.exit}
          className="inline-flex size-8 shrink-0 items-center justify-center rounded-full border border-border/60 text-muted-foreground transition-colors hover:bg-muted/25 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <X className="size-4" />
        </button>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${setId}-${questionIndex}`}
          initial={reducedMotion ? undefined : { opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={reducedMotion ? undefined : { opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
        >
          <p className="mt-5 text-base font-medium text-foreground">{currentCopy.question}</p>

          <div className="mt-4 flex flex-col gap-2" role="radiogroup" aria-label={currentCopy.question}>
            {currentCopy.options.map((option, i) => {
              const isSelected = selectedIndex === i;
              const showCorrect = revealed && i === current.correctIndex;
              const showWrong = revealed && isSelected && i !== current.correctIndex;
              return (
                <button
                  key={i}
                  type="button"
                  role="radio"
                  aria-checked={isSelected}
                  disabled={revealed}
                  onClick={() => setSelectedIndex(i)}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
                    showCorrect
                      ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                      : showWrong
                        ? "border-destructive/50 bg-destructive/10 text-destructive"
                        : isSelected
                          ? "border-brand-blue/50 bg-muted/50 text-foreground"
                          : "border-border/60 text-foreground/85 hover:bg-muted/25",
                  )}
                >
                  <span className="flex items-center gap-2.5">
                    <span className="flex size-5 shrink-0 items-center justify-center rounded-full border border-current/30 text-[10px]">
                      {i + 1}
                    </span>
                    {option}
                  </span>
                  {showCorrect ? <Check className="size-4 shrink-0" /> : null}
                  {showWrong ? <X className="size-4 shrink-0" /> : null}
                </button>
              );
            })}
          </div>

          {revealed ? (
            <motion.div
              initial={reducedMotion ? undefined : { opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 overflow-hidden rounded-xl bg-muted/30 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground"
            >
              <span className={cn("font-medium", isCorrect ? "text-emerald-300" : "text-destructive")}>
                {isCorrect ? s.correct : s.incorrect}
              </span>{" "}
              {currentCopy.explanation}
            </motion.div>
          ) : null}

          <div className="mt-4 flex justify-end">
            {revealed ? (
              <button
                type="button"
                onClick={handleAdvance}
                className="inline-flex h-9 items-center rounded-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple px-4 text-sm font-medium text-white transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {isLastQuestion ? s.finishQuiz : s.nextQuestion}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheck}
                disabled={selectedIndex === null}
                className="glass-subtle inline-flex h-9 items-center rounded-full px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/40 disabled:opacity-40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {s.checkAnswer}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      {showExitConfirm ? (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-background/85 p-6 backdrop-blur-sm"
          role="alertdialog"
          aria-modal="true"
          aria-label={s.exitConfirmTitle}
        >
          <div className="glass max-w-xs rounded-2xl border-border/60 p-5 text-center">
            <p className="text-sm font-medium text-foreground">{s.exitConfirmTitle}</p>
            <p className="mt-1.5 text-xs text-muted-foreground">{s.exitConfirmHint}</p>
            <div className="mt-4 flex justify-center gap-2">
              <button
                type="button"
                onClick={() => setShowExitConfirm(false)}
                className="glass-subtle inline-flex h-9 items-center rounded-full px-4 text-xs font-medium text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {s.exitCancelAction}
              </button>
              <button
                type="button"
                onClick={onExit}
                className="inline-flex h-9 items-center rounded-full border border-destructive/50 bg-destructive/10 px-4 text-xs font-medium text-destructive transition-colors hover:bg-destructive/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
              >
                {s.exitConfirmAction}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
