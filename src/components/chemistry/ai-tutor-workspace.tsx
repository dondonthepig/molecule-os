"use client";

import * as React from "react";
import { dict } from "@/lib/i18n";
import { useSettings } from "@/hooks/use-settings";
import { getTutorProvider } from "@/lib/chemistry/tutor-engine";
import type { TutorLearningMode, TutorTopicId, TutorDifficulty } from "@/lib/chemistry/tutor-data";
import { AiTutorHero } from "./ai-tutor-hero";
import { AiTutorControls } from "./ai-tutor-controls";
import { AiTutorConversation, type TutorMessage } from "./ai-tutor-conversation";
import { AiTutorComposer } from "./ai-tutor-composer";

const tutorProvider = getTutorProvider();

let messageCounter = 0;
function nextMessageId(): string {
  messageCounter += 1;
  return `m${messageCounter}`;
}

export function AiTutorWorkspace({ initialTopic }: { initialTopic?: TutorTopicId } = {}) {
  const t = dict.aiTutor;
  const { settings } = useSettings();

  const [mode, setMode] = React.useState<TutorLearningMode>(settings.defaultLearningMode);
  const [topic, setTopic] = React.useState<TutorTopicId | "all">(initialTopic ?? "all");
  const [difficulty, setDifficulty] = React.useState<TutorDifficulty>(settings.preferredDifficulty);
  const [input, setInput] = React.useState("");
  const [messages, setMessages] = React.useState<TutorMessage[]>([]);
  const [isThinking, setIsThinking] = React.useState(false);

  const ask = async (question: string) => {
    const trimmed = question.trim();
    if (!trimmed || isThinking) return;

    setMessages((prev) => [...prev, { id: nextMessageId(), role: "user", text: trimmed }]);
    setInput("");
    setIsThinking(true);

    const answer = await tutorProvider.respond({
      question: trimmed,
      mode,
      topic,
      difficulty,
      showExplanations: settings.showExplanations,
      showHintsBeforeAnswers: settings.showHintsBeforeAnswers,
      showMolecularFormulas: settings.showMolecularFormulas,
      showMolecularNames: settings.showMolecularNames,
    });

    setMessages((prev) => [...prev, { id: nextMessageId(), role: "assistant", mode, answer }]);
    setIsThinking(false);
  };

  return (
    <div className="relative px-4 pt-24 pb-16 sm:px-6 sm:pt-28 lg:px-10">
      <div className="mx-auto flex max-w-3xl flex-col gap-6">
        <AiTutorHero />

        <AiTutorControls
          mode={mode}
          onModeChange={setMode}
          topic={topic}
          onTopicChange={setTopic}
          difficulty={difficulty}
          onDifficultyChange={setDifficulty}
        />

        {messages.length === 0 ? (
          <div className="glass-subtle rounded-2xl border-border/60 px-6 py-10 text-center">
            <p className="text-sm font-medium text-foreground">{t.emptyState.title}</p>
            <p className="mx-auto mt-1.5 max-w-md text-xs leading-relaxed text-muted-foreground">
              {t.emptyState.description}
            </p>
            <p className="mt-6 text-xs font-medium text-muted-foreground">{t.suggestedPromptsLabel}</p>
            <div className="mt-2.5 flex flex-wrap justify-center gap-2">
              {t.suggestedPrompts.map((prompt) => (
                <button
                  key={prompt.id}
                  type="button"
                  onClick={() => ask(prompt.text)}
                  className="rounded-full border border-border/60 px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted/25 hover:text-foreground"
                >
                  {prompt.text}
                </button>
              ))}
            </div>
          </div>
        ) : (
          <AiTutorConversation messages={messages} isThinking={isThinking} />
        )}

        <AiTutorComposer
          value={input}
          onChange={setInput}
          onSubmit={() => ask(input)}
          onClear={() => setMessages([])}
          canClear={messages.length > 0}
          disabled={isThinking}
        />
      </div>
    </div>
  );
}
