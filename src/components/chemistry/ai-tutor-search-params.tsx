"use client";

import { useSearchParams } from "next/navigation";
import { AiTutorWorkspace } from "./ai-tutor-workspace";
import { TUTOR_TOPIC_IDS, type TutorTopicId } from "@/lib/chemistry/tutor-data";

/** Reads an optional `?topic=` param to preselect a topic filter on load. */
export function AiTutorWithSearchParams() {
  const searchParams = useSearchParams();
  const requested = searchParams.get("topic");
  const initialTopic = (TUTOR_TOPIC_IDS as string[]).includes(requested ?? "")
    ? (requested as TutorTopicId)
    : undefined;

  return <AiTutorWorkspace initialTopic={initialTopic} />;
}
