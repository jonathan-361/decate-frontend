import { isToday, isTomorrow } from "date-fns";
import {
  CheckSquare,
  Clock,
  FlaskConical,
  type LucideIcon,
} from "lucide-react";
import type {
  ReminderCategory,
  UpcomingReminder,
} from "@/modules/reminders/data/mockReminders";

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
    description: "Cuenta regresiva y recordatorios para estudiar.",
    icon: FlaskConical,
  },
  class: {
    label: "Clases",
    description: "Aviso con aula y hora antes de cada materia.",
    icon: Clock,
  },
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
  class: [
    { value: "5m", label: "5 minutos antes" },
    { value: "10m", label: "10 minutos antes" },
    { value: "15m", label: "15 minutos antes" },
    { value: "30m", label: "30 minutos antes" },
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
