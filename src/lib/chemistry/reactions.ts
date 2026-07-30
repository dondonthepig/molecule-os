import type { ReactionTypeId } from "./organic-reactions";
import type { OrganicCategoryId } from "./organic-chemistry";
import type { FunctionalGroupId } from "./functional-groups";

// Reaction Atlas's own data layer — structural/technical data only, no
// display text (that lives in `dict.reactionAtlas.*`). Every reactant/product
// is a real molecule id from `molecules.ts` (extended with `ethane` and
// `chloromethane` for this feature); every equation here is a real,
// mass-balanced textbook reaction, not an invented one. Two oxidation steps
// use the standard textbook shorthand "[O]" for the net effect of an
// oxidizing agent (`symbolicOxidant: true`) rather than a fabricated
// molecule — the actual oxidant is named in `oxidantFormula`.

export type ReactionDifficulty = "beginner" | "intermediate" | "advanced";
export const REACTION_DIFFICULTIES: ReactionDifficulty[] = ["beginner", "intermediate", "advanced"];

export type ReactionTemperatureId = "roomTemp" | "heated" | "reflux" | "uvLight" | "ignition";

export type ReactionParticipant = {
  moleculeId: string;
  /** Stoichiometric coefficient — omit for 1. */
  coefficient?: number;
};

/** A single bond (by atom-id pair) to highlight in the transformation view, ice-blue overlay. */
export type BondHighlight = { moleculeId: string; from: string; to: string };

export type Reaction = {
  id: string;
  reactionTypeId: ReactionTypeId;
  difficulty: ReactionDifficulty;
  reactants: ReactionParticipant[];
  products: ReactionParticipant[];
  /** True for the two oxidation steps that use "[O]" shorthand instead of a full oxidant molecule. */
  symbolicOxidant?: boolean;
  /** Real catalyst, in chemical formula notation — universal notation, not translated. */
  catalystFormula?: string;
  /** Real oxidizing agent, for oxidation steps — chemical formula notation. */
  oxidantFormula?: string;
  temperatureId: ReactionTemperatureId;
  organicCategoryFrom?: OrganicCategoryId;
  organicCategoryTo?: OrganicCategoryId;
  functionalGroupFrom?: FunctionalGroupId;
  functionalGroupTo?: FunctionalGroupId;
  reactantHighlights: BondHighlight[];
  productHighlights: BondHighlight[];
  /** Id of the reverse reaction, for esterification <-> hydrolysis style pairs. */
  reversePairId?: string;
};

export const REACTIONS: Record<string, Reaction> = {
  combustionMethane: {
    id: "combustionMethane",
    reactionTypeId: "combustion",
    difficulty: "beginner",
    reactants: [{ moleculeId: "ch4" }, { moleculeId: "o2", coefficient: 2 }],
    products: [{ moleculeId: "co2" }, { moleculeId: "h2o", coefficient: 2 }],
    temperatureId: "ignition",
    organicCategoryFrom: "alkane",
    reactantHighlights: [
      { moleculeId: "ch4", from: "c", to: "h1" },
      { moleculeId: "o2", from: "o1", to: "o2" },
    ],
    productHighlights: [
      { moleculeId: "co2", from: "c", to: "o1" },
      { moleculeId: "h2o", from: "o", to: "h1" },
    ],
  },
  hydrogenationAcetyleneToEthylene: {
    id: "hydrogenationAcetyleneToEthylene",
    reactionTypeId: "hydrogenation",
    difficulty: "intermediate",
    reactants: [{ moleculeId: "acetylene" }, { moleculeId: "h2" }],
    products: [{ moleculeId: "ethylene" }],
    catalystFormula: "Pd/CaCO₃ (Lindlar)",
    temperatureId: "roomTemp",
    organicCategoryFrom: "alkyne",
    organicCategoryTo: "alkene",
    functionalGroupFrom: "alkyne",
    functionalGroupTo: "alkene",
    reactantHighlights: [
      { moleculeId: "acetylene", from: "c1", to: "c2" },
      { moleculeId: "h2", from: "h1", to: "h2" },
    ],
    productHighlights: [{ moleculeId: "ethylene", from: "c1", to: "c2" }],
  },
  hydrogenationEthyleneToEthane: {
    id: "hydrogenationEthyleneToEthane",
    reactionTypeId: "hydrogenation",
    difficulty: "beginner",
    reactants: [{ moleculeId: "ethylene" }, { moleculeId: "h2" }],
    products: [{ moleculeId: "ethane" }],
    catalystFormula: "Ni",
    temperatureId: "heated",
    organicCategoryFrom: "alkene",
    organicCategoryTo: "alkane",
    functionalGroupFrom: "alkene",
    reactantHighlights: [
      { moleculeId: "ethylene", from: "c1", to: "c2" },
      { moleculeId: "h2", from: "h1", to: "h2" },
    ],
    productHighlights: [{ moleculeId: "ethane", from: "c1", to: "c2" }],
  },
  additionEthyleneToEthanol: {
    id: "additionEthyleneToEthanol",
    reactionTypeId: "addition",
    difficulty: "intermediate",
    reactants: [{ moleculeId: "ethylene" }, { moleculeId: "h2o" }],
    products: [{ moleculeId: "ethanol" }],
    catalystFormula: "H₃PO₄",
    temperatureId: "heated",
    organicCategoryFrom: "alkene",
    organicCategoryTo: "alcohol",
    functionalGroupFrom: "alkene",
    functionalGroupTo: "hydroxyl",
    reactantHighlights: [{ moleculeId: "ethylene", from: "c1", to: "c2" }],
    productHighlights: [{ moleculeId: "ethanol", from: "c2", to: "o" }],
  },
  oxidationEthanolToAcetaldehyde: {
    id: "oxidationEthanolToAcetaldehyde",
    reactionTypeId: "oxidation",
    difficulty: "intermediate",
    reactants: [{ moleculeId: "ethanol" }],
    products: [{ moleculeId: "acetaldehyde" }, { moleculeId: "h2o" }],
    symbolicOxidant: true,
    oxidantFormula: "K₂Cr₂O₇ / H⁺",
    temperatureId: "heated",
    organicCategoryFrom: "alcohol",
    organicCategoryTo: "aldehyde",
    functionalGroupFrom: "hydroxyl",
    functionalGroupTo: "carbonyl",
    reactantHighlights: [{ moleculeId: "ethanol", from: "o", to: "ho" }],
    productHighlights: [{ moleculeId: "acetaldehyde", from: "c2", to: "o" }],
  },
  oxidationAcetaldehydeToAceticAcid: {
    id: "oxidationAcetaldehydeToAceticAcid",
    reactionTypeId: "oxidation",
    difficulty: "advanced",
    reactants: [{ moleculeId: "acetaldehyde" }],
    products: [{ moleculeId: "aceticAcid" }],
    symbolicOxidant: true,
    oxidantFormula: "KMnO₄ / H⁺",
    temperatureId: "heated",
    organicCategoryFrom: "aldehyde",
    organicCategoryTo: "carboxylicAcid",
    functionalGroupFrom: "carbonyl",
    functionalGroupTo: "carboxyl",
    reactantHighlights: [{ moleculeId: "acetaldehyde", from: "c2", to: "hc" }],
    productHighlights: [{ moleculeId: "aceticAcid", from: "o2", to: "ho" }],
  },
  condensationMethanolToEther: {
    id: "condensationMethanolToEther",
    reactionTypeId: "condensation",
    difficulty: "advanced",
    reactants: [{ moleculeId: "methanol", coefficient: 2 }],
    products: [{ moleculeId: "dimethylEther" }, { moleculeId: "h2o" }],
    catalystFormula: "H₂SO₄ (濃)",
    temperatureId: "heated",
    organicCategoryFrom: "alcohol",
    organicCategoryTo: "ether",
    functionalGroupFrom: "hydroxyl",
    reactantHighlights: [{ moleculeId: "methanol", from: "o", to: "ho" }],
    productHighlights: [{ moleculeId: "dimethylEther", from: "o", to: "c2" }],
  },
  esterificationAceticAcidMethanol: {
    id: "esterificationAceticAcidMethanol",
    reactionTypeId: "esterification",
    difficulty: "intermediate",
    reactants: [{ moleculeId: "aceticAcid" }, { moleculeId: "methanol" }],
    products: [{ moleculeId: "methylAcetate" }, { moleculeId: "h2o" }],
    catalystFormula: "H₂SO₄ (濃)",
    temperatureId: "reflux",
    organicCategoryFrom: "carboxylicAcid",
    organicCategoryTo: "ester",
    functionalGroupFrom: "carboxyl",
    functionalGroupTo: "ester",
    reversePairId: "hydrolysisMethylAcetate",
    reactantHighlights: [
      { moleculeId: "aceticAcid", from: "o2", to: "ho" },
      { moleculeId: "methanol", from: "o", to: "ho" },
    ],
    productHighlights: [{ moleculeId: "methylAcetate", from: "o2", to: "c3" }],
  },
  hydrolysisMethylAcetate: {
    id: "hydrolysisMethylAcetate",
    reactionTypeId: "hydrolysis",
    difficulty: "intermediate",
    reactants: [{ moleculeId: "methylAcetate" }, { moleculeId: "h2o" }],
    products: [{ moleculeId: "aceticAcid" }, { moleculeId: "methanol" }],
    catalystFormula: "H⁺ 或 OH⁻",
    temperatureId: "heated",
    organicCategoryFrom: "ester",
    organicCategoryTo: "carboxylicAcid",
    functionalGroupFrom: "ester",
    functionalGroupTo: "carboxyl",
    reversePairId: "esterificationAceticAcidMethanol",
    reactantHighlights: [{ moleculeId: "methylAcetate", from: "o2", to: "c3" }],
    productHighlights: [{ moleculeId: "aceticAcid", from: "o2", to: "ho" }],
  },
  amidationAceticAcidAmmonia: {
    id: "amidationAceticAcidAmmonia",
    reactionTypeId: "amidation",
    difficulty: "advanced",
    reactants: [{ moleculeId: "aceticAcid" }, { moleculeId: "nh3" }],
    products: [{ moleculeId: "acetamide" }, { moleculeId: "h2o" }],
    temperatureId: "heated",
    organicCategoryFrom: "carboxylicAcid",
    organicCategoryTo: "amide",
    functionalGroupFrom: "carboxyl",
    functionalGroupTo: "amide",
    reactantHighlights: [
      { moleculeId: "aceticAcid", from: "o2", to: "ho" },
      { moleculeId: "nh3", from: "n", to: "h1" },
    ],
    productHighlights: [{ moleculeId: "acetamide", from: "c2", to: "n" }],
  },
  substitutionMethaneChlorine: {
    id: "substitutionMethaneChlorine",
    reactionTypeId: "substitution",
    difficulty: "advanced",
    reactants: [{ moleculeId: "ch4" }, { moleculeId: "cl2" }],
    products: [{ moleculeId: "chloromethane" }, { moleculeId: "hcl" }],
    temperatureId: "uvLight",
    organicCategoryFrom: "alkane",
    reactantHighlights: [
      { moleculeId: "ch4", from: "c", to: "h1" },
      { moleculeId: "cl2", from: "cl1", to: "cl2" },
    ],
    productHighlights: [
      { moleculeId: "chloromethane", from: "c", to: "cl" },
      { moleculeId: "hcl", from: "h", to: "cl" },
    ],
  },
};

export const REACTION_IDS: string[] = Object.keys(REACTIONS);

export function getReaction(id: string): Reaction {
  const reaction = REACTIONS[id];
  if (!reaction) throw new Error(`Unknown reaction id: ${id}`);
  return reaction;
}

function participantIds(reaction: Reaction): string[] {
  return [...reaction.reactants, ...reaction.products].map((p) => p.moleculeId);
}

export function getReactionsForCategory(categoryId: OrganicCategoryId): Reaction[] {
  return REACTION_IDS.map(getReaction).filter(
    (r) => r.organicCategoryFrom === categoryId || r.organicCategoryTo === categoryId,
  );
}

export function getReactionsForMolecule(moleculeId: string): Reaction[] {
  return REACTION_IDS.map(getReaction).filter((r) => participantIds(r).includes(moleculeId));
}

/** Every unique molecule id referenced by any reaction — used to build the feature's own name-copy lookups. */
export function getAllReactionMoleculeIds(): string[] {
  return Array.from(new Set(REACTION_IDS.flatMap((id) => participantIds(getReaction(id)))));
}

/** Every reaction type actually used by the current reaction set — drives the type filter chips. */
export function getAllReactionTypeIds(): ReactionTypeId[] {
  return Array.from(new Set(REACTION_IDS.map((id) => getReaction(id).reactionTypeId)));
}

/** Every organic category referenced (as either side) by the current reaction set — drives the category filter chips. */
export function getAllReactionCategoryIds(): OrganicCategoryId[] {
  const ids = REACTION_IDS.flatMap((id) => {
    const r = getReaction(id);
    return [r.organicCategoryFrom, r.organicCategoryTo].filter((c): c is OrganicCategoryId => Boolean(c));
  });
  return Array.from(new Set(ids));
}
