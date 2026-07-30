import type { FunctionalGroupId } from "./functional-groups";
import type { MoleculeCategory } from "./molecule-library-data";

// Structural cross-references only — display text lives in
// `dict.organicChemistry.*`. Reuses `functional-groups.ts` and
// `molecule-library-data.ts` rather than duplicating either.

export type OrganicCategoryId =
  | "alkane"
  | "alkene"
  | "alkyne"
  | "aromatic"
  | "alcohol"
  | "ether"
  | "aldehyde"
  | "ketone"
  | "carboxylicAcid"
  | "ester"
  | "amine"
  | "amide";

export const ORGANIC_CATEGORY_IDS: OrganicCategoryId[] = [
  "alkane",
  "alkene",
  "alkyne",
  "aromatic",
  "alcohol",
  "ether",
  "aldehyde",
  "ketone",
  "carboxylicAcid",
  "ester",
  "amine",
  "amide",
];

export type OrganicCategoryEntry = {
  id: OrganicCategoryId;
  /** Undefined for categories with no single-atom-group signature (alkane, ether). */
  functionalGroupId?: FunctionalGroupId;
  /** Corresponding key in molecule-library-data's MoleculeCategory — same id for every entry here. */
  libraryCategory: MoleculeCategory;
  /** Molecule ids from molecules.ts / molecule-library-data.ts, in display order. */
  representativeMoleculeIds: string[];
};

export const ORGANIC_CATEGORIES: Record<OrganicCategoryId, OrganicCategoryEntry> = {
  alkane: { id: "alkane", libraryCategory: "alkane", representativeMoleculeIds: ["ch4"] },
  alkene: { id: "alkene", functionalGroupId: "alkene", libraryCategory: "alkene", representativeMoleculeIds: ["ethylene"] },
  alkyne: { id: "alkyne", functionalGroupId: "alkyne", libraryCategory: "alkyne", representativeMoleculeIds: ["acetylene"] },
  aromatic: { id: "aromatic", functionalGroupId: "aromatic", libraryCategory: "aromatic", representativeMoleculeIds: ["benzene"] },
  alcohol: { id: "alcohol", functionalGroupId: "hydroxyl", libraryCategory: "alcohol", representativeMoleculeIds: ["ethanol", "methanol"] },
  ether: { id: "ether", libraryCategory: "ether", representativeMoleculeIds: ["dimethylEther"] },
  aldehyde: { id: "aldehyde", functionalGroupId: "carbonyl", libraryCategory: "aldehyde", representativeMoleculeIds: ["acetaldehyde"] },
  ketone: { id: "ketone", functionalGroupId: "carbonyl", libraryCategory: "ketone", representativeMoleculeIds: ["acetone"] },
  carboxylicAcid: { id: "carboxylicAcid", functionalGroupId: "carboxyl", libraryCategory: "carboxylicAcid", representativeMoleculeIds: ["aceticAcid"] },
  ester: { id: "ester", functionalGroupId: "ester", libraryCategory: "ester", representativeMoleculeIds: ["methylAcetate"] },
  amine: { id: "amine", functionalGroupId: "amino", libraryCategory: "amine", representativeMoleculeIds: ["methylamine"] },
  amide: { id: "amide", functionalGroupId: "amide", libraryCategory: "amide", representativeMoleculeIds: ["acetamide"] },
};

export function getOrganicCategory(id: OrganicCategoryId): OrganicCategoryEntry {
  return ORGANIC_CATEGORIES[id];
}
