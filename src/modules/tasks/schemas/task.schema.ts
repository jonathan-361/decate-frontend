import { z } from "zod";

// Los valores son EXACTAMENTE los enums de Prisma (sin tildes ni guiones): no hay capa de conversión.
export const taskPrioritySchema = z.enum(["Alta", "Media", "Baja"]);
export type TaskPriority = z.infer<typeof taskPrioritySchema>;

export const taskStatusSchema = z.enum([
  "Pendiente",
  "EnProceso",
  "Completado",
]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskSubjectSchema = z.enum([
  "Calculo",
  "Programacion",
  "Historia",
  "Electronica",
  "Otra",
]);
export type TaskSubject = z.infer<typeof taskSubjectSchema>;

/** Espeja crearTareaSchema del backend. fechaEntrega: YYYY-MM-DD, hora: HH:mm. */
export const taskFormSchema = z.object({
  titulo: z
    .string()
    .trim()
    .min(1, "El título es requerido")
    .max(120, "El título no debe exceder 120 caracteres"),
  descripcion: z.string().optional(),
  materia: taskSubjectSchema,
  fechaEntrega: z.string().min(1, "La fecha de entrega es requerida"),
  hora: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "La hora debe tener el formato HH:mm"),
  prioridad: taskPrioritySchema,
  estado: taskStatusSchema,
});

/** Lo que se envía a crear/actualizar. */
export type TaskPayload = z.infer<typeof taskFormSchema>;

/** Lo que devuelve el backend. fechaEntrega y hora llegan como ISO (ver utils/taskDate.ts). */
export interface Task {
  id: number;
  titulo: string;
  descripcion: string;
  materia: TaskSubject;
  fechaEntrega: string;
  hora: string;
  prioridad: TaskPriority;
  estado: TaskStatus;
  usuarioId: number;
}
