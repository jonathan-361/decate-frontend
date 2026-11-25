import { CheckSquare, FlaskConical, type LucideIcon } from "lucide-react";
import type {
  ReminderCategory,
  ReminderRule,
  SubjectReminderGroup,
  UpcomingReminder,
} from "@/modules/reminders/schemas";

export const CATEGORY_META: Record<
  ReminderCategory,
  { label: string; description: string; icon: LucideIcon }
> = {
  task: {
    label: "Tareas",
    description: "Avisos antes de la fecha y hora de entrega.",
    icon: CheckSquare,
  },
  exam: {
    label: "Exámenes",
    description: "Avisos antes de la fecha y hora del examen.",
    icon: FlaskConical,
  },
};

export const INITIAL_RULES: Record<ReminderCategory, ReminderRule> = {
  task: { enabled: true, leadTime: "24h" },
  exam: { enabled: true, leadTime: "3d" },
};

export const LEAD_TIME_OPTIONS: Record<
  ReminderCategory,
  { value: string; label: string }[]
> = {
  task: [
    { value: "6h", label: "6 horas antes" },
    { value: "12h", label: "12 horas antes" },
    { value: "24h", label: "24 horas antes" },
    { value: "48h", label: "48 horas antes" },
  ],
  exam: [
    { value: "1d", label: "1 día antes" },
    { value: "3d", label: "3 días antes" },
    { value: "5d", label: "5 días antes" },
    { value: "1w", label: "1 semana antes" },
  ],
};

/** Agrupa por materia. Los grupos y sus elementos quedan ordenados por la fecha más cercana. */
export function groupBySubject(
  reminders: UpcomingReminder[],
): SubjectReminderGroup[] {
  const sorted = [...reminders].sort(
    (a, b) => a.dueAt.getTime() - b.dueAt.getTime(),
  );
  const groups = new Map<string, SubjectReminderGroup>();

  for (const reminder of sorted) {
    const key = reminder.subject.trim().toLowerCase();
    const group = groups.get(key) ?? {
      key,
      subject: reminder.subject,
      color: reminder.subjectColor,
      items: [],
    };
    group.items.push(reminder);
    groups.set(key, group);
  }

  return [...groups.values()];
}