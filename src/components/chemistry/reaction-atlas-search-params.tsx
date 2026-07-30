"use client";

import { useSearchParams } from "next/navigation";
import { ReactionAtlasWorkspace } from "./reaction-atlas-workspace";
import { REACTION_IDS } from "@/lib/chemistry/reactions";

/**
 * Reads optional `?reaction=` (open a specific reaction's detail, e.g. from
 * Molecule Library) and `?category=`/`?molecule=` (pre-filter the list, e.g.
 * from Organic Chemistry or Molecule Library) params.
 */
export function ReactionAtlasWithSearchParams() {
  const searchParams = useSearchParams();

  const requestedReaction = searchParams.get("reaction");
  const initialReactionId = REACTION_IDS.includes(requestedReaction ?? "") ? (requestedReaction ?? undefined) : undefined;

  const initialCategory = searchParams.get("category") ?? undefined;
  const initialMolecule = searchParams.get("molecule") ?? undefined;

  return (
    <ReactionAtlasWorkspace
      initialReactionId={initialReactionId}
      initialCategoryFilter={initialCategory}
      initialMoleculeQuery={initialMolecule}
    />
  );
}
