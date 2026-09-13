import type { MoleculeRenderMode } from "@/components/chemistry/bond-visualization-scene";
import type { TutorDifficulty, TutorLearningMode } from "@/lib/chemistry/tutor-data";

export type MotionPreference = "auto" | "reduced";
export type NotationPreference = "molecularFormula" | "structural";

export type MoleculeOSSettings = {
  motion: MotionPreference;
  preferredDifficulty: TutorDifficulty;
  defaultLearningMode: TutorLearningMode;
  showExplanations: boolean;
  showHintsBeforeAnswers: boolean;
  notation: NotationPreference;
  showMolecularFormulas: boolean;
  showMolecularNames: boolean;
  defaultVisualization: MoleculeRenderMode;
};

export const DEFAULT_SETTINGS: MoleculeOSSettings = {
  motion: "auto",
  preferredDifficulty: "intermediate",
  defaultLearningMode: "explain",
  showExplanations: true,
  showHintsBeforeAnswers: false,
  notation: "molecularFormula",
  showMolecularFormulas: true,
  showMolecularNames: true,
  defaultVisualization: "ballAndStick",
};

export const SETTINGS_STORAGE_KEY = "moleculeos:settings:v1";
