import type { Metadata } from "next";
import { OrganicChemistryWorkspace } from "@/components/chemistry/organic-chemistry-workspace";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.pages.organicChemistry.title };

export default function OrganicChemistryPage() {
  return <OrganicChemistryWorkspace />;
}
