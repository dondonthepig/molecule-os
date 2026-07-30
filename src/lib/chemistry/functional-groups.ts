// Reusable functional-group metadata — structural/technical only. Display
// name/description live in `dict.moleculeLibrary.functionalGroups[id]`.
// Reusable by the future Organic Chemistry page, per the Phase 2B spec.

export type FunctionalGroupId =
  | "hydroxyl"
  | "carbonyl"
  | "carboxyl"
  | "ester"
  | "amino"
  | "amide"
  | "alkene"
  | "alkyne"
  | "aromatic";

export const FUNCTIONAL_GROUP_IDS: FunctionalGroupId[] = [
  "hydroxyl",
  "carbonyl",
  "carboxyl",
  "ester",
  "amino",
  "amide",
  "alkene",
  "alkyne",
  "aromatic",
];

export type FunctionalGroupSpec = {
  id: FunctionalGroupId;
  /** Universal chemical notation — not translated. */
  formulaFragment: string;
};

export const FUNCTIONAL_GROUPS: Record<FunctionalGroupId, FunctionalGroupSpec> = {
  hydroxyl: { id: "hydroxyl", formulaFragment: "-OH" },
  carbonyl: { id: "carbonyl", formulaFragment: "C=O" },
  carboxyl: { id: "carboxyl", formulaFragment: "-COOH" },
  ester: { id: "ester", formulaFragment: "-COO-" },
  amino: { id: "amino", formulaFragment: "-NH₂" },
  amide: { id: "amide", formulaFragment: "-CONH₂" },
  alkene: { id: "alkene", formulaFragment: "C=C" },
  alkyne: { id: "alkyne", formulaFragment: "C≡C" },
  aromatic: { id: "aromatic", formulaFragment: "C₆H₅-" },
};
