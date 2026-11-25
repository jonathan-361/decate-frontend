import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { PriorityDot } from "@/components/custom";
import type { CalendarEvent } from "@/modules/calendar/schemas";
import {
  EVENT_TYPE_META,
  formatDaysLeft,
  getDaysLeft,
  isUrgent,
} from "@/modules/calendar/data/calendarMeta";

interface EventItemProps {
  event: CalendarEvent;
}

/** Fila completa de una actividad: semana, día y panel del día seleccionado. */
export function EventItem({ event }: EventItemProps) {
  const { icon: Icon, label } = EVENT_TYPE_META[event.type];
  const urgent = isUrgent(event);

  return (
    <div
      className={cn(
        "flex items-start gap-3 rounded-none border border-border bg-card p-3 transition-colors hover:border-foreground/20",
        event.type === "exam" && "border-l-2 border-l-primary",
        event.completed && "opacity-60",
      )}
    >
      <div className="flex size-8 shrink-0 items-center justify-center rounded-none bg-muted">
        <Icon className="size-4 text-foreground" aria-hidden="true" />
      </div>

      <div className="min-w-0 flex-1 space-y-1">
        <p
          className={cn(
            "text-sm font-medium leading-snug text-foreground",
            event.completed && "line-through",
          )}
        >
          {event.title}
        </p>

        <div className="flex flex-wrap items-center gap-x-2 gap-y-0.5 text-xs text-muted-foreground">
          {event.subject && (
            <>
              <span
                className={cn(
                  "inline-block size-1.5 rounded-full",
                  event.subjectColor,
                )}
                aria-hidden="true"
              />
              <span>{event.subject}</span>
              <span className="text-muted-foreground/40">·</span>
            </>
          )}
          <span>{event.time}</span>
          {event.location && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span>{event.location}</span>
            </>
          )}
          {event.priority && (
            <>
              <span className="text-muted-foreground/40">·</span>
              <span className="inline-flex items-center gap-1.5">
                <PriorityDot priority={event.priority} />
                {event.priority}
              </span>
            </>
          )}
        </div>

        {urgent && (
          <p className="flex items-center gap-1 text-xs font-medium text-destructive">
            <AlertCircle className="size-3" aria-hidden="true" />
            {formatDaysLeft(getDaysLeft(event.date))}
          </p>
        )}
      </div>

      <Badge
        variant={event.type === "exam" ? "default" : "secondary"}
        className="shrink-0"
      >
        {label}
      </Badge>
    </div>
  );
}