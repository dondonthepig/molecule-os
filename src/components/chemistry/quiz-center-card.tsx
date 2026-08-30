"use client";

import { ListChecks, Clock, ArrowRight } from "lucide-react";
import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { estimateMinutes, type QuizSetSpec } from "@/lib/chemistry/quiz-center-data";

const DIFFICULTY_ACCENT: Record<QuizSetSpec["difficulty"], string> = {
  beginner: "border-brand-cyan/50 bg-brand-cyan/15 text-brand-cyan",
  intermediate: "border-brand-blue/50 bg-brand-blue/15 text-brand-blue",
  advanced: "border-brand-purple/50 bg-brand-purple/15 text-brand-purple",
};

export function QuizCenterCard({ quizSet, onStart }: { quizSet: QuizSetSpec; onStart: () => void }) {
  const copy = dict.quizCenter.sets[quizSet.id as keyof typeof dict.quizCenter.sets];
  const card = dict.quizCenter.card;
  const minutes = estimateMinutes(quizSet.difficulty, quizSet.questions.length);

  return (
    <div className="glass-subtle flex flex-col rounded-2xl border-border/60 p-5 transition-colors hover:bg-muted/10">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="rounded-full border border-border/60 px-2.5 py-0.5 text-[11px] font-medium text-muted-foreground">
          {dict.quizCenter.categories[quizSet.categoryId]}
        </span>
        <span
          className={cn("rounded-full border px-2.5 py-0.5 text-[11px] font-medium", DIFFICULTY_ACCENT[quizSet.difficulty])}
        >
          {dict.quizCenter.difficulties[quizSet.difficulty]}
        </span>
      </div>

      <h3 className="mt-3 text-base font-semibold text-foreground">{copy.title}</h3>
      <p className="mt-1.5 flex-1 text-sm leading-relaxed text-muted-foreground">{copy.description}</p>

      <div className="mt-4 flex items-center gap-4 text-xs text-muted-foreground">
        <span className="inline-flex items-center gap-1.5">
          <ListChecks className="size-3.5" />
          {quizSet.questions.length} {card.questionsLabel}
        </span>
        <span className="inline-flex items-center gap-1.5">
          <Clock className="size-3.5" />
          {minutes} {card.minutesLabel}
        </span>
      </div>

      <button
        type="button"
        onClick={onStart}
        className="mt-4 inline-flex h-9 items-center justify-center gap-1.5 rounded-full bg-gradient-to-r from-brand-blue via-brand-cyan to-brand-purple px-4 text-sm font-medium text-white transition-transform hover:scale-[1.02] active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/50"
      >
        {card.start}
        <ArrowRight className="size-4" />
      </button>
    </div>
  );
}
