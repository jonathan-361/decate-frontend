import { z } from "zod";

export const registerSchema = z
  .object({
    nombre: z.string().min(1, "El nombre es requerido"),
    apellidoPaterno: z.string().min(1, "El apellido paterno es requerido"),
    apellidoMaterno: z.string().min(1, "El apellido materno es requerido"),
    matricula: z
      .string()
      .min(1, "La matrícula es requerida")
      .regex(/^\d+$/, "La matrícula debe ser un número"),
    email: z
      .string()
      .min(1, "El correo es requerido")
      .email("Ingresa un correo válido"),
    password: z
      .string()
      .min(1, "La contraseña es requerida")
      .min(8, "La contraseña debe tener al menos 8 caracteres"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;

