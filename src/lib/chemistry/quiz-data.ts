import type { BondTypeId } from "./bond-types";

// Structural quiz data only (which question, which option is correct).
// Question/option/explanation text lives in `dict.bondExplorer.quiz[bondTypeId][id]`.

export type QuizQuestionRef = {
  id: string;
  /** Index into the corresponding dict entry's `options` array. */
  correctIndex: number;
};

export const QUIZ_QUESTIONS: Record<BondTypeId, QuizQuestionRef[]> = {
  ionic: [
    { id: "q1", correctIndex: 1 },
    { id: "q2", correctIndex: 0 },
  ],
  covalent: [
    { id: "q1", correctIndex: 0 },
    { id: "q2", correctIndex: 2 },
  ],
  polarCovalent: [
    { id: "q1", correctIndex: 1 },
    { id: "q2", correctIndex: 0 },
  ],
  metallic: [
    { id: "q1", correctIndex: 2 },
    { id: "q2", correctIndex: 0 },
  ],
  hydrogen: [
    { id: "q1", correctIndex: 0 },
    { id: "q2", correctIndex: 1 },
  ],
};
