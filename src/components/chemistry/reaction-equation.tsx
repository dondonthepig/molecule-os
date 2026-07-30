import * as React from "react";
import { ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";
import { getMolecule } from "@/lib/chemistry/molecules";
import type { Reaction, ReactionParticipant } from "@/lib/chemistry/reactions";

function EquationSide({ participants }: { participants: ReactionParticipant[] }) {
  return (
    <>
      {participants.map((p, i) => (
        <React.Fragment key={p.moleculeId}>
          {i > 0 ? <span className="mx-1.5 text-muted-foreground">+</span> : null}
          {p.coefficient && p.coefficient > 1 ? <span className="mr-0.5">{p.coefficient}</span> : null}
          <span>{getMolecule(p.moleculeId).formula}</span>
        </React.Fragment>
      ))}
    </>
  );
}

/** Renders a real chemical equation — reactants --catalyst/conditions--> products — shared by the card and detail view. */
export function ReactionEquation({
  reaction,
  size = "md",
  className,
}: {
  reaction: Reaction;
  size?: "sm" | "md";
  className?: string;
}) {
  const conditionLabel = [reaction.catalystFormula, reaction.oxidantFormula].filter(Boolean).join(" / ");

  return (
    <div
      className={cn(
        "flex flex-wrap items-center gap-1 font-medium text-foreground",
        size === "sm" ? "text-xs" : "text-base",
        className,
      )}
    >
      <EquationSide participants={reaction.reactants} />
      {reaction.symbolicOxidant ? <span className="mx-1.5 text-muted-foreground">+ [O]</span> : null}
      <span className="relative mx-2 flex flex-col items-center justify-center">
        {conditionLabel ? (
          <span className="absolute -top-4 whitespace-nowrap text-[10px] font-normal text-brand-cyan">
            {conditionLabel}
          </span>
        ) : null}
        <ArrowRight className={cn("shrink-0 text-brand-cyan", size === "sm" ? "size-3.5" : "size-4")} />
      </span>
      <EquationSide participants={reaction.products} />
    </div>
  );
}
