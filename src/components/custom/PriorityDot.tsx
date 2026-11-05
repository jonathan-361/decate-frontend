import type { TaskPriority } from "@/modules/tasks/schemas";

export const priorityConfig: Record<TaskPriority, { color: string; dotColor: string }> = {
  Alta: { color: "text-destructive", dotColor: "bg-destructive" },
  Media: { color: "text-amber-600", dotColor: "bg-amber-500" },
  Baja: { color: "text-muted-foreground", dotColor: "bg-muted-foreground/50" },
};

interface PriorityDotProps {
  priority: TaskPriority;
  className?: string;
}

export function PriorityDot({ priority, className = "" }: PriorityDotProps) {
  return (
    <span
      className={`inline-block size-1.5 rounded-full shrink-0 ${
        priorityConfig[priority]?.dotColor ?? "bg-muted-foreground"
      } ${className}`}
      aria-label={`Prioridad ${priority}`}
    />
  );
}

