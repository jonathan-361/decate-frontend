import type { ReactNode } from "react";
import { EventItem } from "@/modules/calendar/components/EventItem";
import type { CalendarEvent } from "@/modules/calendar/schemas";
import { getEventsForDay } from "@/modules/calendar/data/calendarMeta";

const MIN_HOUR = 7;
const MAX_HOUR = 21;

function TimeRow({ label, children }: { label: string; children?: ReactNode }) {
  return (
    <div className="grid grid-cols-[4.5rem_1fr] border-b border-border last:border-b-0 sm:grid-cols-[5.5rem_1fr]">
      <div className="border-r border-border px-3 py-3 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
        {label}
      </div>
      <div className="min-h-14 space-y-2 p-2">{children}</div>
    </div>
  );
}

interface DayViewProps {
  currentDate: Date;
  events: CalendarEvent[];
}

export function DayView({ currentDate, events }: DayViewProps) {
  const dayEvents = getEventsForDay(events, currentDate);

  // Rango base 07:00 – 21:00, ampliado si hay actividades fuera de él (p. ej. entregas a las 23:59).
  const eventHours = dayEvents.map((e) => Number(e.time.split(":")[0]));
  const startHour = Math.min(MIN_HOUR, ...eventHours);
  const endHour = Math.max(MAX_HOUR, ...eventHours);
  const hours = Array.from(
    { length: endHour - startHour + 1 },
    (_, i) => startHour + i,
  );

  return (
    <div className="border border-border">
      {hours.map((hour) => {
        const hourLabel = `${String(hour).padStart(2, "0")}:00`;
        const inHour = dayEvents.filter(
          (e) => Number(e.time.split(":")[0]) === hour,
        );
        return (
          <TimeRow key={hour} label={hourLabel}>
            {inHour.map((event) => (
              <EventItem key={event.uid} event={event} />
            ))}
          </TimeRow>
        );
      })}
    </div>
  );
}