import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import type { CalendarEvent } from "@/modules/calendar/data/mockCalendar";
import {
  EVENT_TYPE_META,
  isUrgent,
} from "@/modules/calendar/data/calendarMeta";

interface EventChipProps {
  event: CalendarEvent;
}

/** Versión compacta de una actividad, para las celdas de la vista mensual. */
export function EventChip({ event }: EventChipProps) {
  const urgent = isUrgent(event);
  const Icon = urgent ? AlertCircle : EVENT_TYPE_META[event.type].icon;

  return (
    <div
      className={cn(
        "flex min-w-0 items-center gap-1 rounded-none px-1.5 py-0.5 text-[11px] leading-tight",
        event.type === "exam" && "bg-primary text-primary-foreground",
        event.type === "task" &&
          "border border-border bg-background text-foreground",
        event.type === "event" && "bg-muted text-foreground",
        urgent &&
          event.type === "task" &&
          "border-destructive/40 text-destructive",
        event.completed && "line-through opacity-60",
      )}
    >
      <Icon className="size-3 shrink-0" aria-hidden="true" />
      <span className="truncate">{event.title}</span>
    </div>
  );
}
