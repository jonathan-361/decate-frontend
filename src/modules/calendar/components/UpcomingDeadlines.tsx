import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/custom";
import type { CalendarEvent } from "@/modules/calendar/data/mockCalendar";
import {
  EVENT_TYPE_META,
  formatDaysLeft,
  getDaysLeft,
  getUpcomingDeadlines,
  isUrgent,
} from "@/modules/calendar/data/calendarMeta";

interface UpcomingDeadlinesProps {
  events: CalendarEvent[];
}

export function UpcomingDeadlines({ events }: UpcomingDeadlinesProps) {
  const deadlines = getUpcomingDeadlines(events, 5);

  return (
    <section>
      <SectionHeader title="Próximas entregas" />
      <div className="divide-y divide-border rounded-none border border-border">
        {deadlines.map((event) => {
          const Icon = EVENT_TYPE_META[event.type].icon;
          const urgent = isUrgent(event);
          return (
            <div
              key={event.id}
              className="flex items-center gap-3 px-4 py-3 transition-colors hover:bg-muted/50"
            >
              <Icon
                className="size-4 shrink-0 text-muted-foreground"
                aria-hidden="true"
              />
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium leading-snug text-foreground">
                  {event.title}
                </p>
                <p className="text-xs text-muted-foreground">
                  {event.subject ?? EVENT_TYPE_META[event.type].label}
                </p>
              </div>
              <div className="shrink-0 text-right">
                <p className="text-xs font-medium text-foreground">
                  {format(event.date, "EEE d MMM", { locale: es })}
                </p>
                <p
                  className={cn(
                    "text-xs",
                    urgent
                      ? "font-medium text-destructive"
                      : "text-muted-foreground",
                  )}
                >
                  {formatDaysLeft(getDaysLeft(event.date))}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
