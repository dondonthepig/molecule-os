"use client";

import { useSearchParams } from "next/navigation";
import { BondExplorerWorkspace } from "./bond-explorer-workspace";
import { BOND_TYPE_IDS, type BondTypeId } from "@/lib/chemistry/bond-types";

/** Reads an optional `?bondType=` param (e.g. from Molecule Library's "explore bonds" link) to preselect a category. */
export function BondExplorerWithSearchParams() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("bondType");
  const initialBondTypeId = (BOND_TYPE_IDS as string[]).includes(requested ?? "")
    ? (requested as BondTypeId)
    : undefined;

  return <BondExplorerWorkspace initialBondTypeId={initialBondTypeId} />;
}
