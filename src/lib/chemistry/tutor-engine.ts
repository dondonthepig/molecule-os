// AI Tutor response engine. `TutorProvider` is the seam a future real LLM
// integration would implement — every caller only depends on this interface,
// so swapping `getTutorProvider()`'s return value is the only change needed
// to go from the deterministic mock below to a real API-backed provider.
import { dict } from "@/lib/i18n";
import { getMolecule } from "./molecules";
import {
  TUTOR_KNOWLEDGE_BASE,
  type TutorKnowledgeId,
  type TutorLearningMode,
  type TutorDifficulty,
  type TutorTopicId,
  type TutorRelatedLink,
} from "./tutor-data";

export type TutorResourceLink = { label: string; href: string };

export type TutorAnswer = {
  kind: "match" | "fallback" | "glossary";
  knowledgeId?: TutorKnowledgeId;
  title: string;
  /** A short framing line shown above `body`, e.g. exam-prep/review-mode intros. */
  lead?: string;
  /** Paragraphs, steps, or Socratic questions rendered in order. */
  body: string[];
  /** Rendered inside a collapsible <details> section when present. */
  collapsedBody?: string[];
  collapsedLabel?: string;
  resources: TutorResourceLink[];
};

export type TutorRequest = {
  question: string;
  mode: TutorLearningMode;
  topic: TutorTopicId | "all";
  difficulty: TutorDifficulty;
  showExplanations: boolean;
  showHintsBeforeAnswers: boolean;
  showMolecularFormulas: boolean;
  showMolecularNames: boolean;
};

export interface TutorProvider {
  respond(request: TutorRequest): Promise<TutorAnswer>;
}

function normalize(text: string): string {
  return text.trim().toLowerCase();
}

/** Keeps only the first sentence for the "show full explanations: off" preference. */
function condense(text: string): string {
  const match = text.match(/^[^。]*。/);
  return match ? match[0] : text;
}

function scoreEntry(id: TutorKnowledgeId, normalizedQuery: string): number {
  if (!normalizedQuery) return 0;
  const copy = dict.aiTutor.knowledgeBase[id as keyof typeof dict.aiTutor.knowledgeBase];
  let score = 0;
  for (const keyword of copy.keywords) {
    if (normalizedQuery.includes(keyword.toLowerCase())) score += 1;
  }
  return score;
}

function findBestMatch(normalizedQuery: string, topic: TutorTopicId | "all"): TutorKnowledgeId | undefined {
  const candidates = TUTOR_KNOWLEDGE_BASE.filter((e) => topic === "all" || e.topic === topic);
  let best: { id: TutorKnowledgeId; score: number } | undefined;
  for (const candidate of candidates) {
    const score = scoreEntry(candidate.id, normalizedQuery);
    if (score > 0 && (!best || score > best.score)) best = { id: candidate.id, score };
  }
  return best?.id;
}

/**
 * Molecule Library links get the molecule's formula/name appended, honoring
 * the "show molecular formulas / names" chemistry display preferences —
 * everything else falls back to the plain nav item label.
 */
function buildResources(
  links: TutorRelatedLink[],
  showFormulas: boolean,
  showNames: boolean,
): TutorResourceLink[] {
  return links.map((link) => {
    const navLabel = dict.nav.items[link.navKey].label;
    if (link.navKey !== "moleculeLibrary" || (!showFormulas && !showNames)) {
      return { label: navLabel, href: link.href };
    }
    const moleculeId = new URLSearchParams(link.href.split("?")[1]).get("molecule");
    const copy = moleculeId
      ? dict.moleculeLibrary.molecules[moleculeId as keyof typeof dict.moleculeLibrary.molecules]
      : undefined;
    if (!moleculeId || !copy) return { label: navLabel, href: link.href };

    const parts: string[] = [];
    if (showNames) parts.push(copy.nameZh);
    if (showFormulas) parts.push(getMolecule(moleculeId).formula);
    return { label: parts.length ? `${navLabel}（${parts.join(" · ")}）` : navLabel, href: link.href };
  });
}

function composeTerminologyAnswer(question: string): TutorAnswer {
  const t = dict.aiTutor;
  const entries = Object.values(t.glossary);
  const q = normalize(question);
  const matches = q
    ? entries.filter((g) => normalize(g.term).includes(q) || normalize(g.definition).includes(q))
    : entries;
  const list = matches.length ? matches : entries;
  return {
    kind: matches.length ? "glossary" : "fallback",
    title: t.glossaryLabel,
    body: list.map((g) => `${g.term}：${g.definition}`),
    resources: [],
  };
}

function fallbackAnswer(topic: TutorTopicId | "all", showFormulas: boolean, showNames: boolean): TutorAnswer {
  const t = dict.aiTutor;
  const fallbackLinks =
    topic === "all" ? [] : (TUTOR_KNOWLEDGE_BASE.find((e) => e.topic === topic)?.relatedLinks ?? []);
  return {
    kind: "fallback",
    title: t.fallback.title,
    body: [t.fallback.intro, t.fallback.hint],
    resources: buildResources(fallbackLinks, showFormulas, showNames),
  };
}

/**
 * Deterministic, keyword-matched tutoring "engine" grounded entirely in
 * existing chemistry data (see tutor-data.ts). No network calls — this is
 * explicitly a prototype, surfaced to the user via `dict.aiTutor.prototypeNotice`.
 */
export class MockTutorProvider implements TutorProvider {
  async respond(request: TutorRequest): Promise<TutorAnswer> {
    // Simulated latency so the UI's "thinking" state and future streaming
    // swap-in don't require any behavioral changes later.
    await new Promise((resolve) => setTimeout(resolve, 450 + Math.random() * 350));

    const t = dict.aiTutor;

    if (request.mode === "terminology") {
      return composeTerminologyAnswer(request.question);
    }

    const matchId = findBestMatch(normalize(request.question), request.topic);
    if (!matchId) return fallbackAnswer(request.topic, request.showMolecularFormulas, request.showMolecularNames);

    const structEntry = TUTOR_KNOWLEDGE_BASE.find((e) => e.id === matchId)!;
    const copy = t.knowledgeBase[matchId];
    const resources = buildResources(structEntry.relatedLinks, request.showMolecularFormulas, request.showMolecularNames);
    const explain = request.showExplanations ? copy.explain : condense(copy.explain);
    const showSteps = structEntry.hasSteps && request.difficulty !== "advanced" && "steps" in copy;

    switch (request.mode) {
      case "solve": {
        if (showSteps) {
          const steps = (copy as { steps: string[] }).steps;
          return { kind: "match", knowledgeId: matchId, title: copy.title, body: steps, resources };
        }
        return {
          kind: "match",
          knowledgeId: matchId,
          title: copy.title,
          lead: t.solveNoStepsNote,
          body: [explain],
          resources,
        };
      }
      case "socratic":
        return {
          kind: "match",
          knowledgeId: matchId,
          title: copy.title,
          lead: t.socraticIntro,
          body: copy.socratic,
          collapsedBody: [explain],
          collapsedLabel: t.revealAnswer,
          resources,
        };
      case "examPrep":
        return {
          kind: "match",
          knowledgeId: matchId,
          title: copy.title,
          lead: t.examPrepIntro,
          body: [],
          collapsedBody: [explain],
          collapsedLabel: t.keyPointsLabel,
          resources,
        };
      case "reviewMistakes":
        return {
          kind: "match",
          knowledgeId: matchId,
          title: copy.title,
          lead: t.reviewPrompt,
          body: [],
          collapsedBody: [explain],
          collapsedLabel: t.correctConceptLabel,
          resources,
        };
      case "explain":
      default:
        if (request.showHintsBeforeAnswers) {
          return {
            kind: "match",
            knowledgeId: matchId,
            title: copy.title,
            body: [copy.hint],
            collapsedBody: [explain],
            collapsedLabel: t.revealAnswer,
            resources,
          };
        }
        return { kind: "match", knowledgeId: matchId, title: copy.title, body: [explain], resources };
    }
  }
}

/**
 * Single seam for swapping in a real LLM-backed provider later (e.g. behind
 * an env var / feature flag) without touching any UI component — every call
 * site depends only on the `TutorProvider` interface above.
 */
export function getTutorProvider(): TutorProvider {
  return new MockTutorProvider();
}
