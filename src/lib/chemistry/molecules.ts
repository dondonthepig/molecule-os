import type { BondTypeId } from "./bond-types";

// Real Pauling-scale electronegativity values — used to compute bond
// polarity/character, not invented numbers. Simplified 3D coordinates below
// are stylized for clarity, not to-scale measurements (labeled as such in the
// UI via `dict.bondExplorer.demoNotice` / `dict.moleculeLibrary.demoNotice`).
export const ELECTRONEGATIVITY: Record<string, number> = {
  H: 2.2,
  Na: 0.93,
  Cl: 3.16,
  O: 3.44,
  N: 3.04,
  C: 2.55,
  Fe: 1.83,
};

export type AtomSpec = {
  id: string;
  element: keyof typeof ELECTRONEGATIVITY;
  position: [number, number, number];
  radius: number;
  color: string;
  /** Formal ionic charge once the bond has formed, e.g. Na -> +1, Cl -> -1. */
  ionicCharge?: 1 | -1;
  /** Partial charge side, for polar covalent bonds. */
  partialCharge?: "+" | "-";
};

export type BondSpec = {
  from: string;
  to: string;
  kind: "covalent-single" | "covalent-double" | "covalent-triple" | "ionic" | "hydrogen";
};

export type MoleculeSpec = {
  id: string;
  bondTypeId: BondTypeId;
  /** Chemical formula — universal notation, not translated. */
  formula: string;
  atoms: AtomSpec[];
  bonds: BondSpec[];
  /** Metallic lattices render as a repeated ion grid + a free electron particle field instead of discrete bonds. */
  isLattice?: boolean;
};

// Standard CPK atom colors — scientifically meaningful, intentionally
// decoupled from the MoleculeOS UI brand palette (see "MOLECULE / UI COLOR
// RULE" in CLAUDE.md). Never recolor these to match a UI accent.
const ATOM_COLORS: Record<string, string> = {
  H: "#f2f2f2",
  Na: "#f5c542",
  Cl: "#4ec95e",
  O: "#ff3b30",
  N: "#3050f8",
  C: "#4a4a4a",
  Fe: "#a5a5aa",
};

export const MOLECULES: Record<string, MoleculeSpec> = {
  nacl: {
    id: "nacl",
    bondTypeId: "ionic",
    formula: "NaCl",
    atoms: [
      { id: "na", element: "Na", position: [-1.1, 0, 0], radius: 0.55, color: ATOM_COLORS.Na, ionicCharge: 1 },
      { id: "cl", element: "Cl", position: [1.1, 0, 0], radius: 0.62, color: ATOM_COLORS.Cl, ionicCharge: -1 },
    ],
    bonds: [{ from: "na", to: "cl", kind: "ionic" }],
  },
  h2: {
    id: "h2",
    bondTypeId: "covalent",
    formula: "H₂",
    atoms: [
      { id: "h1", element: "H", position: [-0.55, 0, 0], radius: 0.32, color: ATOM_COLORS.H },
      { id: "h2", element: "H", position: [0.55, 0, 0], radius: 0.32, color: ATOM_COLORS.H },
    ],
    bonds: [{ from: "h1", to: "h2", kind: "covalent-single" }],
  },
  cl2: {
    id: "cl2",
    bondTypeId: "covalent",
    formula: "Cl₂",
    atoms: [
      { id: "cl1", element: "Cl", position: [-0.85, 0, 0], radius: 0.58, color: ATOM_COLORS.Cl },
      { id: "cl2", element: "Cl", position: [0.85, 0, 0], radius: 0.58, color: ATOM_COLORS.Cl },
    ],
    bonds: [{ from: "cl1", to: "cl2", kind: "covalent-single" }],
  },
  ch4: {
    id: "ch4",
    bondTypeId: "covalent",
    formula: "CH₄",
    atoms: [
      { id: "c", element: "C", position: [0, 0, 0], radius: 0.5, color: ATOM_COLORS.C },
      { id: "h1", element: "H", position: [0.75, 0.75, 0.75], radius: 0.28, color: ATOM_COLORS.H },
      { id: "h2", element: "H", position: [-0.75, -0.75, 0.75], radius: 0.28, color: ATOM_COLORS.H },
      { id: "h3", element: "H", position: [-0.75, 0.75, -0.75], radius: 0.28, color: ATOM_COLORS.H },
      { id: "h4", element: "H", position: [0.75, -0.75, -0.75], radius: 0.28, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c", to: "h1", kind: "covalent-single" },
      { from: "c", to: "h2", kind: "covalent-single" },
      { from: "c", to: "h3", kind: "covalent-single" },
      { from: "c", to: "h4", kind: "covalent-single" },
    ],
  },
  co2: {
    id: "co2",
    bondTypeId: "covalent",
    formula: "CO₂",
    atoms: [
      { id: "c", element: "C", position: [0, 0, 0], radius: 0.46, color: ATOM_COLORS.C },
      { id: "o1", element: "O", position: [-1.1, 0, 0], radius: 0.5, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "o2", element: "O", position: [1.1, 0, 0], radius: 0.5, color: ATOM_COLORS.O, partialCharge: "-" },
    ],
    bonds: [
      { from: "c", to: "o1", kind: "covalent-double" },
      { from: "c", to: "o2", kind: "covalent-double" },
    ],
  },
  hcl: {
    id: "hcl",
    bondTypeId: "polarCovalent",
    formula: "HCl",
    atoms: [
      { id: "h", element: "H", position: [-0.75, 0, 0], radius: 0.32, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "cl", element: "Cl", position: [0.75, 0, 0], radius: 0.6, color: ATOM_COLORS.Cl, partialCharge: "-" },
    ],
    bonds: [{ from: "h", to: "cl", kind: "covalent-single" }],
  },
  h2o: {
    id: "h2o",
    bondTypeId: "polarCovalent",
    formula: "H₂O",
    atoms: [
      { id: "o", element: "O", position: [0, 0.25, 0], radius: 0.48, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "h1", element: "H", position: [-0.82, -0.45, 0], radius: 0.3, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "h2", element: "H", position: [0.82, -0.45, 0], radius: 0.3, color: ATOM_COLORS.H, partialCharge: "+" },
    ],
    bonds: [
      { from: "o", to: "h1", kind: "covalent-single" },
      { from: "o", to: "h2", kind: "covalent-single" },
    ],
  },
  nh3: {
    id: "nh3",
    bondTypeId: "polarCovalent",
    formula: "NH₃",
    atoms: [
      { id: "n", element: "N", position: [0, 0.35, 0], radius: 0.46, color: ATOM_COLORS.N, partialCharge: "-" },
      { id: "h1", element: "H", position: [-0.85, -0.35, 0.35], radius: 0.28, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "h2", element: "H", position: [0.85, -0.35, 0.35], radius: 0.28, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "h3", element: "H", position: [0, -0.35, -0.95], radius: 0.28, color: ATOM_COLORS.H, partialCharge: "+" },
    ],
    bonds: [
      { from: "n", to: "h1", kind: "covalent-single" },
      { from: "n", to: "h2", kind: "covalent-single" },
      { from: "n", to: "h3", kind: "covalent-single" },
    ],
  },
  fe: {
    id: "fe",
    bondTypeId: "metallic",
    formula: "Fe(s)",
    isLattice: true,
    atoms: (() => {
      const atoms: AtomSpec[] = [];
      const spacing = 0.85;
      let i = 0;
      for (let x = -1; x <= 1; x++) {
        for (let y = -1; y <= 1; y++) {
          atoms.push({
            id: `fe-${i++}`,
            element: "Fe",
            position: [x * spacing, y * spacing, 0],
            radius: 0.38,
            color: ATOM_COLORS.Fe,
            ionicCharge: 1,
          });
        }
      }
      return atoms;
    })(),
    bonds: [],
  },
  h2oDimer: {
    id: "h2oDimer",
    bondTypeId: "hydrogen",
    formula: "H₂O···H₂O",
    atoms: [
      { id: "o1", element: "O", position: [-1.1, 0.25, 0], radius: 0.46, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "h1a", element: "H", position: [-1.9, -0.35, 0], radius: 0.28, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "h1b", element: "H", position: [-0.4, -0.35, 0.3], radius: 0.28, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "o2", element: "O", position: [1.3, -0.3, 0], radius: 0.46, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "h2a", element: "H", position: [2.1, 0.3, 0], radius: 0.28, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "h2b", element: "H", position: [1.55, -1.05, 0.2], radius: 0.28, color: ATOM_COLORS.H, partialCharge: "+" },
    ],
    bonds: [
      { from: "o1", to: "h1a", kind: "covalent-single" },
      { from: "o1", to: "h1b", kind: "covalent-single" },
      { from: "o2", to: "h2a", kind: "covalent-single" },
      { from: "o2", to: "h2b", kind: "covalent-single" },
      { from: "h1b", to: "o2", kind: "hydrogen" },
    ],
  },

  // --- Molecule Library additions (Phase 2B) ---
  o2: {
    id: "o2",
    bondTypeId: "covalent",
    formula: "O₂",
    atoms: [
      { id: "o1", element: "O", position: [-0.75, 0, 0], radius: 0.48, color: ATOM_COLORS.O },
      { id: "o2", element: "O", position: [0.75, 0, 0], radius: 0.48, color: ATOM_COLORS.O },
    ],
    bonds: [{ from: "o1", to: "o2", kind: "covalent-double" }],
  },
  n2: {
    id: "n2",
    bondTypeId: "covalent",
    formula: "N₂",
    atoms: [
      { id: "n1", element: "N", position: [-0.8, 0, 0], radius: 0.46, color: ATOM_COLORS.N },
      { id: "n2", element: "N", position: [0.8, 0, 0], radius: 0.46, color: ATOM_COLORS.N },
    ],
    bonds: [{ from: "n1", to: "n2", kind: "covalent-triple" }],
  },
  methanol: {
    id: "methanol",
    bondTypeId: "polarCovalent",
    formula: "CH₃OH",
    atoms: [
      { id: "c", element: "C", position: [-0.7, 0, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "o", element: "O", position: [0.6, 0.3, 0], radius: 0.46, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "ho", element: "H", position: [1.2, 1.0, 0], radius: 0.26, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "h1", element: "H", position: [-1.5, 0.7, 0.4], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2", element: "H", position: [-1.4, -0.8, -0.4], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h3", element: "H", position: [-0.9, -0.7, 0.9], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c", to: "o", kind: "covalent-single" },
      { from: "o", to: "ho", kind: "covalent-single" },
      { from: "c", to: "h1", kind: "covalent-single" },
      { from: "c", to: "h2", kind: "covalent-single" },
      { from: "c", to: "h3", kind: "covalent-single" },
    ],
  },
  ethanol: {
    id: "ethanol",
    bondTypeId: "polarCovalent",
    formula: "C₂H₅OH",
    atoms: [
      { id: "c1", element: "C", position: [-1.6, -0.2, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "c2", element: "C", position: [-0.5, 0.35, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "o", element: "O", position: [0.7, -0.15, 0], radius: 0.46, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "ho", element: "H", position: [1.3, 0.45, 0], radius: 0.26, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "h1a", element: "H", position: [-2.3, 0.5, 0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1b", element: "H", position: [-2.2, -0.7, -0.6], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1c", element: "H", position: [-1.9, -0.9, 0.8], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2a", element: "H", position: [-0.6, 1.2, 0.7], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2b", element: "H", position: [-0.3, 1.1, -0.8], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c1", to: "c2", kind: "covalent-single" },
      { from: "c2", to: "o", kind: "covalent-single" },
      { from: "o", to: "ho", kind: "covalent-single" },
      { from: "c1", to: "h1a", kind: "covalent-single" },
      { from: "c1", to: "h1b", kind: "covalent-single" },
      { from: "c1", to: "h1c", kind: "covalent-single" },
      { from: "c2", to: "h2a", kind: "covalent-single" },
      { from: "c2", to: "h2b", kind: "covalent-single" },
    ],
  },
  aceticAcid: {
    id: "aceticAcid",
    bondTypeId: "polarCovalent",
    formula: "CH₃COOH",
    atoms: [
      { id: "c1", element: "C", position: [-1.5, -0.2, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "c2", element: "C", position: [-0.3, 0.3, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "o1", element: "O", position: [-0.3, 1.4, 0.3], radius: 0.46, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "o2", element: "O", position: [0.9, -0.2, 0], radius: 0.46, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "ho", element: "H", position: [1.5, 0.6, 0], radius: 0.26, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "h1a", element: "H", position: [-2.2, 0.5, 0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1b", element: "H", position: [-2.1, -0.8, -0.6], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1c", element: "H", position: [-1.6, -1.0, 0.8], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c1", to: "c2", kind: "covalent-single" },
      { from: "c2", to: "o1", kind: "covalent-double" },
      { from: "c2", to: "o2", kind: "covalent-single" },
      { from: "o2", to: "ho", kind: "covalent-single" },
      { from: "c1", to: "h1a", kind: "covalent-single" },
      { from: "c1", to: "h1b", kind: "covalent-single" },
      { from: "c1", to: "h1c", kind: "covalent-single" },
    ],
  },
  acetone: {
    id: "acetone",
    bondTypeId: "polarCovalent",
    formula: "CH₃COCH₃",
    atoms: [
      { id: "c2", element: "C", position: [0, 0, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "c1", element: "C", position: [-1.3, -0.3, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "c3", element: "C", position: [1.3, -0.3, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "o", element: "O", position: [0, 1.2, 0], radius: 0.46, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "h1a", element: "H", position: [-2.0, 0.4, 0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1b", element: "H", position: [-1.9, -1.1, -0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1c", element: "H", position: [-1.4, -1.0, 0.9], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h3a", element: "H", position: [2.0, 0.4, 0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h3b", element: "H", position: [1.9, -1.1, -0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h3c", element: "H", position: [1.4, -1.0, 0.9], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c2", to: "o", kind: "covalent-double" },
      { from: "c1", to: "c2", kind: "covalent-single" },
      { from: "c2", to: "c3", kind: "covalent-single" },
      { from: "c1", to: "h1a", kind: "covalent-single" },
      { from: "c1", to: "h1b", kind: "covalent-single" },
      { from: "c1", to: "h1c", kind: "covalent-single" },
      { from: "c3", to: "h3a", kind: "covalent-single" },
      { from: "c3", to: "h3b", kind: "covalent-single" },
      { from: "c3", to: "h3c", kind: "covalent-single" },
    ],
  },
  benzene: {
    id: "benzene",
    bondTypeId: "covalent",
    formula: "C₆H₆",
    atoms: [
      { id: "c0", element: "C", position: [1.3, 0, 0], radius: 0.42, color: ATOM_COLORS.C },
      { id: "c1", element: "C", position: [0.65, 1.126, 0], radius: 0.42, color: ATOM_COLORS.C },
      { id: "c2", element: "C", position: [-0.65, 1.126, 0], radius: 0.42, color: ATOM_COLORS.C },
      { id: "c3", element: "C", position: [-1.3, 0, 0], radius: 0.42, color: ATOM_COLORS.C },
      { id: "c4", element: "C", position: [-0.65, -1.126, 0], radius: 0.42, color: ATOM_COLORS.C },
      { id: "c5", element: "C", position: [0.65, -1.126, 0], radius: 0.42, color: ATOM_COLORS.C },
      { id: "h0", element: "H", position: [2.0, 0, 0], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1", element: "H", position: [1.0, 1.732, 0], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2", element: "H", position: [-1.0, 1.732, 0], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h3", element: "H", position: [-2.0, 0, 0], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h4", element: "H", position: [-1.0, -1.732, 0], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h5", element: "H", position: [1.0, -1.732, 0], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c0", to: "c1", kind: "covalent-double" },
      { from: "c1", to: "c2", kind: "covalent-single" },
      { from: "c2", to: "c3", kind: "covalent-double" },
      { from: "c3", to: "c4", kind: "covalent-single" },
      { from: "c4", to: "c5", kind: "covalent-double" },
      { from: "c5", to: "c0", kind: "covalent-single" },
      { from: "c0", to: "h0", kind: "covalent-single" },
      { from: "c1", to: "h1", kind: "covalent-single" },
      { from: "c2", to: "h2", kind: "covalent-single" },
      { from: "c3", to: "h3", kind: "covalent-single" },
      { from: "c4", to: "h4", kind: "covalent-single" },
      { from: "c5", to: "h5", kind: "covalent-single" },
    ],
  },
  acetaldehyde: {
    id: "acetaldehyde",
    bondTypeId: "polarCovalent",
    formula: "CH₃CHO",
    atoms: [
      { id: "c1", element: "C", position: [-1.3, -0.2, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "c2", element: "C", position: [0, 0.3, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "o", element: "O", position: [0.3, 1.5, 0.3], radius: 0.46, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "hc", element: "H", position: [0.9, -0.4, -0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1a", element: "H", position: [-2.1, 0.4, 0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1b", element: "H", position: [-2.0, -0.9, -0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1c", element: "H", position: [-1.5, -1.0, 0.8], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c1", to: "c2", kind: "covalent-single" },
      { from: "c2", to: "o", kind: "covalent-double" },
      { from: "c2", to: "hc", kind: "covalent-single" },
      { from: "c1", to: "h1a", kind: "covalent-single" },
      { from: "c1", to: "h1b", kind: "covalent-single" },
      { from: "c1", to: "h1c", kind: "covalent-single" },
    ],
  },
  methylAcetate: {
    id: "methylAcetate",
    bondTypeId: "polarCovalent",
    formula: "CH₃COOCH₃",
    atoms: [
      { id: "c1", element: "C", position: [-1.6, -0.3, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "c2", element: "C", position: [-0.4, 0.25, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "o1", element: "O", position: [-0.5, 1.4, 0.3], radius: 0.46, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "o2", element: "O", position: [0.8, -0.2, 0], radius: 0.46, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "c3", element: "C", position: [2.0, 0.3, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "h1a", element: "H", position: [-2.3, 0.4, 0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1b", element: "H", position: [-2.2, -0.8, -0.6], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1c", element: "H", position: [-1.7, -1.0, 0.8], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h3a", element: "H", position: [2.7, 0.9, 0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h3b", element: "H", position: [2.8, -0.4, -0.4], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h3c", element: "H", position: [2.3, 1.0, -0.7], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c1", to: "c2", kind: "covalent-single" },
      { from: "c2", to: "o1", kind: "covalent-double" },
      { from: "c2", to: "o2", kind: "covalent-single" },
      { from: "o2", to: "c3", kind: "covalent-single" },
      { from: "c1", to: "h1a", kind: "covalent-single" },
      { from: "c1", to: "h1b", kind: "covalent-single" },
      { from: "c1", to: "h1c", kind: "covalent-single" },
      { from: "c3", to: "h3a", kind: "covalent-single" },
      { from: "c3", to: "h3b", kind: "covalent-single" },
      { from: "c3", to: "h3c", kind: "covalent-single" },
    ],
  },
  ethylene: {
    id: "ethylene",
    bondTypeId: "covalent",
    formula: "C₂H₄",
    atoms: [
      { id: "c1", element: "C", position: [-0.7, 0, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "c2", element: "C", position: [0.7, 0, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "h1a", element: "H", position: [-1.3, 0.8, 0], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1b", element: "H", position: [-1.3, -0.8, 0], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2a", element: "H", position: [1.3, 0.8, 0], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2b", element: "H", position: [1.3, -0.8, 0], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c1", to: "c2", kind: "covalent-double" },
      { from: "c1", to: "h1a", kind: "covalent-single" },
      { from: "c1", to: "h1b", kind: "covalent-single" },
      { from: "c2", to: "h2a", kind: "covalent-single" },
      { from: "c2", to: "h2b", kind: "covalent-single" },
    ],
  },
  acetylene: {
    id: "acetylene",
    bondTypeId: "covalent",
    formula: "C₂H₂",
    atoms: [
      { id: "c1", element: "C", position: [-0.6, 0, 0], radius: 0.42, color: ATOM_COLORS.C },
      { id: "c2", element: "C", position: [0.6, 0, 0], radius: 0.42, color: ATOM_COLORS.C },
      { id: "h1", element: "H", position: [-1.65, 0, 0], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2", element: "H", position: [1.65, 0, 0], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c1", to: "c2", kind: "covalent-triple" },
      { from: "c1", to: "h1", kind: "covalent-single" },
      { from: "c2", to: "h2", kind: "covalent-single" },
    ],
  },
  methylamine: {
    id: "methylamine",
    bondTypeId: "polarCovalent",
    formula: "CH₃NH₂",
    atoms: [
      { id: "c", element: "C", position: [-0.8, 0, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "n", element: "N", position: [0.7, 0.2, 0], radius: 0.44, color: ATOM_COLORS.N, partialCharge: "-" },
      { id: "hn1", element: "H", position: [1.2, 1.0, 0.3], radius: 0.26, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "hn2", element: "H", position: [1.2, -0.4, -0.7], radius: 0.26, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "hc1", element: "H", position: [-1.6, 0.8, 0.4], radius: 0.26, color: ATOM_COLORS.H },
      { id: "hc2", element: "H", position: [-1.5, -0.9, -0.4], radius: 0.26, color: ATOM_COLORS.H },
      { id: "hc3", element: "H", position: [-1.0, -0.8, 0.9], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c", to: "n", kind: "covalent-single" },
      { from: "n", to: "hn1", kind: "covalent-single" },
      { from: "n", to: "hn2", kind: "covalent-single" },
      { from: "c", to: "hc1", kind: "covalent-single" },
      { from: "c", to: "hc2", kind: "covalent-single" },
      { from: "c", to: "hc3", kind: "covalent-single" },
    ],
  },
  dimethylEther: {
    id: "dimethylEther",
    bondTypeId: "polarCovalent",
    formula: "CH₃OCH₃",
    atoms: [
      { id: "c1", element: "C", position: [-1.3, -0.3, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "o", element: "O", position: [0, 0.2, 0], radius: 0.46, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "c2", element: "C", position: [1.3, -0.3, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "h1a", element: "H", position: [-2.1, 0.4, 0.4], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1b", element: "H", position: [-2.0, -1.1, -0.4], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1c", element: "H", position: [-1.4, -1.0, 0.9], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2a", element: "H", position: [2.1, 0.4, 0.4], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2b", element: "H", position: [2.0, -1.1, -0.4], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2c", element: "H", position: [1.4, -1.0, 0.9], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c1", to: "o", kind: "covalent-single" },
      { from: "o", to: "c2", kind: "covalent-single" },
      { from: "c1", to: "h1a", kind: "covalent-single" },
      { from: "c1", to: "h1b", kind: "covalent-single" },
      { from: "c1", to: "h1c", kind: "covalent-single" },
      { from: "c2", to: "h2a", kind: "covalent-single" },
      { from: "c2", to: "h2b", kind: "covalent-single" },
      { from: "c2", to: "h2c", kind: "covalent-single" },
    ],
  },
  acetamide: {
    id: "acetamide",
    bondTypeId: "polarCovalent",
    formula: "CH₃CONH₂",
    atoms: [
      { id: "c1", element: "C", position: [-1.5, -0.2, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "c2", element: "C", position: [-0.3, 0.3, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "o", element: "O", position: [-0.4, 1.5, 0.3], radius: 0.46, color: ATOM_COLORS.O, partialCharge: "-" },
      { id: "n", element: "N", position: [1.0, -0.1, 0], radius: 0.44, color: ATOM_COLORS.N, partialCharge: "-" },
      { id: "hn1", element: "H", position: [1.6, 0.6, 0.3], radius: 0.26, color: ATOM_COLORS.H },
      { id: "hn2", element: "H", position: [1.4, -1.0, -0.3], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1a", element: "H", position: [-2.3, 0.4, 0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1b", element: "H", position: [-2.2, -0.9, -0.5], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1c", element: "H", position: [-1.7, -1.0, 0.8], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c1", to: "c2", kind: "covalent-single" },
      { from: "c2", to: "o", kind: "covalent-double" },
      { from: "c2", to: "n", kind: "covalent-single" },
      { from: "n", to: "hn1", kind: "covalent-single" },
      { from: "n", to: "hn2", kind: "covalent-single" },
      { from: "c1", to: "h1a", kind: "covalent-single" },
      { from: "c1", to: "h1b", kind: "covalent-single" },
      { from: "c1", to: "h1c", kind: "covalent-single" },
    ],
  },

  // --- Reaction Atlas additions ---
  ethane: {
    id: "ethane",
    bondTypeId: "covalent",
    formula: "C₂H₆",
    atoms: [
      { id: "c1", element: "C", position: [-0.77, 0, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "c2", element: "C", position: [0.77, 0, 0], radius: 0.44, color: ATOM_COLORS.C },
      { id: "h1a", element: "H", position: [-1.5, 0.85, 0.3], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1b", element: "H", position: [-1.45, -0.5, -0.85], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h1c", element: "H", position: [-1.1, -0.6, 0.8], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2a", element: "H", position: [1.5, -0.85, -0.3], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2b", element: "H", position: [1.45, 0.5, 0.85], radius: 0.26, color: ATOM_COLORS.H },
      { id: "h2c", element: "H", position: [1.1, 0.6, -0.8], radius: 0.26, color: ATOM_COLORS.H },
    ],
    bonds: [
      { from: "c1", to: "c2", kind: "covalent-single" },
      { from: "c1", to: "h1a", kind: "covalent-single" },
      { from: "c1", to: "h1b", kind: "covalent-single" },
      { from: "c1", to: "h1c", kind: "covalent-single" },
      { from: "c2", to: "h2a", kind: "covalent-single" },
      { from: "c2", to: "h2b", kind: "covalent-single" },
      { from: "c2", to: "h2c", kind: "covalent-single" },
    ],
  },
  chloromethane: {
    id: "chloromethane",
    bondTypeId: "polarCovalent",
    formula: "CH₃Cl",
    atoms: [
      { id: "c", element: "C", position: [0, 0, 0], radius: 0.46, color: ATOM_COLORS.C },
      { id: "cl", element: "Cl", position: [0.75, 0.75, 0.75], radius: 0.62, color: ATOM_COLORS.Cl, partialCharge: "-" },
      { id: "h1", element: "H", position: [-0.75, -0.75, 0.75], radius: 0.28, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "h2", element: "H", position: [-0.75, 0.75, -0.75], radius: 0.28, color: ATOM_COLORS.H, partialCharge: "+" },
      { id: "h3", element: "H", position: [0.75, -0.75, -0.75], radius: 0.28, color: ATOM_COLORS.H, partialCharge: "+" },
    ],
    bonds: [
      { from: "c", to: "cl", kind: "covalent-single" },
      { from: "c", to: "h1", kind: "covalent-single" },
      { from: "c", to: "h2", kind: "covalent-single" },
      { from: "c", to: "h3", kind: "covalent-single" },
    ],
  },
};

export function getMolecule(id: string): MoleculeSpec {
  const molecule = MOLECULES[id];
  if (!molecule) throw new Error(`Unknown molecule id: ${id}`);
  return molecule;
}

export function electronegativityDelta(molecule: MoleculeSpec): number {
  const values = molecule.atoms.map((a) => ELECTRONEGATIVITY[a.element]);
  return Math.max(...values) - Math.min(...values);
}

/** Every molecule id whose structure contains the given element — used by the Periodic Table's "view molecules" cross-link. */
export function getMoleculesContainingElement(symbol: string): string[] {
  return Object.values(MOLECULES)
    .filter((m) => m.atoms.some((a) => a.element === symbol))
    .map((m) => m.id);
}
