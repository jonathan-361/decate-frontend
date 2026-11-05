import {
  Paperclip,
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
import { PriorityDot, priorityConfig } from "@/components/custom";
import type { Task, TaskStatus } from "@/modules/tasks/schemas";

const statusConfig: Record<
  TaskStatus,
  { label: string; icon: React.ElementType; variant: "default" | "secondary" | "destructive" }
> = {
  pendiente: { label: "Pendiente", icon: Circle, variant: "secondary" },
  "en-proceso": { label: "En proceso", icon: Clock, variant: "default" },
  completada: { label: "Completada", icon: CircleCheck, variant: "secondary" },
};

function formatDueDate(date: string, time: string): string {
  const d = new Date(`${date}T${time}`);
  return (
    d.toLocaleDateString("es-MX", { weekday: "short", day: "numeric", month: "short" }) +
    ", " +
    time
  );
}

function isOverdue(date: string, time: string, status: TaskStatus): boolean {
  if (status === "completada") return false;
  return new Date(`${date}T${time}`) < new Date();
}

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (id: number) => void;
  onToggleStatus: (id: number) => void;
}

export function TaskCard({ task, onEdit, onDelete, onToggleStatus }: TaskCardProps) {
  const st = statusConfig[task.status];
  const pr = priorityConfig[task.priority];
  const overdue = isOverdue(task.dueDate, task.dueTime, task.status);
  const done = task.status === "completada";

  return (
    <div
      className={`group flex gap-3 border border-border rounded-none p-4 hover:border-foreground/20 transition-colors ${
        done ? "opacity-60" : ""
      }`}
    >
      {/* Checkbox */}
      <div className="pt-0.5 shrink-0">
        <Checkbox
          checked={done}
          onCheckedChange={() => onToggleStatus(task.id)}
          aria-label={done ? "Marcar como pendiente" : "Marcar como completada"}
          className="rounded-none"
        />
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 space-y-1.5">
        <div className="flex items-start gap-2 flex-wrap">
          <p
            className={`text-sm font-medium leading-snug ${
              done ? "line-through text-muted-foreground" : "text-foreground"
            }`}
          >
            {task.title}
          </p>
          {task.hasAttachment && (
            <Paperclip
              className="size-3.5 text-muted-foreground shrink-0 mt-0.5"
              aria-label="Tiene adjunto"
            />
          )}
        </div>

        {task.description && (
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {task.description}
          </p>
        )}

        <div className="flex items-center gap-2 flex-wrap pt-0.5">
          {/* Subject pill */}
          <span className="inline-flex items-center gap-1.5 text-xs text-muted-foreground">
            <span className={`inline-block size-1.5 rounded-full ${task.subjectColor}`} />
            {task.subject}
          </span>

          <span className="text-muted-foreground/40">·</span>

          {/* Due date */}
          <span
            className={`text-xs font-medium inline-flex items-center gap-1 ${
              overdue ? "text-destructive" : "text-muted-foreground"
            }`}
          >
            {overdue && <AlertCircle className="size-3" />}
            {formatDueDate(task.dueDate, task.dueTime)}
            {overdue && " · Vencida"}
          </span>

          <span className="text-muted-foreground/40">·</span>

          {/* Priority */}
          <span className={`text-xs font-medium inline-flex items-center gap-1 ${pr.color}`}>
            <span className={`inline-block size-1.5 rounded-full ${pr.dotColor}`} />
            {task.priority}
          </span>
        </div>
      </div>

      {/* Status + actions */}
      <div className="flex flex-col items-end gap-2 shrink-0">
        <Badge variant={st.variant} className="text-[10px]">
          <st.icon className="size-3" />
          {st.label}
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

