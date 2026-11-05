import { z } from "zod";

export const profileSchema = z.object({
  fullName: z.string().min(1, "El nombre completo es requerido").min(3, "Mínimo 3 caracteres"),
  email: z.string().min(1, "El correo institucional es requerido").email("Ingresa un correo válido"),
  phone: z.string().optional(),
  university: z.string().min(1, "La universidad es requerida"),
  faculty: z.string().optional(),
  career: z.string().min(1, "La carrera es requerida"),
  studentId: z.string().min(1, "La matrícula es requerida"),
  semester: z.string().min(1, "El semestre es requerido"),
  shift: z.enum(["Matutino", "Vespertino", "Mixto", "Ejecutivo"]).default("Matutino"),
  bio: z.string().max(300, "Máximo 300 caracteres").optional(),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

