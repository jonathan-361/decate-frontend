import {
  Pencil,
  Trash2,
  CircleCheck,
  Circle,
  Clock,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { priorityConfig } from "@/components/custom";
import type { Task, TaskStatus } from "@/modules/tasks/schemas";
import {
  ESTADO_LABEL,
  MATERIA_COLOR,
  MATERIA_LABEL,
} from "@/modules/tasks/data/taskMeta";
import { dueDateTime, toTimeInput } from "@/modules/tasks/utils/taskDate";

const statusConfig: Record<
  TaskStatus,
  { icon: React.ElementType; variant: "default" | "secondary" | "destructive" }
> = {
  Pendiente: { icon: Circle, variant: "secondary" },
  EnProceso: { icon: Clock, variant: "default" },
  Completado: { icon: CircleCheck, variant: "secondary" },
};

function formatDueDate(task: Task): string {
  return (
    dueDateTime(task).toLocaleDateString("es-MX", {
      weekday: "short",
      day: "numeric",
      month: "short",
    }) +
    ", " +
    toTimeInput(task.hora)
  );
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (task: Task) => void;
}

export function TaskCard({
  task,
  onEdit,
  onDelete,
  onToggleStatus,
}: TaskCardProps) {
  const st = statusConfig[task.estado];
  const pr = priorityConfig[task.prioridad];
  const done = task.estado === "Completado";
  const overdue = !done && dueDateTime(task) < new Date();

  return (
    <div
      className={`group flex gap-3 border border-border rounded-none p-4 hover:border-foreground/20 transition-colors ${
        done ? "opacity-60" : ""
      }`}
    >
      <div className="pt-0.5 shrink-0">
        <Checkbox
          checked={done}
          onCheckedChange={() => onToggleStatus(task)}
          aria-label={done ? "Marcar como pendiente" : "Marcar como completada"}
          className="rounded-none"
        />
      </div>

      <div className="flex-1 min-w-0 space-y-1.5">
        <p
          className={`text-sm font-medium leading-snug ${
            done ? "line-through text-muted-foreground" : "text-foreground"
          }`}
        >
          {task.titulo}
        </p>

        {task.descripcion && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {task.descripcion}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span
              className={`inline-block size-1.5 rounded-full ${MATERIA_COLOR[task.materia]}`}
            />
            {MATERIA_LABEL[task.materia]}
          </span>

          <span className="text-muted-foreground/40">·</span>

          <span
            className={`text-xs font-medium inline-flex items-center gap-1 ${
              overdue ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {overdue && <AlertCircle className="size-3" />}
            {formatDueDate(task)}
            {overdue && " · Vencida"}
          </span>

          <span className="text-muted-foreground/40">·</span>

          <span
            className={`text-xs font-medium inline-flex items-center gap-1 ${pr.color}`}
          >
            <span
              className={`inline-block size-1.5 rounded-full ${pr.dotColor}`}
            />
            {task.prioridad}
          </span>
        </div>
      </div>

      <div className="flex flex-col items-end gap-2 shrink-0">
        <Badge variant={st.variant} className="text-[10px]">
          <st.icon className="size-3" />
          {ESTADO_LABEL[task.estado]}
        </Badge>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0"
            onClick={() => onEdit(task)}
            aria-label="Editar tarea"
          >
            <Pencil className="size-3.5" />
          </Button>
          <Button
            size="sm"
            variant="ghost"
            className="h-7 w-7 p-0 text-destructive hover:text-destructive"
            onClick={() => onDelete(task.id)}
            aria-label="Eliminar tarea"
          >
            <Trash2 className="size-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
