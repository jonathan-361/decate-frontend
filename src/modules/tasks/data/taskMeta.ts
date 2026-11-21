import { taskSubjectSchema } from "@/modules/tasks/schemas";
import type { TaskStatus, TaskSubject } from "@/modules/tasks/schemas";

export const MATERIAS = taskSubjectSchema.options;

export const MATERIA_LABEL: Record<TaskSubject, string> = {
  Calculo: "Cálculo",
  Programacion: "Programación",
  Historia: "Historia",
  Electronica: "Electrónica",
  Otra: "Otra",
};

export const MATERIA_COLOR: Record<TaskSubject, string> = {
  Calculo: "bg-blue-500",
  Programacion: "bg-emerald-500",
  Historia: "bg-amber-500",
  Electronica: "bg-violet-500",
  Otra: "bg-muted-foreground",
};

export const ESTADO_LABEL: Record<TaskStatus, string> = {
  Pendiente: "Pendiente",
  EnProceso: "En proceso",
  Completado: "Completada",
};
