import { Brain } from "lucide-react";
import { dict } from "@/lib/i18n";
import { QUIZ_SETS, QUIZ_CATEGORY_IDS } from "@/lib/chemistry/quiz-center-data";

export function QuizCenterHero() {
  const h = dict.quizCenter.hero;
  const totalQuestions = QUIZ_SETS.reduce((sum, s) => sum + s.questions.length, 0);

  return (
    <div className="glass-subtle relative overflow-hidden rounded-3xl border-border/60 px-6 py-8 sm:px-10 sm:py-10">
      <div className="bg-gradient-aurora absolute inset-0 opacity-20" aria-hidden="true" />
      <div className="relative">
        <span className="inline-flex items-center gap-1.5 rounded-full border border-brand-cyan/40 bg-brand-cyan/10 px-3 py-1 text-xs font-medium text-brand-cyan">
          <Brain className="size-3.5" />
          {h.eyebrow}
        </span>
        <h1 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">{h.heading}</h1>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-muted-foreground">{h.description}</p>

        <div className="mt-6 flex flex-wrap gap-x-8 gap-y-2">
          <p>
            <span className="text-lg font-semibold text-foreground">{QUIZ_CATEGORY_IDS.length}</span>{" "}
            <span className="text-sm text-muted-foreground">{dict.quizCenter.filters.categoryLabel}</span>
          </p>
          <p>
            <span className="text-lg font-semibold text-foreground">{QUIZ_SETS.length}</span>{" "}
            <span className="text-sm text-muted-foreground">{dict.pages.quiz.title}</span>
          </p>
          <p>
            <span className="text-lg font-semibold text-foreground">{totalQuestions}</span>{" "}
            <span className="text-sm text-muted-foreground">{dict.quizCenter.card.questionsLabel}</span>
          </p>
        </div>
      </div>
    </div>
  );
}
