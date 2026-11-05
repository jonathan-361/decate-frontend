import { Link } from "react-router";
import { AlertCircle, ArrowRight } from "lucide-react";
import { paths } from "@/modules/core/routes/paths/path";
import { SectionHeader, PriorityDot } from "@/components/custom";
import type { PendingTaskSummary } from "@/modules/dashboard/data/mockDashboard";

interface PendingTasksSectionProps {
  tasks: PendingTaskSummary[];
}

export function PendingTasksSection({ tasks }: PendingTasksSectionProps) {
  return (
    <section>
      <SectionHeader title="Tareas pendientes" linkTo={paths.tasks} />

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

