import type { ReactNode } from "react";
import { EventItem } from "@/modules/calendar/components/EventItem";
import type { CalendarEvent } from "@/modules/calendar/data/mockCalendar";
import { getEventsForDay } from "@/modules/calendar/data/calendarMeta";

const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 07:00 – 21:00

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
  const allDay = dayEvents.filter((e) => !e.time);
  const timed = dayEvents.filter((e) => e.time);

  return (
    <div className="border border-border">
      <TimeRow label="Todo el día">
        {allDay.map((event) => (
          <EventItem key={event.id} event={event} />
        ))}
      </TimeRow>
      {HOURS.map((hour) => {
        const hourLabel = `${String(hour).padStart(2, "0")}:00`;
        const inHour = timed.filter(
          (e) => Number(e.time!.split(":")[0]) === hour,
        );
        return (
          <TimeRow key={hour} label={hourLabel}>
            {inHour.map((event) => (
              <EventItem key={event.id} event={event} />
            ))}
          </TimeRow>
        );
      })}
    </div>
  );
}
