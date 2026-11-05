import { useState } from "react";
import {
  addDays,
  addMonths,
  addWeeks,
  endOfWeek,
  format,
  isSameMonth,
  startOfWeek,
  subDays,
  subMonths,
  subWeeks,
} from "date-fns";
import { es } from "date-fns/locale";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageContainer, PageHeader } from "@/components/custom";
import { AppLayout } from "@/modules/core/components/AppLayout";
import { CalendarToolbar } from "@/modules/calendar/components/CalendarToolbar";
import { CalendarLegend } from "@/modules/calendar/components/CalendarLegend";
import { MonthView } from "@/modules/calendar/components/MonthView";
import { WeekView } from "@/modules/calendar/components/WeekView";
import { DayView } from "@/modules/calendar/components/DayView";
import { DayDetailPanel } from "@/modules/calendar/components/DayDetailPanel";
import { UpcomingDeadlines } from "@/modules/calendar/components/UpcomingDeadlines";
import {
  MOCK_CALENDAR_EVENTS,
  type CalendarView,
} from "@/modules/calendar/data/mockCalendar";
import { getEventsForDay } from "@/modules/calendar/data/calendarMeta";

function getPeriodLabel(view: CalendarView, date: Date) {
  if (view === "month") return format(date, "LLLL yyyy", { locale: es });
  if (view === "day") return format(date, "EEEE d 'de' MMMM", { locale: es });
  const start = startOfWeek(date, { weekStartsOn: 1 });
  const end = endOfWeek(date, { weekStartsOn: 1 });
  return `${format(start, "d MMM", { locale: es })} – ${format(end, "d MMM yyyy", { locale: es })}`;
}

export default function CalendarPage() {
  // Estado local solo para poder revisar el diseño de las tres vistas.
  const [view, setView] = useState<CalendarView>("month");
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const events = MOCK_CALENDAR_EVENTS;

  const move = (direction: 1 | -1) => {
    const fn = {
      month: direction === 1 ? addMonths : subMonths,
      week: direction === 1 ? addWeeks : subWeeks,
      day: direction === 1 ? addDays : subDays,
    }[view];
    setCurrentDate(fn(currentDate, 1));
  };

  const handleSelectDay = (day: Date) => {
    setSelectedDate(day);
    if (
      view === "day" ||
      (view === "month" && !isSameMonth(day, currentDate))
    ) {
      setCurrentDate(day);
    }
  };

  const handleViewChange = (next: CalendarView) => {
    setView(next);
    setCurrentDate(selectedDate);
  };

  const handleToday = () => {
    const now = new Date();
    setCurrentDate(now);
    setSelectedDate(now);
  };

  return (
    <AppLayout>
      <PageContainer size="lg">
        <PageHeader
          title="Calendario"
          description="Tus tareas, exámenes y eventos importantes en un solo lugar."
          actions={
            <Button size="sm">
              <Plus className="size-3.5" />
              Nuevo evento
            </Button>
          }
        />

        <CalendarToolbar
          view={view}
          label={getPeriodLabel(view, currentDate)}
          onViewChange={handleViewChange}
          onPrev={() => move(-1)}
          onNext={() => move(1)}
          onToday={handleToday}
        />

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_20rem]">
          {/* Calendario */}
          <div className="min-w-0 space-y-4">
            {view === "month" && (
              <MonthView
                currentDate={currentDate}
                selectedDate={selectedDate}
                events={events}
                onSelectDay={handleSelectDay}
              />
            )}
            {view === "week" && (
              <WeekView
                currentDate={currentDate}
                selectedDate={selectedDate}
                events={events}
                onSelectDay={handleSelectDay}
              />
            )}
            {view === "day" && (
              <DayView currentDate={currentDate} events={events} />
            )}
            <CalendarLegend />
          </div>

          {/* Panel lateral */}
          <aside className="space-y-8">
            <DayDetailPanel
              selectedDate={selectedDate}
              events={getEventsForDay(events, selectedDate)}
            />
            <UpcomingDeadlines events={events} />
          </aside>
        </div>
      </PageContainer>
    </AppLayout>
  );
}
