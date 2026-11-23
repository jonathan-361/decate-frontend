import { TrendingUp } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import type { Task } from "@/modules/tasks/schemas";

interface WeeklyProgressProps {
  tasks?: Task[];
}

export function WeeklyProgress({ tasks = [] }: WeeklyProgressProps) {
  const total = tasks.length;
  const completed = tasks.filter((t) => t.estado === "Completado").length;
  const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="border border-border bg-card rounded-none p-5 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <TrendingUp className="size-4 text-muted-foreground" />
          <span className="text-sm font-medium text-foreground">
            Progreso de tareas
          </span>
        </div>
        <span className="text-sm text-muted-foreground">
          <span className="text-foreground font-semibold">{rate}%</span> completado
        </span>
      </div>
      <Progress value={rate} aria-label="Progreso de tareas" className="h-1.5" />
      <p className="text-xs text-muted-foreground">
        {total === 0
          ? "No hay actividades registradas aún."
          : `Completaste ${completed} de ${total} ${
              total === 1 ? "actividad" : "actividades"
            }. ${rate === 100 ? "¡Todo completado!" : rate >= 50 ? "¡Buen ritmo!" : "¡Ánimo con tus entregas!"}`}
      </p>
    </div>
  );
}

