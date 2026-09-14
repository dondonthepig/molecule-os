export type MoleculeAtom = {
  id: string;
  position: [number, number, number];
  radius: number;
  color: string;
};

export type MoleculeBond = [string, string];

const RING_RADIUS = 1.55;
const RING_COUNT = 6;

const ringAtoms: MoleculeAtom[] = Array.from({ length: RING_COUNT }, (_, i) => {
  const angle = (i / RING_COUNT) * Math.PI * 2;
  return {
    id: `ring-${i}`,
    position: [
      Math.cos(angle) * RING_RADIUS,
      Math.sin(angle) * RING_RADIUS,
      0,
    ],
    radius: 0.34,
    color: "#4361ee",
  };
});

const ringBonds: MoleculeBond[] = ringAtoms.map((atom, i) => [
  atom.id,
  ringAtoms[(i + 1) % RING_COUNT].id,
]);

// Alternating substituents branching off the ring, out of plane, giving the
// silhouette depth so rotation reads clearly as a 3D structure.
const substituents: MoleculeAtom[] = [0, 2, 4].map((ringIndex) => {
  const base = ringAtoms[ringIndex];
  const dir = base.position.map((v) => v * 1.55) as [number, number, number];
  const z = ringIndex % 4 === 0 ? 1.05 : -1.05;
  return {
    id: `sub-${ringIndex}`,
    position: [dir[0], dir[1], z],
    radius: 0.24,
    color: "#4cc9f0",
  };
});

const substituentBonds: MoleculeBond[] = substituents.map((sub, i) => [
  ringAtoms[[0, 2, 4][i]].id,
  sub.id,
]);

// A small branching tail off one substituent for asymmetry and visual interest.
const tail: MoleculeAtom[] = [
  {
    id: "tail-1",
    position: [substituents[0].position[0] * 1.5, substituents[0].position[1] * 1.5 + 0.4, 1.9],
    radius: 0.19,
    color: "#2b3566",
  },
  {
    id: "tail-2",
    position: [substituents[0].position[0] * 1.35, substituents[0].position[1] * 1.9 - 0.5, 2.7],
    radius: 0.15,
    color: "#9be0fa",
  },
];

const tailBonds: MoleculeBond[] = [
  ["sub-0", "tail-1"],
  ["tail-1", "tail-2"],
];

// A lone accent atom orbiting off the opposite side of the ring.
const accent: MoleculeAtom = {
  id: "accent-1",
  position: [-2.9, -1.6, -1.4],
  radius: 0.21,
  color: "#37458a",
};
const accentBond: MoleculeBond = ["ring-3", "accent-1"];

export const MOLECULE_ATOMS: MoleculeAtom[] = [
  ...ringAtoms,
  ...substituents,
  ...tail,
  accent,
];

export const MOLECULE_BONDS: MoleculeBond[] = [
  ...ringBonds,
  ...substituentBonds,
  ...tailBonds,
  accentBond,
];

export const MOLECULE_ATOM_MAP = new Map(
  MOLECULE_ATOMS.map((atom) => [atom.id, atom]),
);
