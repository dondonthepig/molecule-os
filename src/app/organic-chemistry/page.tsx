import type { Metadata } from "next";
import { Suspense } from "react";
import { OrganicChemistryWorkspace } from "@/components/chemistry/organic-chemistry-workspace";
import { OrganicChemistryWithSearchParams } from "@/components/chemistry/organic-chemistry-search-params";
import { dict } from "@/lib/i18n";

export const metadata: Metadata = { title: dict.pages.organicChemistry.title };

export default function OrganicChemistryPage() {
  return (
    <Suspense fallback={<OrganicChemistryWorkspace />}>
      <OrganicChemistryWithSearchParams />
    </Suspense>
  );
}
