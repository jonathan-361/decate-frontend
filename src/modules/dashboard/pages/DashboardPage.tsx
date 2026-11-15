import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paths } from "@/modules/core/routes/paths/path";
import { PageContainer, PageHeader } from "@/components/custom";
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
    <PageContainer>
      <PageHeader
        eyebrow={dateFormatted}
        title="Buenos días, Estudiante"
        description={
          <>
            Tienes{" "}
            <span className="text-foreground font-medium">
              {MOCK_PENDING_TASKS.length} tareas pendientes
            </span>{" "}
            y{" "}
            <span className="text-foreground font-medium">
              {MOCK_UPCOMING_EXAMS.length} exámenes próximos
            </span>
            .
          </>
        }
        actions={
          <Button size="sm" render={<Link to={paths.tasks} />}>
            <Plus className="size-3.5" />
            Nueva tarea
          </Button>
        }
      />

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
    </PageContainer>
  );
}
