"use client";

import * as React from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Check, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { dict } from "@/lib/i18n";
import { QUIZ_QUESTIONS } from "@/lib/chemistry/quiz-data";
import type { BondTypeId } from "@/lib/chemistry/bond-types";

/** Self-contained mini quiz for one bond type. Mount with `key={bondTypeId}` to reset state on switch. */
export function BondQuiz({ bondTypeId }: { bondTypeId: BondTypeId }) {
  const questions = QUIZ_QUESTIONS[bondTypeId];
  const quizCopy = dict.bondExplorer.quiz[bondTypeId];
  const ui = dict.bondExplorer.quizUi;

  const [questionIndex, setQuestionIndex] = React.useState(0);
  const [selectedIndex, setSelectedIndex] = React.useState<number | null>(null);
  const [revealed, setRevealed] = React.useState(false);
  const [score, setScore] = React.useState(0);

  const finished = questionIndex >= questions.length;
  const current = !finished ? questions[questionIndex] : null;
  const currentCopy = current ? quizCopy[current.id as keyof typeof quizCopy] : null;
  const isCorrect = current && selectedIndex === current.correctIndex;

  const handleCheck = () => {
    if (selectedIndex === null || revealed) return;
    setRevealed(true);
    if (isCorrect) setScore((s) => s + 1);
  };

  const handleNext = () => {
    setSelectedIndex(null);
    setRevealed(false);
    setQuestionIndex((i) => i + 1);
  };

  if (finished) {
    return (
      <div className="glass-subtle rounded-2xl border-border/60 p-5 text-center">
        <p className="text-sm font-medium text-foreground">{ui.finished}</p>
        <p className="mt-1 text-xs text-muted-foreground">
          {ui.scoreLabel}: {score} / {questions.length}
        </p>
      </div>
    );
  }

  if (!current || !currentCopy) return null;

  return (
    <div className="glass-subtle rounded-2xl border-border/60 p-5">
      <div className="flex items-center justify-between text-xs text-muted-foreground">
        <span>
          {questionIndex + 1} / {questions.length}
        </span>
        <span>
          {ui.scoreLabel}: {score}
        </span>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={`${bondTypeId}-${questionIndex}`}
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -12 }}
          transition={{ duration: 0.25 }}
        >
          <p className="mt-3 text-sm font-medium text-foreground">{currentCopy.question}</p>

          <div className="mt-4 flex flex-col gap-2">
            {currentCopy.options.map((option, i) => {
              const isSelected = selectedIndex === i;
              const showCorrect = revealed && i === current.correctIndex;
              const showWrong = revealed && isSelected && i !== current.correctIndex;
              return (
                <button
                  key={i}
                  type="button"
                  disabled={revealed}
                  onClick={() => setSelectedIndex(i)}
                  className={cn(
                    "flex items-center justify-between gap-2 rounded-xl border px-3.5 py-2.5 text-left text-sm transition-colors",
                    showCorrect
                      ? "border-emerald-400/50 bg-emerald-400/10 text-emerald-300"
                      : showWrong
                        ? "border-destructive/50 bg-destructive/10 text-destructive"
                        : isSelected
                          ? "border-brand-blue/50 bg-muted/50 text-foreground"
                          : "border-border/60 text-foreground/85 hover:bg-muted/25",
                  )}
                >
                  <span>{option}</span>
                  {showCorrect ? <Check className="size-4 shrink-0" /> : null}
                  {showWrong ? <X className="size-4 shrink-0" /> : null}
                </button>
              );
            })}
          </div>

          {revealed ? (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              className="mt-3 overflow-hidden rounded-xl bg-muted/30 px-3.5 py-2.5 text-xs leading-relaxed text-muted-foreground"
            >
              <span className={cn("font-medium", isCorrect ? "text-emerald-300" : "text-destructive")}>
                {isCorrect ? ui.correct : ui.incorrect}
              </span>{" "}
              {currentCopy.explanation}
            </motion.div>
          ) : null}

          <div className="mt-4 flex justify-end">
            {revealed ? (
              <button
                type="button"
                onClick={handleNext}
                className="inline-flex h-8 items-center rounded-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple px-4 text-xs font-medium text-white transition-transform hover:scale-[1.03] active:scale-[0.98]"
              >
                {ui.nextQuestion}
              </button>
            ) : (
              <button
                type="button"
                onClick={handleCheck}
                disabled={selectedIndex === null}
                className="glass-subtle inline-flex h-8 items-center rounded-full px-4 text-xs font-medium text-foreground transition-colors hover:bg-muted/40 disabled:opacity-40"
              >
                {ui.checkAnswer}
              </button>
            )}
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
