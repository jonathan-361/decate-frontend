import { useEffect } from "react";
import { Link } from "react-router";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { paths } from "@/modules/core/routes/paths/path";
import { PageContainer, PageHeader } from "@/components/custom";
import { WeeklyProgress } from "@/modules/dashboard/components/WeeklyProgress";
import { PendingTasksSection } from "@/modules/dashboard/components/PendingTasksSection";
import { UpcomingExamsSection } from "@/modules/dashboard/components/UpcomingExamsSection";
import { QuickAccessSection } from "@/modules/dashboard/components/QuickAccessSection";
import { useTaskStore } from "@/modules/tasks/stores/task.store";
import { dueDateTime } from "@/modules/tasks/utils/taskDate";
import { useExamStore } from "@/modules/exams/stores/exam.store";
import { getUpcomingExams } from "@/modules/exams/data/examMeta";

export default function DashboardPage() {
  const { tasks, isLoading, fetchTasks } = useTaskStore();
  const exams = useExamStore((s) => s.exams);
  const examsLoading = useExamStore((s) => s.isLoading);
  const fetchExams = useExamStore((s) => s.fetchExams);

  useEffect(() => {
    void fetchTasks();
    void fetchExams();
  }, [fetchTasks, fetchExams]);

  const pendingTasks = tasks
    .filter((t) => t.estado !== "Completado")
    .sort((a, b) => dueDateTime(a).getTime() - dueDateTime(b).getTime());

  const upcomingExams = getUpcomingExams(exams);

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
              {pendingTasks.length} {pendingTasks.length === 1 ? "tarea pendiente" : "tareas pendientes"}
            </span>{" "}
            y{" "}
            <span className="text-foreground font-medium">
              {upcomingExams.length} {upcomingExams.length === 1 ? "examen próximo" : "exámenes próximos"}
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
      <WeeklyProgress tasks={tasks} />

      {/* Two-column grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <PendingTasksSection tasks={pendingTasks} isLoading={isLoading} />

        <div className="space-y-8">
          <UpcomingExamsSection exams={upcomingExams.slice(0, 3)} isLoading={examsLoading} />
        </div>
      </div>

      {/* Quick access */}
      <QuickAccessSection />
    </PageContainer>
  );
}