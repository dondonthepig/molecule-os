import type { OrganicCategoryId } from "./organic-chemistry";

// The organic reaction relationship graph — structural data only (display
// text for each reactionTypeId lives in `dict.organicChemistry.reactionTypes`).
// This is intentionally the seed of what Reaction Atlas will later expand on.

export type ReactionTypeId =
  | "hydrogenation"
  | "addition"
  | "oxidation"
  | "condensation"
  | "esterification"
  | "hydrolysis"
  | "amidation"
  | "combustion"
  | "substitution";

export type ReactionEdge = {
  id: string;
  from: OrganicCategoryId;
  to: OrganicCategoryId;
  reactionTypeId: ReactionTypeId;
};

export const ORGANIC_REACTIONS: ReactionEdge[] = [
  { id: "alkyne-to-alkene", from: "alkyne", to: "alkene", reactionTypeId: "hydrogenation" },
  { id: "alkene-to-alkane", from: "alkene", to: "alkane", reactionTypeId: "hydrogenation" },
  { id: "alkene-to-alcohol", from: "alkene", to: "alcohol", reactionTypeId: "addition" },
  { id: "alcohol-to-aldehyde", from: "alcohol", to: "aldehyde", reactionTypeId: "oxidation" },
  { id: "alcohol-to-ketone", from: "alcohol", to: "ketone", reactionTypeId: "oxidation" },
  { id: "aldehyde-to-carboxylicAcid", from: "aldehyde", to: "carboxylicAcid", reactionTypeId: "oxidation" },
  { id: "alcohol-to-ether", from: "alcohol", to: "ether", reactionTypeId: "condensation" },
  { id: "carboxylicAcid-to-ester", from: "carboxylicAcid", to: "ester", reactionTypeId: "esterification" },
  { id: "ester-to-carboxylicAcid", from: "ester", to: "carboxylicAcid", reactionTypeId: "hydrolysis" },
  { id: "carboxylicAcid-to-amide", from: "carboxylicAcid", to: "amide", reactionTypeId: "amidation" },
];

export function getReactionsFrom(categoryId: OrganicCategoryId): ReactionEdge[] {
  return ORGANIC_REACTIONS.filter((edge) => edge.from === categoryId || edge.to === categoryId);
}
