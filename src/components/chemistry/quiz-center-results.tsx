"use client";

import { Trophy, RotateCcw, ArrowLeft } from "lucide-react";
import { dict } from "@/lib/i18n";
import { getQuizSet } from "@/lib/chemistry/quiz-center-data";

export function QuizCenterResults({
  setId,
  correctCount,
  totalCount,
  onRetry,
  onBackToCenter,
}: {
  setId: string;
  correctCount: number;
  totalCount: number;
  onRetry: () => void;
  onBackToCenter: () => void;
}) {
  const quizSet = getQuizSet(setId);
  const setCopy = dict.quizCenter.sets[setId as keyof typeof dict.quizCenter.sets];
  const r = dict.quizCenter.results;
  const percentage = Math.round((correctCount / totalCount) * 100);
  const tier = percentage >= 90 ? r.tierExcellent : percentage >= 70 ? r.tierGood : r.tierPractice;

  return (
    <div className="glass-subtle mx-auto flex max-w-md flex-col items-center rounded-2xl border-border/60 p-8 text-center">
      <span className="flex size-14 items-center justify-center rounded-2xl bg-gradient-to-br from-brand-blue via-brand-cyan to-brand-purple shadow-[0_0_30px_-8px_var(--color-brand-blue)]">
        <Trophy className="size-6 text-white" strokeWidth={2} />
      </span>

      <p className="mt-5 text-xs font-semibold text-brand-cyan">{r.title}</p>
      <h2 className="mt-1 text-xl font-semibold text-foreground">{setCopy.title}</h2>

      <div className="mt-6 grid w-full grid-cols-3 gap-3">
        <div className="glass rounded-xl border-border/60 px-2 py-3">
          <p className="text-2xl font-semibold text-foreground">{percentage}%</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{r.percentageLabel}</p>
        </div>
        <div className="glass rounded-xl border-border/60 px-2 py-3">
          <p className="text-2xl font-semibold text-emerald-300">{correctCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{r.correctLabel}</p>
        </div>
        <div className="glass rounded-xl border-border/60 px-2 py-3">
          <p className="text-2xl font-semibold text-destructive">{totalCount - correctCount}</p>
          <p className="mt-0.5 text-[11px] text-muted-foreground">{r.incorrectLabel}</p>
        </div>
      </div>

      <p className="mt-5 text-sm leading-relaxed text-muted-foreground">{tier}</p>
      <p className="mt-1 text-xs text-muted-foreground">
        {r.scoreLabel}: {correctCount} / {totalCount} · {dict.quizCenter.categories[quizSet.categoryId]} ·{" "}
        {dict.quizCenter.difficulties[quizSet.difficulty]}
      </p>

      <div className="mt-7 flex flex-wrap justify-center gap-2">
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex h-9 items-center gap-1.5 rounded-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple px-4 text-sm font-medium text-white transition-transform hover:scale-[1.03] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <RotateCcw className="size-4" />
          {r.retry}
        </button>
        <button
          type="button"
          onClick={onBackToCenter}
          className="glass-subtle inline-flex h-9 items-center gap-1.5 rounded-full px-4 text-sm font-medium text-foreground transition-colors hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
        >
          <ArrowLeft className="size-4" />
          {r.backToCenter}
        </button>
      </div>
    </div>
  );
}
