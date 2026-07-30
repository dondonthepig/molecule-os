import type { LucideIcon } from "lucide-react";
import {
  Atom,
  FlaskConical,
  Library,
  Workflow,
  Grid3x3,
  Sparkles,
  Brain,
  Settings,
  Home,
} from "lucide-react";
import { dict } from "@/lib/i18n";

export type NavItem = {
  key: keyof typeof dict.nav.items;
  href: string;
  icon: LucideIcon;
  label: string;
  description: string;
};

const NAV_CONFIG = [
  { key: "home", href: "/", icon: Home },
  { key: "bondExplorer", href: "/bond-explorer", icon: Atom },
  { key: "organicChemistry", href: "/organic-chemistry", icon: FlaskConical },
  { key: "moleculeLibrary", href: "/molecule-library", icon: Library },
  { key: "reactionAtlas", href: "/reaction-atlas", icon: Workflow },
  { key: "periodicTable", href: "/periodic-table", icon: Grid3x3 },
  { key: "aiTutor", href: "/ai-tutor", icon: Sparkles },
  { key: "quiz", href: "/quiz", icon: Brain },
  { key: "settings", href: "/settings", icon: Settings },
] as const satisfies ReadonlyArray<{
  key: keyof typeof dict.nav.items;
  href: string;
  icon: LucideIcon;
}>;

export const NAV_ITEMS: NavItem[] = NAV_CONFIG.map(({ key, href, icon }) => ({
  key,
  href,
  icon,
  label: dict.nav.items[key].label,
  description: dict.nav.items[key].description,
}));

export const PRIMARY_NAV_ITEMS = NAV_ITEMS.filter((item) => item.href !== "/");
