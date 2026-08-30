// Full 118-element periodic table — structural/technical data only, no
// display text (element Chinese names live in `dict.periodicTable.elements`;
// English names are kept here since they're internationally standardized
// scientific nomenclature, the same "universal notation" treatment already
// given to chemical formulas elsewhere in this codebase).
//
// Standard atomic weights follow IUPAC/CRC reference values. For elements
// with no stable isotope, `massIsMassNumber` is set and `atomicMass` holds
// the mass number of the most stable known isotope (the standard "[x]"
// bracket convention), not a fabricated precise weight. Electron
// configurations use noble-gas shorthand and include the well-known Aufbau
// exceptions (Cr, Cu, Nb, Mo, Ru, Rh, Pd, Ag, Pt, Au, La, Ce, Gd, ...).
// Configurations and oxidation states for elements 104+ are theoretical
// predictions based on periodic trends (these elements are barely
// characterized experimentally) — this is standard textbook practice, not
// invented data. Common oxidation states are the most cited ones, not
// exhaustive. Electronegativity (Pauling scale) is omitted where no
// reliable value is established (noble gases, francium, most elements
// past curium).

export type ElementCategory =
  | "alkaliMetal"
  | "alkalineEarthMetal"
  | "transitionMetal"
  | "postTransitionMetal"
  | "metalloid"
  | "nonmetal"
  | "halogen"
  | "nobleGas"
  | "lanthanide"
  | "actinide";

export const ELEMENT_CATEGORY_IDS: ElementCategory[] = [
  "alkaliMetal",
  "alkalineEarthMetal",
  "transitionMetal",
  "postTransitionMetal",
  "metalloid",
  "nonmetal",
  "halogen",
  "nobleGas",
  "lanthanide",
  "actinide",
];

export type ElementState = "solid" | "liquid" | "gas";

export type ElementSpec = {
  number: number;
  symbol: string;
  name: string;
  atomicMass: number;
  massIsMassNumber?: boolean;
  category: ElementCategory;
  period: number;
  /** Null for lanthanides/actinides — conventionally shown in their own row below the main table. */
  group: number | null;
  electronConfiguration: string;
  state: ElementState;
  electronegativity?: number;
  oxidationStates: number[];
};

// Scientific, category-based element colors — the periodic-table equivalent
// of `ATOM_COLORS` in molecules.ts. A separate scientific color system from
// the MoleculeOS UI brand palette; never recolor these to match a UI accent.
export const CATEGORY_COLORS: Record<ElementCategory, string> = {
  alkaliMetal: "#e05252",
  alkalineEarthMetal: "#e8965a",
  transitionMetal: "#e8c95a",
  postTransitionMetal: "#8fb85c",
  metalloid: "#5cb89f",
  nonmetal: "#5c9ee8",
  halogen: "#8f7ce8",
  nobleGas: "#c95ce0",
  lanthanide: "#5ce0c0",
  actinide: "#e05ca0",
};

export const ELEMENTS: ElementSpec[] = [
  { number: 1, symbol: "H", name: "Hydrogen", atomicMass: 1.008, category: "nonmetal", period: 1, group: 1, electronConfiguration: "1s¹", state: "gas", electronegativity: 2.2, oxidationStates: [1, -1] },
  { number: 2, symbol: "He", name: "Helium", atomicMass: 4.003, category: "nobleGas", period: 1, group: 18, electronConfiguration: "1s²", state: "gas", oxidationStates: [] },
  { number: 3, symbol: "Li", name: "Lithium", atomicMass: 6.94, category: "alkaliMetal", period: 2, group: 1, electronConfiguration: "[He] 2s¹", state: "solid", electronegativity: 0.98, oxidationStates: [1] },
  { number: 4, symbol: "Be", name: "Beryllium", atomicMass: 9.012, category: "alkalineEarthMetal", period: 2, group: 2, electronConfiguration: "[He] 2s²", state: "solid", electronegativity: 1.57, oxidationStates: [2] },
  { number: 5, symbol: "B", name: "Boron", atomicMass: 10.81, category: "metalloid", period: 2, group: 13, electronConfiguration: "[He] 2s² 2p¹", state: "solid", electronegativity: 2.04, oxidationStates: [3] },
  { number: 6, symbol: "C", name: "Carbon", atomicMass: 12.011, category: "nonmetal", period: 2, group: 14, electronConfiguration: "[He] 2s² 2p²", state: "solid", electronegativity: 2.55, oxidationStates: [4, -4, 2] },
  { number: 7, symbol: "N", name: "Nitrogen", atomicMass: 14.007, category: "nonmetal", period: 2, group: 15, electronConfiguration: "[He] 2s² 2p³", state: "gas", electronegativity: 3.04, oxidationStates: [-3, 3, 5] },
  { number: 8, symbol: "O", name: "Oxygen", atomicMass: 15.999, category: "nonmetal", period: 2, group: 16, electronConfiguration: "[He] 2s² 2p⁴", state: "gas", electronegativity: 3.44, oxidationStates: [-2] },
  { number: 9, symbol: "F", name: "Fluorine", atomicMass: 18.998, category: "halogen", period: 2, group: 17, electronConfiguration: "[He] 2s² 2p⁵", state: "gas", electronegativity: 3.98, oxidationStates: [-1] },
  { number: 10, symbol: "Ne", name: "Neon", atomicMass: 20.180, category: "nobleGas", period: 2, group: 18, electronConfiguration: "[He] 2s² 2p⁶", state: "gas", oxidationStates: [] },
  { number: 11, symbol: "Na", name: "Sodium", atomicMass: 22.990, category: "alkaliMetal", period: 3, group: 1, electronConfiguration: "[Ne] 3s¹", state: "solid", electronegativity: 0.93, oxidationStates: [1] },
  { number: 12, symbol: "Mg", name: "Magnesium", atomicMass: 24.305, category: "alkalineEarthMetal", period: 3, group: 2, electronConfiguration: "[Ne] 3s²", state: "solid", electronegativity: 1.31, oxidationStates: [2] },
  { number: 13, symbol: "Al", name: "Aluminium", atomicMass: 26.982, category: "postTransitionMetal", period: 3, group: 13, electronConfiguration: "[Ne] 3s² 3p¹", state: "solid", electronegativity: 1.61, oxidationStates: [3] },
  { number: 14, symbol: "Si", name: "Silicon", atomicMass: 28.085, category: "metalloid", period: 3, group: 14, electronConfiguration: "[Ne] 3s² 3p²", state: "solid", electronegativity: 1.9, oxidationStates: [4, -4] },
  { number: 15, symbol: "P", name: "Phosphorus", atomicMass: 30.974, category: "nonmetal", period: 3, group: 15, electronConfiguration: "[Ne] 3s² 3p³", state: "solid", electronegativity: 2.19, oxidationStates: [-3, 3, 5] },
  { number: 16, symbol: "S", name: "Sulfur", atomicMass: 32.06, category: "nonmetal", period: 3, group: 16, electronConfiguration: "[Ne] 3s² 3p⁴", state: "solid", electronegativity: 2.58, oxidationStates: [-2, 4, 6] },
  { number: 17, symbol: "Cl", name: "Chlorine", atomicMass: 35.45, category: "halogen", period: 3, group: 17, electronConfiguration: "[Ne] 3s² 3p⁵", state: "gas", electronegativity: 3.16, oxidationStates: [-1, 1, 3, 5, 7] },
  { number: 18, symbol: "Ar", name: "Argon", atomicMass: 39.948, category: "nobleGas", period: 3, group: 18, electronConfiguration: "[Ne] 3s² 3p⁶", state: "gas", oxidationStates: [] },
  { number: 19, symbol: "K", name: "Potassium", atomicMass: 39.098, category: "alkaliMetal", period: 4, group: 1, electronConfiguration: "[Ar] 4s¹", state: "solid", electronegativity: 0.82, oxidationStates: [1] },
  { number: 20, symbol: "Ca", name: "Calcium", atomicMass: 40.078, category: "alkalineEarthMetal", period: 4, group: 2, electronConfiguration: "[Ar] 4s²", state: "solid", electronegativity: 1.0, oxidationStates: [2] },
  { number: 21, symbol: "Sc", name: "Scandium", atomicMass: 44.956, category: "transitionMetal", period: 4, group: 3, electronConfiguration: "[Ar] 3d¹ 4s²", state: "solid", electronegativity: 1.36, oxidationStates: [3] },
  { number: 22, symbol: "Ti", name: "Titanium", atomicMass: 47.867, category: "transitionMetal", period: 4, group: 4, electronConfiguration: "[Ar] 3d² 4s²", state: "solid", electronegativity: 1.54, oxidationStates: [4, 3] },
  { number: 23, symbol: "V", name: "Vanadium", atomicMass: 50.942, category: "transitionMetal", period: 4, group: 5, electronConfiguration: "[Ar] 3d³ 4s²", state: "solid", electronegativity: 1.63, oxidationStates: [5, 4, 3, 2] },
  { number: 24, symbol: "Cr", name: "Chromium", atomicMass: 51.996, category: "transitionMetal", period: 4, group: 6, electronConfiguration: "[Ar] 3d⁵ 4s¹", state: "solid", electronegativity: 1.66, oxidationStates: [3, 6, 2] },
  { number: 25, symbol: "Mn", name: "Manganese", atomicMass: 54.938, category: "transitionMetal", period: 4, group: 7, electronConfiguration: "[Ar] 3d⁵ 4s²", state: "solid", electronegativity: 1.55, oxidationStates: [2, 4, 7] },
  { number: 26, symbol: "Fe", name: "Iron", atomicMass: 55.845, category: "transitionMetal", period: 4, group: 8, electronConfiguration: "[Ar] 3d⁶ 4s²", state: "solid", electronegativity: 1.83, oxidationStates: [2, 3] },
  { number: 27, symbol: "Co", name: "Cobalt", atomicMass: 58.933, category: "transitionMetal", period: 4, group: 9, electronConfiguration: "[Ar] 3d⁷ 4s²", state: "solid", electronegativity: 1.88, oxidationStates: [2, 3] },
  { number: 28, symbol: "Ni", name: "Nickel", atomicMass: 58.693, category: "transitionMetal", period: 4, group: 10, electronConfiguration: "[Ar] 3d⁸ 4s²", state: "solid", electronegativity: 1.91, oxidationStates: [2] },
  { number: 29, symbol: "Cu", name: "Copper", atomicMass: 63.546, category: "transitionMetal", period: 4, group: 11, electronConfiguration: "[Ar] 3d¹⁰ 4s¹", state: "solid", electronegativity: 1.9, oxidationStates: [2, 1] },
  { number: 30, symbol: "Zn", name: "Zinc", atomicMass: 65.38, category: "transitionMetal", period: 4, group: 12, electronConfiguration: "[Ar] 3d¹⁰ 4s²", state: "solid", electronegativity: 1.65, oxidationStates: [2] },
  { number: 31, symbol: "Ga", name: "Gallium", atomicMass: 69.723, category: "postTransitionMetal", period: 4, group: 13, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p¹", state: "solid", electronegativity: 1.81, oxidationStates: [3] },
  { number: 32, symbol: "Ge", name: "Germanium", atomicMass: 72.630, category: "metalloid", period: 4, group: 14, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p²", state: "solid", electronegativity: 2.01, oxidationStates: [4, 2] },
  { number: 33, symbol: "As", name: "Arsenic", atomicMass: 74.922, category: "metalloid", period: 4, group: 15, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p³", state: "solid", electronegativity: 2.18, oxidationStates: [3, 5, -3] },
  { number: 34, symbol: "Se", name: "Selenium", atomicMass: 78.971, category: "nonmetal", period: 4, group: 16, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p⁴", state: "solid", electronegativity: 2.55, oxidationStates: [-2, 4, 6] },
  { number: 35, symbol: "Br", name: "Bromine", atomicMass: 79.904, category: "halogen", period: 4, group: 17, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p⁵", state: "liquid", electronegativity: 2.96, oxidationStates: [-1, 1, 3, 5] },
  { number: 36, symbol: "Kr", name: "Krypton", atomicMass: 83.798, category: "nobleGas", period: 4, group: 18, electronConfiguration: "[Ar] 3d¹⁰ 4s² 4p⁶", state: "gas", electronegativity: 3.0, oxidationStates: [] },
  { number: 37, symbol: "Rb", name: "Rubidium", atomicMass: 85.468, category: "alkaliMetal", period: 5, group: 1, electronConfiguration: "[Kr] 5s¹", state: "solid", electronegativity: 0.82, oxidationStates: [1] },
  { number: 38, symbol: "Sr", name: "Strontium", atomicMass: 87.62, category: "alkalineEarthMetal", period: 5, group: 2, electronConfiguration: "[Kr] 5s²", state: "solid", electronegativity: 0.95, oxidationStates: [2] },
  { number: 39, symbol: "Y", name: "Yttrium", atomicMass: 88.906, category: "transitionMetal", period: 5, group: 3, electronConfiguration: "[Kr] 4d¹ 5s²", state: "solid", electronegativity: 1.22, oxidationStates: [3] },
  { number: 40, symbol: "Zr", name: "Zirconium", atomicMass: 91.224, category: "transitionMetal", period: 5, group: 4, electronConfiguration: "[Kr] 4d² 5s²", state: "solid", electronegativity: 1.33, oxidationStates: [4] },
  { number: 41, symbol: "Nb", name: "Niobium", atomicMass: 92.906, category: "transitionMetal", period: 5, group: 5, electronConfiguration: "[Kr] 4d⁴ 5s¹", state: "solid", electronegativity: 1.6, oxidationStates: [5] },
  { number: 42, symbol: "Mo", name: "Molybdenum", atomicMass: 95.95, category: "transitionMetal", period: 5, group: 6, electronConfiguration: "[Kr] 4d⁵ 5s¹", state: "solid", electronegativity: 2.16, oxidationStates: [6, 4] },
  { number: 43, symbol: "Tc", name: "Technetium", atomicMass: 98, massIsMassNumber: true, category: "transitionMetal", period: 5, group: 7, electronConfiguration: "[Kr] 4d⁵ 5s²", state: "solid", electronegativity: 1.9, oxidationStates: [7, 4] },
  { number: 44, symbol: "Ru", name: "Ruthenium", atomicMass: 101.07, category: "transitionMetal", period: 5, group: 8, electronConfiguration: "[Kr] 4d⁷ 5s¹", state: "solid", electronegativity: 2.2, oxidationStates: [3, 4] },
  { number: 45, symbol: "Rh", name: "Rhodium", atomicMass: 102.906, category: "transitionMetal", period: 5, group: 9, electronConfiguration: "[Kr] 4d⁸ 5s¹", state: "solid", electronegativity: 2.28, oxidationStates: [3] },
  { number: 46, symbol: "Pd", name: "Palladium", atomicMass: 106.42, category: "transitionMetal", period: 5, group: 10, electronConfiguration: "[Kr] 4d¹⁰", state: "solid", electronegativity: 2.2, oxidationStates: [2, 4] },
  { number: 47, symbol: "Ag", name: "Silver", atomicMass: 107.868, category: "transitionMetal", period: 5, group: 11, electronConfiguration: "[Kr] 4d¹⁰ 5s¹", state: "solid", electronegativity: 1.93, oxidationStates: [1] },
  { number: 48, symbol: "Cd", name: "Cadmium", atomicMass: 112.414, category: "transitionMetal", period: 5, group: 12, electronConfiguration: "[Kr] 4d¹⁰ 5s²", state: "solid", electronegativity: 1.69, oxidationStates: [2] },
  { number: 49, symbol: "In", name: "Indium", atomicMass: 114.818, category: "postTransitionMetal", period: 5, group: 13, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p¹", state: "solid", electronegativity: 1.78, oxidationStates: [3] },
  { number: 50, symbol: "Sn", name: "Tin", atomicMass: 118.710, category: "postTransitionMetal", period: 5, group: 14, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p²", state: "solid", electronegativity: 1.96, oxidationStates: [4, 2] },
  { number: 51, symbol: "Sb", name: "Antimony", atomicMass: 121.760, category: "metalloid", period: 5, group: 15, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p³", state: "solid", electronegativity: 2.05, oxidationStates: [3, 5, -3] },
  { number: 52, symbol: "Te", name: "Tellurium", atomicMass: 127.60, category: "metalloid", period: 5, group: 16, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p⁴", state: "solid", electronegativity: 2.1, oxidationStates: [-2, 4, 6] },
  { number: 53, symbol: "I", name: "Iodine", atomicMass: 126.904, category: "halogen", period: 5, group: 17, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p⁵", state: "solid", electronegativity: 2.66, oxidationStates: [-1, 1, 3, 5, 7] },
  { number: 54, symbol: "Xe", name: "Xenon", atomicMass: 131.293, category: "nobleGas", period: 5, group: 18, electronConfiguration: "[Kr] 4d¹⁰ 5s² 5p⁶", state: "gas", electronegativity: 2.6, oxidationStates: [2, 4, 6] },
  { number: 55, symbol: "Cs", name: "Caesium", atomicMass: 132.905, category: "alkaliMetal", period: 6, group: 1, electronConfiguration: "[Xe] 6s¹", state: "solid", electronegativity: 0.79, oxidationStates: [1] },
  { number: 56, symbol: "Ba", name: "Barium", atomicMass: 137.327, category: "alkalineEarthMetal", period: 6, group: 2, electronConfiguration: "[Xe] 6s²", state: "solid", electronegativity: 0.89, oxidationStates: [2] },
  { number: 57, symbol: "La", name: "Lanthanum", atomicMass: 138.905, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 5d¹ 6s²", state: "solid", electronegativity: 1.1, oxidationStates: [3] },
  { number: 58, symbol: "Ce", name: "Cerium", atomicMass: 140.116, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f¹ 5d¹ 6s²", state: "solid", electronegativity: 1.12, oxidationStates: [3, 4] },
  { number: 59, symbol: "Pr", name: "Praseodymium", atomicMass: 140.908, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f³ 6s²", state: "solid", electronegativity: 1.13, oxidationStates: [3] },
  { number: 60, symbol: "Nd", name: "Neodymium", atomicMass: 144.242, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f⁴ 6s²", state: "solid", electronegativity: 1.14, oxidationStates: [3] },
  { number: 61, symbol: "Pm", name: "Promethium", atomicMass: 145, massIsMassNumber: true, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f⁵ 6s²", state: "solid", oxidationStates: [3] },
  { number: 62, symbol: "Sm", name: "Samarium", atomicMass: 150.36, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f⁶ 6s²", state: "solid", electronegativity: 1.17, oxidationStates: [3, 2] },
  { number: 63, symbol: "Eu", name: "Europium", atomicMass: 151.964, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f⁷ 6s²", state: "solid", oxidationStates: [3, 2] },
  { number: 64, symbol: "Gd", name: "Gadolinium", atomicMass: 157.25, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f⁷ 5d¹ 6s²", state: "solid", electronegativity: 1.2, oxidationStates: [3] },
  { number: 65, symbol: "Tb", name: "Terbium", atomicMass: 158.925, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f⁹ 6s²", state: "solid", oxidationStates: [3] },
  { number: 66, symbol: "Dy", name: "Dysprosium", atomicMass: 162.500, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f¹⁰ 6s²", state: "solid", electronegativity: 1.22, oxidationStates: [3] },
  { number: 67, symbol: "Ho", name: "Holmium", atomicMass: 164.930, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f¹¹ 6s²", state: "solid", electronegativity: 1.23, oxidationStates: [3] },
  { number: 68, symbol: "Er", name: "Erbium", atomicMass: 167.259, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f¹² 6s²", state: "solid", electronegativity: 1.24, oxidationStates: [3] },
  { number: 69, symbol: "Tm", name: "Thulium", atomicMass: 168.934, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f¹³ 6s²", state: "solid", electronegativity: 1.25, oxidationStates: [3, 2] },
  { number: 70, symbol: "Yb", name: "Ytterbium", atomicMass: 173.045, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f¹⁴ 6s²", state: "solid", oxidationStates: [3, 2] },
  { number: 71, symbol: "Lu", name: "Lutetium", atomicMass: 174.967, category: "lanthanide", period: 6, group: null, electronConfiguration: "[Xe] 4f¹⁴ 5d¹ 6s²", state: "solid", electronegativity: 1.27, oxidationStates: [3] },
  { number: 72, symbol: "Hf", name: "Hafnium", atomicMass: 178.49, category: "transitionMetal", period: 6, group: 4, electronConfiguration: "[Xe] 4f¹⁴ 5d² 6s²", state: "solid", electronegativity: 1.3, oxidationStates: [4] },
  { number: 73, symbol: "Ta", name: "Tantalum", atomicMass: 180.948, category: "transitionMetal", period: 6, group: 5, electronConfiguration: "[Xe] 4f¹⁴ 5d³ 6s²", state: "solid", electronegativity: 1.5, oxidationStates: [5] },
  { number: 74, symbol: "W", name: "Tungsten", atomicMass: 183.84, category: "transitionMetal", period: 6, group: 6, electronConfiguration: "[Xe] 4f¹⁴ 5d⁴ 6s²", state: "solid", electronegativity: 2.36, oxidationStates: [6] },
  { number: 75, symbol: "Re", name: "Rhenium", atomicMass: 186.207, category: "transitionMetal", period: 6, group: 7, electronConfiguration: "[Xe] 4f¹⁴ 5d⁵ 6s²", state: "solid", electronegativity: 1.9, oxidationStates: [7, 4] },
  { number: 76, symbol: "Os", name: "Osmium", atomicMass: 190.23, category: "transitionMetal", period: 6, group: 8, electronConfiguration: "[Xe] 4f¹⁴ 5d⁶ 6s²", state: "solid", electronegativity: 2.2, oxidationStates: [4, 8] },
  { number: 77, symbol: "Ir", name: "Iridium", atomicMass: 192.217, category: "transitionMetal", period: 6, group: 9, electronConfiguration: "[Xe] 4f¹⁴ 5d⁷ 6s²", state: "solid", electronegativity: 2.2, oxidationStates: [3, 4] },
  { number: 78, symbol: "Pt", name: "Platinum", atomicMass: 195.084, category: "transitionMetal", period: 6, group: 10, electronConfiguration: "[Xe] 4f¹⁴ 5d⁹ 6s¹", state: "solid", electronegativity: 2.28, oxidationStates: [2, 4] },
  { number: 79, symbol: "Au", name: "Gold", atomicMass: 196.967, category: "transitionMetal", period: 6, group: 11, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s¹", state: "solid", electronegativity: 2.54, oxidationStates: [3, 1] },
  { number: 80, symbol: "Hg", name: "Mercury", atomicMass: 200.592, category: "transitionMetal", period: 6, group: 12, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s²", state: "liquid", electronegativity: 2.0, oxidationStates: [2, 1] },
  { number: 81, symbol: "Tl", name: "Thallium", atomicMass: 204.38, category: "postTransitionMetal", period: 6, group: 13, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p¹", state: "solid", electronegativity: 1.62, oxidationStates: [1, 3] },
  { number: 82, symbol: "Pb", name: "Lead", atomicMass: 207.2, category: "postTransitionMetal", period: 6, group: 14, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p²", state: "solid", electronegativity: 2.33, oxidationStates: [2, 4] },
  { number: 83, symbol: "Bi", name: "Bismuth", atomicMass: 208.980, category: "postTransitionMetal", period: 6, group: 15, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p³", state: "solid", electronegativity: 2.02, oxidationStates: [3] },
  { number: 84, symbol: "Po", name: "Polonium", atomicMass: 209, massIsMassNumber: true, category: "postTransitionMetal", period: 6, group: 16, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁴", state: "solid", electronegativity: 2.0, oxidationStates: [2, 4] },
  { number: 85, symbol: "At", name: "Astatine", atomicMass: 210, massIsMassNumber: true, category: "halogen", period: 6, group: 17, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁵", state: "solid", electronegativity: 2.2, oxidationStates: [-1, 1] },
  { number: 86, symbol: "Rn", name: "Radon", atomicMass: 222, massIsMassNumber: true, category: "nobleGas", period: 6, group: 18, electronConfiguration: "[Xe] 4f¹⁴ 5d¹⁰ 6s² 6p⁶", state: "gas", oxidationStates: [] },
  { number: 87, symbol: "Fr", name: "Francium", atomicMass: 223, massIsMassNumber: true, category: "alkaliMetal", period: 7, group: 1, electronConfiguration: "[Rn] 7s¹", state: "solid", electronegativity: 0.7, oxidationStates: [1] },
  { number: 88, symbol: "Ra", name: "Radium", atomicMass: 226, massIsMassNumber: true, category: "alkalineEarthMetal", period: 7, group: 2, electronConfiguration: "[Rn] 7s²", state: "solid", electronegativity: 0.9, oxidationStates: [2] },
  { number: 89, symbol: "Ac", name: "Actinium", atomicMass: 227, massIsMassNumber: true, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 6d¹ 7s²", state: "solid", electronegativity: 1.1, oxidationStates: [3] },
  { number: 90, symbol: "Th", name: "Thorium", atomicMass: 232.038, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 6d² 7s²", state: "solid", electronegativity: 1.3, oxidationStates: [4] },
  { number: 91, symbol: "Pa", name: "Protactinium", atomicMass: 231.036, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f² 6d¹ 7s²", state: "solid", electronegativity: 1.5, oxidationStates: [5] },
  { number: 92, symbol: "U", name: "Uranium", atomicMass: 238.029, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f³ 6d¹ 7s²", state: "solid", electronegativity: 1.38, oxidationStates: [6, 4] },
  { number: 93, symbol: "Np", name: "Neptunium", atomicMass: 237, massIsMassNumber: true, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f⁴ 6d¹ 7s²", state: "solid", electronegativity: 1.36, oxidationStates: [5] },
  { number: 94, symbol: "Pu", name: "Plutonium", atomicMass: 244, massIsMassNumber: true, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f⁶ 7s²", state: "solid", electronegativity: 1.28, oxidationStates: [4] },
  { number: 95, symbol: "Am", name: "Americium", atomicMass: 243, massIsMassNumber: true, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f⁷ 7s²", state: "solid", electronegativity: 1.3, oxidationStates: [3] },
  { number: 96, symbol: "Cm", name: "Curium", atomicMass: 247, massIsMassNumber: true, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f⁷ 6d¹ 7s²", state: "solid", electronegativity: 1.3, oxidationStates: [3] },
  { number: 97, symbol: "Bk", name: "Berkelium", atomicMass: 247, massIsMassNumber: true, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f⁹ 7s²", state: "solid", oxidationStates: [3] },
  { number: 98, symbol: "Cf", name: "Californium", atomicMass: 251, massIsMassNumber: true, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f¹⁰ 7s²", state: "solid", oxidationStates: [3] },
  { number: 99, symbol: "Es", name: "Einsteinium", atomicMass: 252, massIsMassNumber: true, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f¹¹ 7s²", state: "solid", oxidationStates: [3] },
  { number: 100, symbol: "Fm", name: "Fermium", atomicMass: 257, massIsMassNumber: true, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f¹² 7s²", state: "solid", oxidationStates: [3] },
  { number: 101, symbol: "Md", name: "Mendelevium", atomicMass: 258, massIsMassNumber: true, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f¹³ 7s²", state: "solid", oxidationStates: [3, 2] },
  { number: 102, symbol: "No", name: "Nobelium", atomicMass: 259, massIsMassNumber: true, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f¹⁴ 7s²", state: "solid", oxidationStates: [2, 3] },
  { number: 103, symbol: "Lr", name: "Lawrencium", atomicMass: 266, massIsMassNumber: true, category: "actinide", period: 7, group: null, electronConfiguration: "[Rn] 5f¹⁴ 7s² 7p¹", state: "solid", oxidationStates: [3] },
  { number: 104, symbol: "Rf", name: "Rutherfordium", atomicMass: 267, massIsMassNumber: true, category: "transitionMetal", period: 7, group: 4, electronConfiguration: "[Rn] 5f¹⁴ 6d² 7s²", state: "solid", oxidationStates: [4] },
  { number: 105, symbol: "Db", name: "Dubnium", atomicMass: 268, massIsMassNumber: true, category: "transitionMetal", period: 7, group: 5, electronConfiguration: "[Rn] 5f¹⁴ 6d³ 7s²", state: "solid", oxidationStates: [5] },
  { number: 106, symbol: "Sg", name: "Seaborgium", atomicMass: 269, massIsMassNumber: true, category: "transitionMetal", period: 7, group: 6, electronConfiguration: "[Rn] 5f¹⁴ 6d⁴ 7s²", state: "solid", oxidationStates: [6] },
  { number: 107, symbol: "Bh", name: "Bohrium", atomicMass: 270, massIsMassNumber: true, category: "transitionMetal", period: 7, group: 7, electronConfiguration: "[Rn] 5f¹⁴ 6d⁵ 7s²", state: "solid", oxidationStates: [7] },
  { number: 108, symbol: "Hs", name: "Hassium", atomicMass: 269, massIsMassNumber: true, category: "transitionMetal", period: 7, group: 8, electronConfiguration: "[Rn] 5f¹⁴ 6d⁶ 7s²", state: "solid", oxidationStates: [8] },
  { number: 109, symbol: "Mt", name: "Meitnerium", atomicMass: 278, massIsMassNumber: true, category: "transitionMetal", period: 7, group: 9, electronConfiguration: "[Rn] 5f¹⁴ 6d⁷ 7s²", state: "solid", oxidationStates: [] },
  { number: 110, symbol: "Ds", name: "Darmstadtium", atomicMass: 281, massIsMassNumber: true, category: "transitionMetal", period: 7, group: 10, electronConfiguration: "[Rn] 5f¹⁴ 6d⁸ 7s²", state: "solid", oxidationStates: [] },
  { number: 111, symbol: "Rg", name: "Roentgenium", atomicMass: 282, massIsMassNumber: true, category: "transitionMetal", period: 7, group: 11, electronConfiguration: "[Rn] 5f¹⁴ 6d⁹ 7s²", state: "solid", oxidationStates: [] },
  { number: 112, symbol: "Cn", name: "Copernicium", atomicMass: 285, massIsMassNumber: true, category: "transitionMetal", period: 7, group: 12, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s²", state: "solid", oxidationStates: [2] },
  { number: 113, symbol: "Nh", name: "Nihonium", atomicMass: 286, massIsMassNumber: true, category: "postTransitionMetal", period: 7, group: 13, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p¹", state: "solid", oxidationStates: [] },
  { number: 114, symbol: "Fl", name: "Flerovium", atomicMass: 289, massIsMassNumber: true, category: "postTransitionMetal", period: 7, group: 14, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p²", state: "solid", oxidationStates: [] },
  { number: 115, symbol: "Mc", name: "Moscovium", atomicMass: 290, massIsMassNumber: true, category: "postTransitionMetal", period: 7, group: 15, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p³", state: "solid", oxidationStates: [] },
  { number: 116, symbol: "Lv", name: "Livermorium", atomicMass: 293, massIsMassNumber: true, category: "postTransitionMetal", period: 7, group: 16, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁴", state: "solid", oxidationStates: [] },
  { number: 117, symbol: "Ts", name: "Tennessine", atomicMass: 294, massIsMassNumber: true, category: "halogen", period: 7, group: 17, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁵", state: "solid", oxidationStates: [-1] },
  { number: 118, symbol: "Og", name: "Oganesson", atomicMass: 294, massIsMassNumber: true, category: "nobleGas", period: 7, group: 18, electronConfiguration: "[Rn] 5f¹⁴ 6d¹⁰ 7s² 7p⁶", state: "gas", oxidationStates: [] },
];

export const ELEMENTS_BY_NUMBER: Record<number, ElementSpec> = Object.fromEntries(
  ELEMENTS.map((e) => [e.number, e]),
);
export const ELEMENTS_BY_SYMBOL: Record<string, ElementSpec> = Object.fromEntries(
  ELEMENTS.map((e) => [e.symbol, e]),
);

export function getElement(symbol: string): ElementSpec {
  const element = ELEMENTS_BY_SYMBOL[symbol];
  if (!element) throw new Error(`Unknown element symbol: ${symbol}`);
  return element;
}
