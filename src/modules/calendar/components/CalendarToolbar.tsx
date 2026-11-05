import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CalendarView } from "@/modules/calendar/data/mockCalendar";

const VIEW_OPTIONS: { value: CalendarView; label: string }[] = [
  { value: "month", label: "Mes" },
  { value: "week", label: "Semana" },
  { value: "day", label: "Día" },
];

interface CalendarToolbarProps {
  view: CalendarView;
  label: string;
  onViewChange: (view: CalendarView) => void;
  onPrev: () => void;
  onNext: () => void;
  onToday: () => void;
}

export function CalendarToolbar({
  view,
  label,
  onViewChange,
  onPrev,
  onNext,
  onToday,
}: CalendarToolbarProps) {
  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex flex-wrap items-center gap-3">
        <div className="flex">
          <Button
            variant="outline"
            size="icon"
            aria-label="Periodo anterior"
            onClick={onPrev}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="-ml-px"
            aria-label="Periodo siguiente"
            onClick={onNext}
          >
            <ChevronRight className="size-4" />
          </Button>
        </div>
        <Button variant="outline" onClick={onToday}>
          Hoy
        </Button>
        <h3 className="font-heading text-lg font-semibold uppercase tracking-wider text-foreground">
          {label}
        </h3>
      </div>

      <div
        role="group"
        aria-label="Vista del calendario"
        className="inline-flex self-start border border-border sm:self-auto"
      >
        {VIEW_OPTIONS.map((option) => (
          <Button
            key={option.value}
            variant={view === option.value ? "default" : "ghost"}
            aria-pressed={view === option.value}
            onClick={() => onViewChange(option.value)}
          >
            {option.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
