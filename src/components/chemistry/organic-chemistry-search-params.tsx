"use client";

import { useSearchParams } from "next/navigation";
import { OrganicChemistryWorkspace } from "./organic-chemistry-workspace";
import { ORGANIC_CATEGORY_IDS, type OrganicCategoryId } from "@/lib/chemistry/organic-chemistry";

/** Reads an optional `?category=` param (e.g. from Reaction Atlas's "view in Organic Chemistry" link) to preselect a category. */
export function OrganicChemistryWithSearchParams() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("category");
  const initialCategoryId = (ORGANIC_CATEGORY_IDS as string[]).includes(requested ?? "")
    ? (requested as OrganicCategoryId)
    : undefined;

  return <OrganicChemistryWorkspace initialCategoryId={initialCategoryId} />;
}
