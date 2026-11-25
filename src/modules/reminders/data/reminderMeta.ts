import { isToday, isTomorrow } from "date-fns";
import { CheckSquare, FlaskConical, type LucideIcon } from "lucide-react";
import type {
  ReminderCategory,
  ReminderRule,
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

export function groupUpcoming(reminders: UpcomingReminder[]) {
  const sorted = [...reminders].sort(
    (a, b) => a.fireAt.getTime() - b.fireAt.getTime(),
  );
  const groups: { key: string; label: string; items: UpcomingReminder[] }[] = [
    { key: "today", label: "Hoy", items: [] },
    { key: "tomorrow", label: "Mañana", items: [] },
    { key: "later", label: "Próximos días", items: [] },
  ];
  for (const reminder of sorted) {
    const group = isToday(reminder.fireAt)
      ? groups[0]
      : isTomorrow(reminder.fireAt)
        ? groups[1]
        : groups[2];
    group.items.push(reminder);
  }
  return groups.filter((g) => g.items.length > 0);
}