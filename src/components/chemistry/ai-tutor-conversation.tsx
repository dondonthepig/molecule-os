import Link from "next/link";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { dict } from "@/lib/i18n";
import type { TutorAnswer } from "@/lib/chemistry/tutor-engine";
import type { TutorLearningMode } from "@/lib/chemistry/tutor-data";

export type TutorMessage =
  | { id: string; role: "user"; text: string }
  | { id: string; role: "assistant"; mode: TutorLearningMode; answer: TutorAnswer };

function AnswerBody({ body }: { body: string[] }) {
  if (body.length === 0) return null;
  if (body.length === 1) {
    return <p className="text-sm leading-relaxed text-foreground/90">{body[0]}</p>;
  }
  return (
    <ol className="flex flex-col gap-1.5">
      {body.map((line, i) => (
        <li key={i} className="flex gap-2.5 text-sm leading-relaxed text-foreground/90">
          <span className="mt-0.5 shrink-0 text-xs font-medium text-brand-cyan">{i + 1}.</span>
          <span>{line}</span>
        </li>
      ))}
    </ol>
  );
}

function AssistantMessage({ mode, answer }: { mode: TutorLearningMode; answer: TutorAnswer }) {
  const t = dict.aiTutor;

  return (
    <div className="border-l-2 border-brand-blue/40 pl-4">
      <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-cyan">
        <Sparkles className="size-3.5" />
        {t.messages.assistantLabel}
        <span className="font-normal text-muted-foreground">· {t.modes[mode].label}</span>
      </div>

      <p className="mt-2 text-sm font-medium text-foreground">{answer.title}</p>

      {answer.lead ? <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{answer.lead}</p> : null}

      <div className="mt-2">
        <AnswerBody body={answer.body} />
      </div>

      {answer.collapsedBody && answer.collapsedBody.length > 0 ? (
        <details className="mt-3 rounded-xl border border-border/50 px-3.5 py-2.5 open:pb-3">
          <summary className="cursor-pointer text-xs font-semibold text-brand-cyan select-none">
            {answer.collapsedLabel}
          </summary>
          <div className="mt-2">
            <AnswerBody body={answer.collapsedBody} />
          </div>
        </details>
      ) : null}

      {answer.resources.length > 0 ? (
        <div className="mt-3">
          <p className="text-[11px] font-medium text-muted-foreground">{t.relatedResourcesLabel}</p>
          <div className="mt-1.5 flex flex-wrap gap-2">
            {answer.resources.map((resource) => (
              <Link
                key={resource.href}
                href={resource.href}
                className="glass-subtle inline-flex items-center gap-1.5 rounded-full border-border/60 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-muted/40"
              >
                {resource.label}
                <ArrowUpRight className="size-3.5" />
              </Link>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

function UserMessage({ text }: { text: string }) {
  return (
    <div className="text-right">
      <p className="text-xs font-semibold text-muted-foreground">{dict.aiTutor.messages.userLabel}</p>
      <p className="mt-1 text-sm leading-relaxed text-foreground">{text}</p>
    </div>
  );
}

export function AiTutorConversation({ messages, isThinking }: { messages: TutorMessage[]; isThinking: boolean }) {
  const t = dict.aiTutor;

  return (
    <div className="flex flex-col gap-6">
      {messages.map((message) =>
        message.role === "user" ? (
          <UserMessage key={message.id} text={message.text} />
        ) : (
          <AssistantMessage key={message.id} mode={message.mode} answer={message.answer} />
        ),
      )}

      {isThinking ? (
        <div className="border-l-2 border-brand-blue/40 pl-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-cyan">
            <Sparkles className="size-3.5 animate-pulse" />
            {t.messages.assistantLabel}
          </div>
          <p className="mt-2 text-sm text-muted-foreground">{t.messages.thinking}</p>
        </div>
      ) : null}
    </div>
  );
}
