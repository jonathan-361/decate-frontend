import { Link } from "react-router";
import { ArrowRight, AlertCircle } from "lucide-react";
import { paths } from "@/modules/core/routes/paths/path";
import type { PendingTaskSummary } from "@/modules/core/data/mockDashboard";

function PriorityDot({ priority }: { priority: string }) {
  const colors: Record<string, string> = {
    Alta: "bg-destructive",
    Media: "bg-amber-500",
    Baja: "bg-muted-foreground",
  };
  return (
    <span
      className={`inline-block size-1.5 rounded-full shrink-0 ${colors[priority] ?? "bg-muted-foreground"}`}
      aria-label={`Prioridad ${priority}`}
    />
  );
}

interface PendingTasksSectionProps {
  tasks: PendingTaskSummary[];
}

export function PendingTasksSection({ tasks }: PendingTasksSectionProps) {
  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xs font-semibold tracking-wider uppercase text-muted-foreground">
          Tareas pendientes
        </h2>
        <Link
          to={paths.tasks}
          className="inline-flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors font-medium"
        >
          Ver todo
          <ArrowRight className="size-3" />
        </Link>
      </div>

      <div className="border border-border rounded-none divide-y divide-border">
        {tasks.map((task) => (
          <div
            key={task.id}
            className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
          >
            <span
              className={`mt-0.5 inline-block size-2 rounded-full shrink-0 ${task.subjectColor}`}
              aria-hidden="true"
            />
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-sm font-medium text-foreground leading-snug truncate">
                {task.title}
              </p>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground">{task.subject}</span>
                <span className="text-muted-foreground/40 text-xs">·</span>
                <span
                  className={`text-xs font-medium ${
                    task.isUrgent ? "text-destructive" : "text-muted-foreground"
                  }`}
                >
                  {task.isUrgent && <AlertCircle className="inline size-3 mr-0.5 -mt-px" />}
                  {task.dueDate}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              <PriorityDot priority={task.priority} />
              <span className="text-xs text-muted-foreground">{task.priority}</span>
            </div>
          </div>
        ))}
        <div className="px-4 py-3">
          <Link
            to={paths.tasks}
            className="text-xs text-primary hover:text-primary/80 transition-colors font-medium inline-flex items-center gap-1"
          >
            Ver todas las tareas
            <ArrowRight className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

