import { Link } from "react-router";
import { AlertCircle, ArrowRight, CheckCircle2 } from "lucide-react";
import { paths } from "@/modules/core/routes/paths/path";
import { SectionHeader, PriorityDot } from "@/components/custom";
import type { Task } from "@/modules/tasks/schemas";
import {
  getMateriaColor,
  getMateriaLabel,
} from "@/modules/tasks/data/taskMeta";
import { dueDateTime, toTimeInput } from "@/modules/tasks/utils/taskDate";

interface PendingTasksSectionProps {
  tasks: Task[];
  isLoading?: boolean;
}

function formatTaskDate(task: Task): string {
  const dt = dueDateTime(task);
  const now = new Date();
  const isToday = dt.toDateString() === now.toDateString();
  const tmr = new Date(now);
  tmr.setDate(tmr.getDate() + 1);
  const isTomorrow = dt.toDateString() === tmr.toDateString();
  const time = toTimeInput(task.hora);

  if (isToday) return `Hoy, ${time}`;
  if (isTomorrow) return `Mañana, ${time}`;

  return (
    dt.toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }) + `, ${time}`
  );
}

export function PendingTasksSection({
  tasks,
  isLoading,
}: PendingTasksSectionProps) {
  return (
    <section>
      <SectionHeader title="Tareas pendientes" linkTo={paths.tasks} />

      <div className="border border-border rounded-none divide-y divide-border">
        {isLoading && tasks.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            Cargando tareas…
          </div>
        ) : tasks.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 px-4 text-center">
            <CheckCircle2 className="size-6 text-muted-foreground/40 mb-2" />
            <p className="text-xs font-medium text-foreground">
              No tienes tareas pendientes
            </p>
            <p className="text-[11px] text-muted-foreground mt-0.5">
              ¡Estás al día con todas tus actividades!
            </p>
          </div>
        ) : (
          tasks.slice(0, 5).map((task) => {
            const overdue = dueDateTime(task) < new Date();
            const isUrgent = task.prioridad === "Alta" || overdue;
            const subjectLabel = getMateriaLabel(task.materia);
            const subjectColor = getMateriaColor(task.materia);

            return (
              <div
                key={task.id}
                className="flex items-start gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
              >
                <span
                  className={`mt-0.5 inline-block size-2 rounded-full shrink-0 ${subjectColor}`}
                  aria-hidden="true"
                />
                <div className="flex-1 min-w-0 space-y-1">
                  <p className="text-sm font-medium text-foreground leading-snug truncate">
                    {task.titulo}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-xs text-muted-foreground">
                      {subjectLabel}
                    </span>
                    <span className="text-muted-foreground/40 text-xs">·</span>
                    <span
                      className={`text-xs font-medium ${isUrgent ? "text-destructive" : "text-muted-foreground"
                        }`}
                    >
                      {isUrgent && (
                        <AlertCircle className="inline size-3 mr-0.5 -mt-px" />
                      )}
                      {formatTaskDate(task)}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <PriorityDot priority={task.prioridad} />
                  <span className="text-xs text-muted-foreground">
                    {task.prioridad}
                  </span>
                </div>
              </div>
            );
          })
        )}

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