// Structural (non-text) configuration for each bond category. All display
// copy lives in the i18n dictionary under `dict.bondExplorer.bonds[id]` —
// this file only holds ids, cross-references, and visual/behavioral config.

export type BondTypeId = "ionic" | "covalent" | "polarCovalent" | "metallic" | "hydrogen";

export const BOND_TYPE_IDS: BondTypeId[] = [
  "ionic",
  "covalent",
  "polarCovalent",
  "metallic",
  "hydrogen",
];

export type BondAccent = "blue" | "cyan" | "purple";

/** How the polarity visualization should render for this bond category. */
export type PolarityBehavior = "transfer" | "none" | "gradient" | "delocalized" | "weak-gradient";

export type BondCategory = {
  id: BondTypeId;
  accent: BondAccent;
  /** Molecule ids (see molecules.ts) available as examples for this bond type. */
  moleculeIds: string[];
  /** Molecule id shown by default when this bond type is selected. */
  defaultMoleculeId: string;
  polarityBehavior: PolarityBehavior;
};

export const BOND_TYPES: Record<BondTypeId, BondCategory> = {
  ionic: {
    id: "ionic",
    accent: "blue",
    moleculeIds: ["nacl"],
    defaultMoleculeId: "nacl",
    polarityBehavior: "transfer",
  },
  covalent: {
    id: "covalent",
    accent: "cyan",
    moleculeIds: ["h2", "cl2", "ch4", "co2"],
    defaultMoleculeId: "h2",
    polarityBehavior: "none",
  },
  polarCovalent: {
    id: "polarCovalent",
    accent: "purple",
    moleculeIds: ["hcl", "h2o", "nh3"],
    defaultMoleculeId: "hcl",
    polarityBehavior: "gradient",
  },
  metallic: {
    id: "metallic",
    accent: "blue",
    moleculeIds: ["fe"],
    defaultMoleculeId: "fe",
    polarityBehavior: "delocalized",
  },
  hydrogen: {
    id: "hydrogen",
    accent: "cyan",
    moleculeIds: ["h2oDimer"],
    defaultMoleculeId: "h2oDimer",
    polarityBehavior: "weak-gradient",
  },
};

/** Simplified, standard textbook thresholds (Pauling scale ΔEN) for classifying bond character. */
export function classifyElectronegativityDifference(delta: number): "nonpolar" | "polar" | "ionic" {
  if (delta >= 1.7) return "ionic";
  if (delta >= 0.4) return "polar";
  return "nonpolar";
}
