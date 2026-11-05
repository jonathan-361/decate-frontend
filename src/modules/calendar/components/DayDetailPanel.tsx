import { CalendarOff, Plus } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { EventItem } from "@/modules/calendar/components/EventItem";
import type { CalendarEvent } from "@/modules/calendar/data/mockCalendar";

interface DayDetailPanelProps {
  selectedDate: Date;
  events: CalendarEvent[];
}

export function DayDetailPanel({ selectedDate, events }: DayDetailPanelProps) {
  return (
    <section className="rounded-none border border-border bg-card">
      <div className="space-y-1 border-b border-border p-4">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Día seleccionado
        </p>
        <h3 className="font-heading text-lg font-semibold uppercase tracking-wider text-foreground">
          {format(selectedDate, "EEEE d 'de' MMMM", { locale: es })}
        </h3>
        <p className="text-sm text-muted-foreground">
          {events.length === 0
            ? "Sin actividades programadas"
            : `${events.length} ${events.length === 1 ? "actividad" : "actividades"}`}
        </p>
      </div>

      <div className="space-y-2 p-4">
        {events.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-8 text-center">
            <div className="flex size-10 items-center justify-center rounded-none bg-muted">
              <CalendarOff className="size-5 text-muted-foreground" />
            </div>
            <div className="space-y-1">
              <p className="font-heading text-sm font-semibold uppercase tracking-wider">
                Día libre
              </p>
              <p className="text-sm text-muted-foreground">
                No tienes tareas, exámenes ni eventos este día.
              </p>
            </div>
          </div>
        ) : (
          events.map((event) => <EventItem key={event.id} event={event} />)
        )}

        <Button variant="outline" className="w-full">
          <Plus className="size-3.5" />
          Agregar actividad
        </Button>
      </div>
    </section>
  );
}
