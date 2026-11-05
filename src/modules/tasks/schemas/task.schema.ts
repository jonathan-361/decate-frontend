import { z } from "zod";

export const taskPrioritySchema = z.enum(["Alta", "Media", "Baja"]);
export type TaskPriority = z.infer<typeof taskPrioritySchema>;

export const taskStatusSchema = z.enum(["pendiente", "en-proceso", "completada"]);
export type TaskStatus = z.infer<typeof taskStatusSchema>;

export const taskFormSchema = z.object({
  title: z.string().min(1, "El título es requerido").max(120, "El título no debe exceder 120 caracteres"),
  description: z.string().optional(),
  subject: z.string().min(1, "La materia es requerida"),
  dueDate: z.string().min(1, "La fecha de entrega es requerida"),
  dueTime: z.string().min(1, "La hora de entrega es requerida"),
  priority: taskPrioritySchema.default("Media"),
  status: taskStatusSchema.default("pendiente"),
  hasAttachment: z.boolean().optional().default(false),
});

export type TaskFormValues = z.infer<typeof taskFormSchema>;

export interface Task {
  id: number;
  title: string;
  description: string;
  subject: string;
  subjectColor: string;
  dueDate: string;
  dueTime: string;
  priority: TaskPriority;
  status: TaskStatus;
  hasAttachment: boolean;
}

