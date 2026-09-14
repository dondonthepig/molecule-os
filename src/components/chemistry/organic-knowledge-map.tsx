"use client";

import * as React from "react";
import { motion } from "framer-motion";
import { dict } from "@/lib/i18n";
import { cn } from "@/lib/utils";
import { ORGANIC_CATEGORY_IDS, ORGANIC_CATEGORIES, type OrganicCategoryId } from "@/lib/chemistry/organic-chemistry";
import { ORGANIC_REACTIONS } from "@/lib/chemistry/organic-reactions";
import { usePrefersReducedMotion } from "@/hooks/use-reduced-motion";

const VIEW_W = 920;
const VIEW_H = 520;

const NODE_POSITIONS: Record<OrganicCategoryId, { x: number; y: number }> = {
  alkyne: { x: 90, y: 60 },
  alkene: { x: 290, y: 60 },
  alkane: { x: 490, y: 60 },
  aromatic: { x: 760, y: 60 },
  alcohol: { x: 290, y: 200 },
  ether: { x: 490, y: 200 },
  amine: { x: 690, y: 340 },
  aldehyde: { x: 200, y: 340 },
  ketone: { x: 400, y: 340 },
  carboxylicAcid: { x: 200, y: 460 },
  ester: { x: 400, y: 460 },
  amide: { x: 600, y: 460 },
};

const NODE_R = 52;

type DisplayEdge = {
  key: string;
  from: OrganicCategoryId;
  to: OrganicCategoryId;
  labels: string[];
};

function buildDisplayEdges(): DisplayEdge[] {
  const grouped = new Map<string, DisplayEdge>();
  for (const edge of ORGANIC_REACTIONS) {
    const pairKey = [edge.from, edge.to].sort().join("--");
    const label = dict.organicChemistry.reactionTypes[edge.reactionTypeId];
    const existing = grouped.get(pairKey);
    if (existing) {
      existing.labels.push(label);
    } else {
      grouped.set(pairKey, { key: pairKey, from: edge.from, to: edge.to, labels: [label] });
    }
  }
  return Array.from(grouped.values());
}

export function OrganicKnowledgeMap({
  activeId,
  onSelect,
  className,
}: {
  activeId: OrganicCategoryId;
  onSelect: (id: OrganicCategoryId) => void;
  className?: string;
}) {
  const reduceMotion = usePrefersReducedMotion();
  const edges = React.useMemo(() => buildDisplayEdges(), []);

  return (
    <div className={cn("glass-subtle overflow-x-auto rounded-3xl border-border/60 p-4", className)}>
      <svg
        viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
        width={VIEW_W}
        height={VIEW_H}
        className="block"
        role="img"
        aria-label={dict.organicChemistry.sections.map}
      >
        <defs>
          <marker id="organic-map-arrow" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0,0 L8,4 L0,8 Z" fill="color-mix(in oklab, var(--foreground) 45%, transparent)" />
          </marker>
        </defs>

        {edges.map((edge) => {
          const from = NODE_POSITIONS[edge.from];
          const to = NODE_POSITIONS[edge.to];
          const dx = to.x - from.x;
          const dy = to.y - from.y;
          const dist = Math.hypot(dx, dy);
          const ux = dx / dist;
          const uy = dy / dist;
          const startX = from.x + ux * NODE_R;
          const startY = from.y + uy * NODE_R;
          const endX = to.x - ux * (NODE_R + 8);
          const endY = to.y - uy * (NODE_R + 8);
          const midX = (startX + endX) / 2;
          const midY = (startY + endY) / 2;

          return (
            <g key={edge.key}>
              <motion.line
                x1={startX}
                y1={startY}
                x2={endX}
                y2={endY}
                stroke="color-mix(in oklab, var(--foreground) 30%, transparent)"
                strokeWidth={1.5}
                markerEnd="url(#organic-map-arrow)"
                initial={reduceMotion ? false : { pathLength: 0, opacity: 0 }}
                whileInView={{ pathLength: 1, opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              />
              <rect
                x={midX - 28}
                y={midY - 10}
                width={56}
                height={20}
                rx={10}
                fill="var(--background)"
                stroke="color-mix(in oklab, var(--foreground) 15%, transparent)"
              />
              <text
                x={midX}
                y={midY + 4}
                textAnchor="middle"
                className="fill-muted-foreground text-[9px] font-medium"
              >
                {edge.labels.join(" / ")}
              </text>
            </g>
          );
        })}

        {ORGANIC_CATEGORY_IDS.map((id) => {
          const pos = NODE_POSITIONS[id];
          const active = id === activeId;
          const label = dict.moleculeLibrary.categories[ORGANIC_CATEGORIES[id].libraryCategory];
          return (
            <g
              key={id}
              transform={`translate(${pos.x}, ${pos.y})`}
              onClick={() => onSelect(id)}
              role="button"
              tabIndex={0}
              aria-label={label}
              aria-pressed={active}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") onSelect(id);
              }}
              className="cursor-pointer outline-none"
            >
              <motion.circle
                r={NODE_R}
                fill={active ? "url(#organic-node-active)" : "var(--card)"}
                stroke={active ? "var(--color-brand-blue)" : "color-mix(in oklab, var(--foreground) 20%, transparent)"}
                strokeWidth={active ? 2 : 1}
                whileHover={{ scale: 1.05 }}
                whileFocus={{ scale: 1.05 }}
              />
              <text
                textAnchor="middle"
                y={4}
                className={cn(
                  "pointer-events-none text-[10.5px] font-medium",
                  active ? "fill-white" : "fill-foreground",
                )}
              >
                {label}
              </text>
            </g>
          );
        })}

        <defs>
          <radialGradient id="organic-node-active">
            <stop offset="0%" stopColor="var(--color-brand-blue)" />
            <stop offset="100%" stopColor="var(--color-brand-purple-dim)" />
          </radialGradient>
        </defs>
      </svg>
    </div>
  );
}
