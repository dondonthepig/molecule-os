// All content in this file is illustrative placeholder ("Demo Data") used to
// showcase MoleculeOS UI/UX. Nothing here represents real users, institutions,
// or measured product metrics. Copy is sourced from the i18n dictionary
// (dict.testimonials.items / dict.stats.items / dict.categories.items); this
// file only carries the non-translatable fields (id, accent, count, value).
import { dict } from "@/lib/i18n";

export type Testimonial = {
  id: string;
  name: string;
  role: string;
  quote: string;
  initials: string;
  accent: "blue" | "cyan" | "purple";
};

const TESTIMONIAL_META: Pick<Testimonial, "id" | "accent">[] = [
  { id: "t1", accent: "blue" },
  { id: "t2", accent: "cyan" },
  { id: "t3", accent: "purple" },
  { id: "t4", accent: "blue" },
  { id: "t5", accent: "cyan" },
];

export const DEMO_TESTIMONIALS: Testimonial[] = TESTIMONIAL_META.map((meta, i) => ({
  ...meta,
  ...dict.testimonials.items[i]!,
}));

export type Stat = {
  id: string;
  label: string;
  value: number;
  suffix?: string;
  prefix?: string;
};

export const DEMO_STATS: Stat[] = [
  { id: "s1", label: dict.stats.items.molecules.label, value: 1240, suffix: "+" },
  { id: "s2", label: dict.stats.items.reactions.label, value: 380, suffix: "+" },
  { id: "s3", label: dict.stats.items.learners.label, value: 92, suffix: "K+" },
  { id: "s4", label: dict.stats.items.quizLift.label, value: 34, suffix: "%" },
];

export type ChemicalCategory = {
  id: string;
  name: string;
  description: string;
  count: number;
  accent: "blue" | "cyan" | "purple";
};

export const DEMO_CATEGORIES: ChemicalCategory[] = [
  {
    id: "c1",
    ...dict.categories.items.organic,
    count: 186,
    accent: "blue",
  },
  {
    id: "c2",
    ...dict.categories.items.inorganic,
    count: 94,
    accent: "purple",
  },
  {
    id: "c3",
    ...dict.categories.items.physical,
    count: 71,
    accent: "cyan",
  },
  {
    id: "c4",
    ...dict.categories.items.biochemistry,
    count: 58,
    accent: "blue",
  },
  {
    id: "c5",
    ...dict.categories.items.analytical,
    count: 42,
    accent: "purple",
  },
  {
    id: "c6",
    ...dict.categories.items.environmental,
    count: 33,
    accent: "cyan",
  },
];
