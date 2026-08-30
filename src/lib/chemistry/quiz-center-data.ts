// Quiz Center's own data layer — structural/technical data only, no display
// text (question/option/explanation copy lives in `dict.quizCenter.questions`,
// set title/description in `dict.quizCenter.sets`). Every question is derived
// from facts already established elsewhere in the codebase's chemistry data
// (`periodic-table.ts`, `molecules.ts`, `bond-types.ts`,
// `molecule-library-data.ts`, `functional-groups.ts`, `organic-chemistry.ts`,
// `organic-reactions.ts`, `reactions.ts`) — no invented chemistry facts.
// Follows the same "id + correctIndex only" pattern as bond-explorer's
// `quiz-data.ts` so the two systems stay architecturally consistent.

export type QuizCategoryId =
  | "elements"
  | "atomicStructure"
  | "chemicalBonds"
  | "molecularStructure"
  | "functionalGroups"
  | "organicChemistry"
  | "chemicalReactions"
  | "mixed";

export const QUIZ_CATEGORY_IDS: QuizCategoryId[] = [
  "elements",
  "atomicStructure",
  "chemicalBonds",
  "molecularStructure",
  "functionalGroups",
  "organicChemistry",
  "chemicalReactions",
  "mixed",
];

export type QuizDifficulty = "beginner" | "intermediate" | "advanced";

export const QUIZ_DIFFICULTIES: QuizDifficulty[] = ["beginner", "intermediate", "advanced"];

export type QuizQuestionRef = {
  id: string;
  /** Index into the corresponding dict entry's `options` array. */
  correctIndex: number;
};

export type QuizSetSpec = {
  id: string;
  categoryId: QuizCategoryId;
  difficulty: QuizDifficulty;
  questions: QuizQuestionRef[];
};

/** Rough reading+thinking time budget — scales with question count and difficulty, not a fabricated fixed number. */
const DIFFICULTY_MINUTE_FACTOR: Record<QuizDifficulty, number> = {
  beginner: 0.6,
  intermediate: 0.8,
  advanced: 1.0,
};

export function estimateMinutes(difficulty: QuizDifficulty, questionCount: number): number {
  return Math.max(2, Math.ceil(questionCount * DIFFICULTY_MINUTE_FACTOR[difficulty]));
}

function fiveQuestions(ids: number[]): QuizQuestionRef[] {
  return ids.map((correctIndex, i) => ({ id: `q${i + 1}`, correctIndex }));
}

export const QUIZ_SETS: QuizSetSpec[] = [
  { id: "elements-beginner", categoryId: "elements", difficulty: "beginner", questions: fiveQuestions([1, 1, 2, 1, 1]) },
  { id: "elements-intermediate", categoryId: "elements", difficulty: "intermediate", questions: fiveQuestions([1, 2, 1, 1, 1]) },
  { id: "elements-advanced", categoryId: "elements", difficulty: "advanced", questions: fiveQuestions([1, 2, 1, 0, 2]) },

  { id: "atomicStructure-beginner", categoryId: "atomicStructure", difficulty: "beginner", questions: fiveQuestions([1, 0, 1, 1, 0]) },

  { id: "chemicalBonds-beginner", categoryId: "chemicalBonds", difficulty: "beginner", questions: fiveQuestions([0, 1, 2, 2, 2]) },
  { id: "chemicalBonds-intermediate", categoryId: "chemicalBonds", difficulty: "intermediate", questions: fiveQuestions([2, 2, 0, 2, 2]) },
  { id: "chemicalBonds-advanced", categoryId: "chemicalBonds", difficulty: "advanced", questions: fiveQuestions([0, 0, 1, 2, 1]) },

  { id: "molecularStructure-beginner", categoryId: "molecularStructure", difficulty: "beginner", questions: fiveQuestions([1, 1, 2, 3, 1]) },
  { id: "molecularStructure-intermediate", categoryId: "molecularStructure", difficulty: "intermediate", questions: fiveQuestions([1, 0, 1, 2, 1]) },

  { id: "functionalGroups-beginner", categoryId: "functionalGroups", difficulty: "beginner", questions: fiveQuestions([1, 2, 1, 1, 1]) },

  { id: "organicChemistry-intermediate", categoryId: "organicChemistry", difficulty: "intermediate", questions: fiveQuestions([2, 1, 1, 1, 1]) },

  { id: "chemicalReactions-beginner", categoryId: "chemicalReactions", difficulty: "beginner", questions: fiveQuestions([0, 1, 1, 2, 1]) },
  { id: "chemicalReactions-advanced", categoryId: "chemicalReactions", difficulty: "advanced", questions: fiveQuestions([0, 1, 0, 1, 1]) },

  { id: "mixed-intermediate", categoryId: "mixed", difficulty: "intermediate", questions: fiveQuestions([0, 2, 1, 1, 2]) },
];

export const QUIZ_SET_IDS: string[] = QUIZ_SETS.map((s) => s.id);

export function getQuizSet(id: string): QuizSetSpec {
  const set = QUIZ_SETS.find((s) => s.id === id);
  if (!set) throw new Error(`Unknown quiz set id: ${id}`);
  return set;
}

export function getQuizSetsByCategory(categoryId: QuizCategoryId): QuizSetSpec[] {
  return QUIZ_SETS.filter((s) => s.categoryId === categoryId);
}
