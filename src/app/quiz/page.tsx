import type { Metadata } from "next";
import { Suspense } from "react";
import { QuizCenterWorkspace } from "@/components/chemistry/quiz-center-workspace";
import { QuizCenterWithSearchParams } from "@/components/chemistry/quiz-center-search-params";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.pages.quiz.title };

export default function QuizPage() {
  return (
    <Suspense fallback={<QuizCenterWorkspace />}>
      <QuizCenterWithSearchParams />
    </Suspense>
  );
}
