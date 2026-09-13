// Structural cross-references for the AI Tutor's mock knowledge base. All
// question/answer/hint copy lives in `dict.aiTutor.knowledgeBase[id]` — this
// file only holds ids, topic/route cross-references, and flags, same as the
// "id + correctIndex only" split used by quiz-center-data.ts.

export type TutorTopicId = "bonding" | "geometry" | "periodicTrends" | "organic" | "reactions";

export const TUTOR_TOPIC_IDS: TutorTopicId[] = [
  "bonding",
  "geometry",
  "periodicTrends",
  "organic",
  "reactions",
];

export type TutorLearningMode =
  | "explain"
  | "solve"
  | "socratic"
  | "examPrep"
  | "reviewMistakes"
  | "terminology";

export const TUTOR_LEARNING_MODES: TutorLearningMode[] = [
  "explain",
  "solve",
  "socratic",
  "examPrep",
  "reviewMistakes",
  "terminology",
];

export type TutorDifficulty = "beginner" | "intermediate" | "advanced";

export const TUTOR_DIFFICULTIES: TutorDifficulty[] = ["beginner", "intermediate", "advanced"];

/** Nav keys whose `dict.nav.items[key].label` doubles as this link's display label. */
export type TutorNavKey =
  | "bondExplorer"
  | "moleculeLibrary"
  | "organicChemistry"
  | "reactionAtlas"
  | "periodicTable";

export type TutorRelatedLink = { navKey: TutorNavKey; href: string };

export type TutorKnowledgeId =
  | "waterBentShape"
  | "polarityCheck"
  | "ionicVsCovalent"
  | "electronegativityTrend"
  | "hydrogenBondingWater"
  | "metallicBonding"
  | "alcoholReactions"
  | "esterification"
  | "combustionMethane"
  | "aromaticBenzene"
  | "additionHydrogenation"
  | "amideAmine";

export type TutorKnowledgeEntry = {
  id: TutorKnowledgeId;
  topic: TutorTopicId;
  /** Whether `dict.aiTutor.knowledgeBase[id].steps` is populated for "solve" mode. */
  hasSteps: boolean;
  relatedLinks: TutorRelatedLink[];
};

export const TUTOR_KNOWLEDGE_BASE: TutorKnowledgeEntry[] = [
  {
    id: "waterBentShape",
    topic: "geometry",
    hasSteps: false,
    relatedLinks: [
      { navKey: "moleculeLibrary", href: "/molecule-library?molecule=h2o" },
      { navKey: "bondExplorer", href: "/bond-explorer?bondType=polarCovalent" },
    ],
  },
  {
    id: "polarityCheck",
    topic: "bonding",
    hasSteps: false,
    relatedLinks: [
      { navKey: "bondExplorer", href: "/bond-explorer?bondType=polarCovalent" },
      { navKey: "moleculeLibrary", href: "/molecule-library?molecule=co2" },
    ],
  },
  {
    id: "ionicVsCovalent",
    topic: "bonding",
    hasSteps: false,
    relatedLinks: [
      { navKey: "bondExplorer", href: "/bond-explorer?bondType=ionic" },
      { navKey: "moleculeLibrary", href: "/molecule-library?molecule=nacl" },
    ],
  },
  {
    id: "electronegativityTrend",
    topic: "periodicTrends",
    hasSteps: false,
    relatedLinks: [
      { navKey: "periodicTable", href: "/periodic-table?element=F" },
      { navKey: "bondExplorer", href: "/bond-explorer?bondType=polarCovalent" },
    ],
  },
  {
    id: "hydrogenBondingWater",
    topic: "bonding",
    hasSteps: false,
    relatedLinks: [
      { navKey: "bondExplorer", href: "/bond-explorer?bondType=hydrogen" },
      { navKey: "moleculeLibrary", href: "/molecule-library?molecule=h2o" },
    ],
  },
  {
    id: "metallicBonding",
    topic: "bonding",
    hasSteps: false,
    relatedLinks: [
      { navKey: "bondExplorer", href: "/bond-explorer?bondType=metallic" },
      { navKey: "periodicTable", href: "/periodic-table?element=Fe" },
    ],
  },
  {
    id: "alcoholReactions",
    topic: "organic",
    hasSteps: false,
    relatedLinks: [
      { navKey: "organicChemistry", href: "/organic-chemistry?category=alcohol" },
      { navKey: "moleculeLibrary", href: "/molecule-library?molecule=ethanol" },
    ],
  },
  {
    id: "esterification",
    topic: "reactions",
    hasSteps: true,
    relatedLinks: [
      { navKey: "reactionAtlas", href: "/reaction-atlas?reaction=esterificationAceticAcidMethanol" },
      { navKey: "organicChemistry", href: "/organic-chemistry?category=ester" },
    ],
  },
  {
    id: "combustionMethane",
    topic: "reactions",
    hasSteps: true,
    relatedLinks: [
      { navKey: "reactionAtlas", href: "/reaction-atlas?reaction=combustionMethane" },
      { navKey: "moleculeLibrary", href: "/molecule-library?molecule=ch4" },
    ],
  },
  {
    id: "aromaticBenzene",
    topic: "organic",
    hasSteps: false,
    relatedLinks: [
      { navKey: "organicChemistry", href: "/organic-chemistry?category=aromatic" },
      { navKey: "moleculeLibrary", href: "/molecule-library?molecule=benzene" },
    ],
  },
  {
    id: "additionHydrogenation",
    topic: "reactions",
    hasSteps: true,
    relatedLinks: [
      { navKey: "reactionAtlas", href: "/reaction-atlas?reaction=hydrogenationEthyleneToEthane" },
      { navKey: "organicChemistry", href: "/organic-chemistry?category=alkene" },
    ],
  },
  {
    id: "amideAmine",
    topic: "organic",
    hasSteps: false,
    relatedLinks: [
      { navKey: "organicChemistry", href: "/organic-chemistry?category=amide" },
      { navKey: "moleculeLibrary", href: "/molecule-library?molecule=acetamide" },
    ],
  },
];

export const TUTOR_KNOWLEDGE_IDS: TutorKnowledgeId[] = TUTOR_KNOWLEDGE_BASE.map((e) => e.id);

export function getTutorKnowledgeEntry(id: TutorKnowledgeId): TutorKnowledgeEntry {
  const entry = TUTOR_KNOWLEDGE_BASE.find((e) => e.id === id);
  if (!entry) throw new Error(`Unknown tutor knowledge id: ${id}`);
  return entry;
}
