import { dict } from "@/lib/i18n";
import { TUTOR_LEARNING_MODES, TUTOR_TOPIC_IDS, type TutorLearningMode, type TutorTopicId } from "@/lib/chemistry/tutor-data";
import type { TutorDifficulty } from "@/lib/chemistry/tutor-data";
import { PillGroup } from "@/components/ui/pill-group";

export function AiTutorControls({
  mode,
  onModeChange,
  topic,
  onTopicChange,
  difficulty,
  onDifficultyChange,
}: {
  mode: TutorLearningMode;
  onModeChange: (mode: TutorLearningMode) => void;
  topic: TutorTopicId | "all";
  onTopicChange: (topic: TutorTopicId | "all") => void;
  difficulty: TutorDifficulty;
  onDifficultyChange: (difficulty: TutorDifficulty) => void;
}) {
  const t = dict.aiTutor;

  return (
    <div className="glass-subtle flex flex-col gap-4 rounded-2xl border-border/60 p-4 sm:p-5">
      <div>
        <p className="text-xs font-medium text-muted-foreground">{t.modesLabel}</p>
        <PillGroup
          className="mt-2"
          value={mode}
          options={TUTOR_LEARNING_MODES.map((id) => ({ id, label: t.modes[id].label }))}
          onChange={onModeChange}
        />
        <p className="mt-1.5 text-[11px] text-muted-foreground">{t.modes[mode].description}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-xs font-medium text-muted-foreground">{t.topicsLabel}</p>
          <PillGroup
            className="mt-2"
            value={topic}
            options={[
              { id: "all" as const, label: t.topics.all },
              ...TUTOR_TOPIC_IDS.map((id) => ({ id, label: t.topics[id] })),
            ]}
            onChange={onTopicChange}
          />
        </div>

        <div>
          <p className="text-xs font-medium text-muted-foreground">{t.difficultyLabel}</p>
          <PillGroup
            className="mt-2"
            value={difficulty}
            options={[
              { id: "beginner" as const, label: t.difficulty.beginner },
              { id: "intermediate" as const, label: t.difficulty.intermediate },
              { id: "advanced" as const, label: t.difficulty.advanced },
            ]}
            onChange={onDifficultyChange}
          />
        </div>
      </div>
    </div>
  );
}
