import {
  eachDayOfInterval,
  endOfWeek,
  format,
  isSameDay,
  isToday,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { EventItem } from "@/modules/calendar/components/EventItem";
import type { CalendarEvent } from "@/modules/calendar/schemas";
import { getEventsForDay } from "@/modules/calendar/data/calendarMeta";

interface WeekViewProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onSelectDay: (day: Date) => void;
}

export function WeekView({
  currentDate,
  selectedDate,
  events,
  onSelectDay,
}: WeekViewProps) {
  const days = eachDayOfInterval({
    start: startOfWeek(currentDate, { weekStartsOn: 1 }),
    end: endOfWeek(currentDate, { weekStartsOn: 1 }),
  });

  return (
    <div className="grid grid-cols-1 divide-y divide-border border border-border md:grid-cols-7 md:divide-x md:divide-y-0">
      {days.map((day) => {
        const dayEvents = getEventsForDay(events, day);
        const selected = isSameDay(day, selectedDate);

        return (
          <div key={day.toISOString()} className="flex min-w-0 flex-col">
            <button
              type="button"
              onClick={() => onSelectDay(day)}
              aria-pressed={selected}
              className={cn(
                "flex items-center gap-2 rounded-none border-b border-border px-3 py-2.5 text-left transition-colors hover:bg-muted/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring/30 md:flex-col md:items-start md:gap-0.5",
                selected && "bg-muted",
              )}
            >
              <span className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                {format(day, "EEE", { locale: es }).replace(".", "")}
              </span>
              <span
                className={cn(
                  "inline-flex size-7 items-center justify-center text-sm font-semibold",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </span>
            </button>

            <div className="flex-1 space-y-2 p-2 md:min-h-64">
              {dayEvents.length === 0 ? (
                <p className="px-1 py-2 text-xs text-muted-foreground">
                  Sin actividades
                </p>
              ) : (
                dayEvents.map((event) => (
                  <EventItem key={event.uid} event={event} />
                ))
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}