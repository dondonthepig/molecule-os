"use client";

import { useSearchParams } from "next/navigation";
import { PeriodicTableWorkspace } from "./periodic-table-workspace";
import { ELEMENTS_BY_SYMBOL } from "@/lib/chemistry/periodic-table";

/** Reads an optional `?element=` param to open a specific element's detail on load. */
export function PeriodicTableWithSearchParams() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("element");
  const initialSelectedSymbol = requested && ELEMENTS_BY_SYMBOL[requested] ? requested : undefined;

  return <PeriodicTableWorkspace initialSelectedSymbol={initialSelectedSymbol} />;
}
