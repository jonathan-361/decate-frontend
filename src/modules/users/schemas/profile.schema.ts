import { z } from "zod";

export const turnoProfileSchema = z.enum(["MATUTINO", "VESPERTINO"], {
  message: "Selecciona un turno válido",
});

export const updateProfileSchema = z.object({
  telefono: z
    .string()
    .trim()
    .min(10, "El teléfono debe tener al menos 10 dígitos")
    .regex(/^\d+$/, "El teléfono solo debe contener números"),
  carrera: z
    .string()
    .trim()
    .min(1, "La carrera es requerida"),
  semestre: z
    .string()
    .trim()
    .min(1, "El semestre es requerido")
    .regex(/^\d+$/, "El semestre debe ser un número")
    .refine(
      (val) => Number.isInteger(Number(val)) && Number(val) > 0,
      "El semestre debe ser un número entero positivo",
    ),
  turno: turnoProfileSchema,
});

export type UpdateProfileFormValues = z.infer<typeof updateProfileSchema>;