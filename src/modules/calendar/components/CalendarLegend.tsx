import { AlertCircle } from "lucide-react";
import { EVENT_TYPE_META } from "@/modules/calendar/data/calendarMeta";

export function CalendarLegend() {
  return (
    <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-muted-foreground">
      {Object.entries(EVENT_TYPE_META).map(([type, { label, icon: Icon }]) => (
        <span key={type} className="inline-flex items-center gap-1.5">
          <Icon className="size-3.5" aria-hidden="true" />
          {label}
        </span>
      ))}
      <span className="inline-flex items-center gap-1.5 text-destructive">
        <AlertCircle className="size-3.5" aria-hidden="true" />
        Entrega próxima o vencida
      </span>
    </div>
  );
}
