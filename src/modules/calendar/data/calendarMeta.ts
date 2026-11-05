import { CheckSquare, FlaskConical, Star, type LucideIcon } from "lucide-react";
import { differenceInCalendarDays, isSameDay, startOfToday } from "date-fns";
import type {
  CalendarEvent,
  CalendarEventType,
} from "@/modules/calendar/data/mockCalendar";

export const EVENT_TYPE_META: Record<
  CalendarEventType,
  { label: string; icon: LucideIcon }
> = {
  task: { label: "Tarea", icon: CheckSquare },
  exam: { label: "Examen", icon: FlaskConical },
  event: { label: "Evento", icon: Star },
};

/** Tareas y exámenes tienen fecha de entrega; los eventos no. */
export const isDeadline = (event: CalendarEvent) => event.type !== "event";

export const getDaysLeft = (date: Date) =>
  differenceInCalendarDays(date, startOfToday());

/** Entrega próxima (hoy, mañana, en 2 días) o vencida y sin completar. */
export const isUrgent = (event: CalendarEvent) =>
  isDeadline(event) && !event.completed && getDaysLeft(event.date) <= 2;

export const formatDaysLeft = (days: number) => {
  if (days < 0) return "Vencida";
  if (days === 0) return "Hoy";
  if (days === 1) return "Mañana";
  return `En ${days} días`;
};

export const formatTimeRange = (event: CalendarEvent) => {
  if (!event.time) return "Todo el día";
  return event.endTime ? `${event.time} – ${event.endTime}` : event.time;
};

export const getEventsForDay = (events: CalendarEvent[], day: Date) =>
  events
    .filter((e) => isSameDay(e.date, day))
    .sort((a, b) => (a.time ?? "00:00").localeCompare(b.time ?? "00:00"));

export const getUpcomingDeadlines = (events: CalendarEvent[], limit = 5) =>
  events
    .filter((e) => isDeadline(e) && !e.completed && getDaysLeft(e.date) >= 0)
    .sort(
      (a, b) =>
        a.date.getTime() - b.date.getTime() ||
        (a.time ?? "00:00").localeCompare(b.time ?? "00:00"),
    )
    .slice(0, limit);
