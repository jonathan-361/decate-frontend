import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paths } from "@/modules/core/routes/paths/path";
import { AppLayout } from "@/modules/core/components/AppLayout";
import {
  MOCK_PENDING_TASKS,
  MOCK_UPCOMING_EXAMS,
  MOCK_TODAY_CLASSES,
  MOCK_COMPLETION_RATE,
} from "@/modules/dashboard/data/mockDashboard";
import { WeeklyProgress } from "@/modules/dashboard/components/WeeklyProgress";
import { PendingTasksSection } from "@/modules/dashboard/components/PendingTasksSection";
import { UpcomingExamsSection } from "@/modules/dashboard/components/UpcomingExamsSection";
import { TodayClassesSection } from "@/modules/dashboard/components/TodayClassesSection";
import { QuickAccessSection } from "@/modules/dashboard/components/QuickAccessSection";

export default function DashboardPage() {
  const now = new Date();
  const dateStr = now.toLocaleDateString("es-MX", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
  const dateFormatted = dateStr.charAt(0).toUpperCase() + dateStr.slice(1);

  return (
    <AppLayout>
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
          <div>
            <p className="text-xs text-muted-foreground uppercase tracking-wider mb-1">
              {dateFormatted}
            </p>
            <h1 className="font-heading text-2xl font-semibold tracking-tight text-foreground">
              Buenos días, Estudiante
            </h1>
            <p className="text-sm text-muted-foreground mt-0.5">
              Tienes{" "}
              <span className="text-foreground font-medium">
                {MOCK_PENDING_TASKS.length} tareas pendientes
              </span>{" "}
              y{" "}
              <span className="text-foreground font-medium">
                {MOCK_UPCOMING_EXAMS.length} exámenes próximos
              </span>
              .
            </p>
          </div>
          <Button size="sm" render={<Link to={paths.tasks} />}>
            <Plus className="size-3.5" />
            Nueva tarea
          </Button>
        </div>

        {/* Weekly Completion Strip */}
        <WeeklyProgress completionRate={MOCK_COMPLETION_RATE} />

        {/* Two-column grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <PendingTasksSection tasks={MOCK_PENDING_TASKS} />

          <div className="space-y-8">
            <UpcomingExamsSection exams={MOCK_UPCOMING_EXAMS} />
            <TodayClassesSection classes={MOCK_TODAY_CLASSES} />
          </div>
        </div>

        {/* Quick access */}
        <QuickAccessSection />
      </div>
    </AppLayout>
  );
}
