import type { FunctionalGroupId } from "./functional-groups";
import { MOLECULES } from "./molecules";

// Library-specific metadata, kept separate from the 3D structural data in
// `molecules.ts` (which Bond Explorer also depends on) so neither feature's
// data shape constrains the other. Molecular weights are real IUPAC values
// (g/mol), not invented — geometry/polarity are standard simplified
// classroom classifications.

export type MoleculeCategory =
  | "inorganic"
  | "organic"
  | "alcohol"
  | "ether"
  | "aldehyde"
  | "ketone"
  | "carboxylicAcid"
  | "ester"
  | "amine"
  | "amide"
  | "alkane"
  | "alkene"
  | "alkyne"
  | "aromatic";

export const MOLECULE_CATEGORY_IDS: MoleculeCategory[] = [
  "inorganic",
  "organic",
  "alcohol",
  "ether",
  "aldehyde",
  "ketone",
  "carboxylicAcid",
  "ester",
  "amine",
  "amide",
  "alkane",
  "alkene",
  "alkyne",
  "aromatic",
];

export type GeometryKey =
  | "linear"
  | "bent"
  | "trigonalPlanar"
  | "trigonalPyramidal"
  | "tetrahedral"
  | "planar"
  | "ionicPair";

export type Polarity = "nonpolar" | "polar" | "ionic";

export type MoleculeLibraryEntry = {
  id: string;
  category: MoleculeCategory;
  isOrganic: boolean;
  /** g/mol, real value. */
  molecularWeight: number;
  functionalGroups: FunctionalGroupId[];
  geometry: GeometryKey;
  polarity: Polarity;
  relatedMoleculeIds: string[];
};

export const LIBRARY_MOLECULE_IDS: string[] = [
  "h2o",
  "co2",
  "o2",
  "n2",
  "h2",
  "nacl",
  "hcl",
  "nh3",
  "ch4",
  "methanol",
  "ethanol",
  "aceticAcid",
  "acetone",
  "benzene",
  "acetaldehyde",
  "methylAcetate",
  "ethylene",
  "acetylene",
  "methylamine",
  "acetamide",
  "dimethylEther",
];

export const MOLECULE_LIBRARY: Record<string, MoleculeLibraryEntry> = {
  h2o: {
    id: "h2o",
    category: "inorganic",
    isOrganic: false,
    molecularWeight: 18.02,
    functionalGroups: [],
    geometry: "bent",
    polarity: "polar",
    relatedMoleculeIds: ["h2", "o2", "ethanol"],
  },
  co2: {
    id: "co2",
    category: "inorganic",
    isOrganic: false,
    molecularWeight: 44.01,
    functionalGroups: [],
    geometry: "linear",
    polarity: "nonpolar",
    relatedMoleculeIds: ["o2", "ch4"],
  },
  o2: {
    id: "o2",
    category: "inorganic",
    isOrganic: false,
    molecularWeight: 32.0,
    functionalGroups: [],
    geometry: "linear",
    polarity: "nonpolar",
    relatedMoleculeIds: ["h2o", "co2", "h2"],
  },
  n2: {
    id: "n2",
    category: "inorganic",
    isOrganic: false,
    molecularWeight: 28.01,
    functionalGroups: [],
    geometry: "linear",
    polarity: "nonpolar",
    relatedMoleculeIds: ["nh3", "h2"],
  },
  h2: {
    id: "h2",
    category: "inorganic",
    isOrganic: false,
    molecularWeight: 2.02,
    functionalGroups: [],
    geometry: "linear",
    polarity: "nonpolar",
    relatedMoleculeIds: ["h2o", "n2", "o2"],
  },
  nacl: {
    id: "nacl",
    category: "inorganic",
    isOrganic: false,
    molecularWeight: 58.44,
    functionalGroups: [],
    geometry: "ionicPair",
    polarity: "ionic",
    relatedMoleculeIds: ["hcl"],
  },
  hcl: {
    id: "hcl",
    category: "inorganic",
    isOrganic: false,
    molecularWeight: 36.46,
    functionalGroups: [],
    geometry: "linear",
    polarity: "polar",
    relatedMoleculeIds: ["nacl", "aceticAcid"],
  },
  nh3: {
    id: "nh3",
    category: "inorganic",
    isOrganic: false,
    molecularWeight: 17.03,
    functionalGroups: [],
    geometry: "trigonalPyramidal",
    polarity: "polar",
    relatedMoleculeIds: ["n2", "h2", "methylamine"],
  },
  ch4: {
    id: "ch4",
    category: "alkane",
    isOrganic: true,
    molecularWeight: 16.04,
    functionalGroups: [],
    geometry: "tetrahedral",
    polarity: "nonpolar",
    relatedMoleculeIds: ["co2", "ethylene", "ethanol"],
  },
  methanol: {
    id: "methanol",
    category: "alcohol",
    isOrganic: true,
    molecularWeight: 32.04,
    functionalGroups: ["hydroxyl"],
    geometry: "tetrahedral",
    polarity: "polar",
    relatedMoleculeIds: ["ethanol", "aceticAcid", "methylAcetate"],
  },
  ethanol: {
    id: "ethanol",
    category: "alcohol",
    isOrganic: true,
    molecularWeight: 46.07,
    functionalGroups: ["hydroxyl"],
    geometry: "tetrahedral",
    polarity: "polar",
    relatedMoleculeIds: ["methanol", "aceticAcid", "acetaldehyde"],
  },
  aceticAcid: {
    id: "aceticAcid",
    category: "carboxylicAcid",
    isOrganic: true,
    molecularWeight: 60.05,
    functionalGroups: ["carboxyl", "carbonyl"],
    geometry: "trigonalPlanar",
    polarity: "polar",
    relatedMoleculeIds: ["ethanol", "acetaldehyde", "methylAcetate"],
  },
  acetone: {
    id: "acetone",
    category: "ketone",
    isOrganic: true,
    molecularWeight: 58.08,
    functionalGroups: ["carbonyl"],
    geometry: "trigonalPlanar",
    polarity: "polar",
    relatedMoleculeIds: ["acetaldehyde", "methylAcetate"],
  },
  benzene: {
    id: "benzene",
    category: "aromatic",
    isOrganic: true,
    molecularWeight: 78.11,
    functionalGroups: ["aromatic"],
    geometry: "planar",
    polarity: "nonpolar",
    relatedMoleculeIds: ["ethylene", "acetylene"],
  },
  acetaldehyde: {
    id: "acetaldehyde",
    category: "aldehyde",
    isOrganic: true,
    molecularWeight: 44.05,
    functionalGroups: ["carbonyl"],
    geometry: "trigonalPlanar",
    polarity: "polar",
    relatedMoleculeIds: ["ethanol", "aceticAcid", "acetone"],
  },
  methylAcetate: {
    id: "methylAcetate",
    category: "ester",
    isOrganic: true,
    molecularWeight: 74.08,
    functionalGroups: ["ester", "carbonyl"],
    geometry: "trigonalPlanar",
    polarity: "polar",
    relatedMoleculeIds: ["methanol", "aceticAcid"],
  },
  ethylene: {
    id: "ethylene",
    category: "alkene",
    isOrganic: true,
    molecularWeight: 28.05,
    functionalGroups: ["alkene"],
    geometry: "trigonalPlanar",
    polarity: "nonpolar",
    relatedMoleculeIds: ["acetylene", "benzene", "ch4"],
  },
  acetylene: {
    id: "acetylene",
    category: "alkyne",
    isOrganic: true,
    molecularWeight: 26.04,
    functionalGroups: ["alkyne"],
    geometry: "linear",
    polarity: "nonpolar",
    relatedMoleculeIds: ["ethylene", "benzene"],
  },
  methylamine: {
    id: "methylamine",
    category: "amine",
    isOrganic: true,
    molecularWeight: 31.06,
    functionalGroups: ["amino"],
    geometry: "trigonalPyramidal",
    polarity: "polar",
    relatedMoleculeIds: ["nh3", "acetamide"],
  },
  acetamide: {
    id: "acetamide",
    category: "amide",
    isOrganic: true,
    molecularWeight: 59.07,
    functionalGroups: ["amide", "carbonyl"],
    geometry: "trigonalPlanar",
    polarity: "polar",
    relatedMoleculeIds: ["methylamine", "aceticAcid"],
  },
  dimethylEther: {
    id: "dimethylEther",
    category: "ether",
    isOrganic: true,
    molecularWeight: 46.07,
    functionalGroups: [],
    geometry: "bent",
    polarity: "polar",
    relatedMoleculeIds: ["ethanol", "methanol"],
  },
};

export function getLibraryEntry(id: string): MoleculeLibraryEntry {
  const entry = MOLECULE_LIBRARY[id];
  if (!entry) throw new Error(`No library metadata for molecule id: ${id}`);
  return entry;
}

export function getAtomCount(id: string): number {
  return MOLECULES[id].atoms.length;
}
