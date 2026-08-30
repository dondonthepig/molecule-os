"use client";

import { useSearchParams } from "next/navigation";
import { QuizCenterWorkspace } from "./quiz-center-workspace";
import { QUIZ_SET_IDS } from "@/lib/chemistry/quiz-center-data";

/** Reads an optional `?quiz=` param to jump straight into a specific quiz set on load. */
export function QuizCenterWithSearchParams() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("quiz");
  const initialSetId = requested && QUIZ_SET_IDS.includes(requested) ? requested : undefined;

  return <QuizCenterWorkspace initialSetId={initialSetId} />;
}
