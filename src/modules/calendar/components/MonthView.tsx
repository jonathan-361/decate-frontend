import {
  eachDayOfInterval,
  endOfMonth,
  endOfWeek,
  format,
  isSameDay,
  isSameMonth,
  isToday,
  startOfMonth,
  startOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { EventChip } from "@/modules/calendar/components/EventChip";
import type { CalendarEvent } from "@/modules/calendar/data/mockCalendar";
import { getEventsForDay } from "@/modules/calendar/data/calendarMeta";

const MAX_VISIBLE = 3;

interface MonthViewProps {
  currentDate: Date;
  selectedDate: Date;
  events: CalendarEvent[];
  onSelectDay: (day: Date) => void;
}

export function MonthView({
  currentDate,
  selectedDate,
  events,
  onSelectDay,
}: MonthViewProps) {
  const days = eachDayOfInterval({
    start: startOfWeek(startOfMonth(currentDate), { weekStartsOn: 1 }),
    end: endOfWeek(endOfMonth(currentDate), { weekStartsOn: 1 }),
  });

  return (
    <div className="border border-border">
      {/* Encabezado de días */}
      <div className="grid grid-cols-7 border-b border-border bg-muted">
        {days.slice(0, 7).map((day) => (
          <div
            key={day.toISOString()}
            className="px-2 py-2 text-center text-[10px] font-semibold uppercase tracking-widest text-muted-foreground"
          >
            {format(day, "EEE", { locale: es }).replace(".", "")}
          </div>
        ))}
      </div>

      {/* Celdas */}
      <div className="grid grid-cols-7">
        {days.map((day, index) => {
          const dayEvents = getEventsForDay(events, day);
          const hidden = dayEvents.length - MAX_VISIBLE;
          const selected = isSameDay(day, selectedDate);
          const inMonth = isSameMonth(day, currentDate);

          return (
            <button
              key={day.toISOString()}
              type="button"
              onClick={() => onSelectDay(day)}
              aria-label={format(day, "EEEE d 'de' MMMM", { locale: es })}
              aria-pressed={selected}
              className={cn(
                "flex min-h-16 flex-col items-stretch gap-1.5 rounded-none border-border p-1.5 text-left transition-colors hover:bg-muted/50 focus-visible:z-10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/30 md:min-h-28 md:p-2",
                index % 7 !== 6 && "border-r",
                index < days.length - 7 && "border-b",
                !inMonth && "bg-sidebar text-muted-foreground/60",
                selected && "bg-muted ring-1 ring-inset ring-foreground",
              )}
            >
              <span
                className={cn(
                  "inline-flex size-6 items-center justify-center self-start text-xs font-medium",
                  isToday(day) && "bg-primary text-primary-foreground",
                )}
              >
                {format(day, "d")}
              </span>

              {/* Móvil: solo puntos */}
              <div className="flex gap-0.5 md:hidden">
                {dayEvents.slice(0, 4).map((event) => (
                  <span
                    key={event.id}
                    className={cn(
                      "size-1.5 rounded-full",
                      event.subjectColor ?? "bg-foreground/40",
                    )}
                    aria-hidden="true"
                  />
                ))}
              </div>

              {/* Escritorio: chips */}
              <div className="hidden min-w-0 flex-col gap-1 md:flex">
                {dayEvents.slice(0, MAX_VISIBLE).map((event) => (
                  <EventChip key={event.id} event={event} />
                ))}
                {hidden > 0 && (
                  <span className="px-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                    +{hidden} más
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
