"use client";

import { useSearchParams } from "next/navigation";
import { MoleculeLibraryWorkspace } from "./molecule-library-workspace";
import { LIBRARY_MOLECULE_IDS } from "@/lib/chemistry/molecule-library-data";

/** Reads an optional `?molecule=` param (e.g. from Organic Chemistry's "view in library" link) to auto-open a detail overlay. */
export function MoleculeLibraryWithSearchParams() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("molecule");
  const initialSelectedId = requested && LIBRARY_MOLECULE_IDS.includes(requested) ? requested : undefined;

  return <MoleculeLibraryWorkspace initialSelectedId={initialSelectedId} />;
}
