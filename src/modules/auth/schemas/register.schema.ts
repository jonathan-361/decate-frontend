import { z } from "zod";

const NAME_REGEX = /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/;

export const turnoSchema = z.enum(["MATUTINO", "VESPERTINO"], {
  message: "Selecciona un turno",
});
export type Turno = z.infer<typeof turnoSchema>;

export const registerSchema = z
  .object({
    nombre: z
      .string()
      .trim()
      .min(1, "El nombre es requerido")
      .min(2, "El nombre debe tener al menos 2 caracteres")
      .regex(NAME_REGEX, "El nombre solo puede contener letras"),
    apellidoPaterno: z
      .string()
      .trim()
      .min(1, "El apellido paterno es requerido")
      .min(2, "El apellido paterno debe tener al menos 2 caracteres")
      .regex(NAME_REGEX, "El apellido paterno solo puede contener letras"),
    apellidoMaterno: z
      .string()
      .trim()
      .min(1, "El apellido materno es requerido")
      .min(2, "El apellido materno debe tener al menos 2 caracteres")
      .regex(NAME_REGEX, "El apellido materno solo puede contener letras"),
    matricula: z
      .string()
      .trim()
      .min(1, "La matrícula es requerida")
      .regex(/^\d+$/, "La matrícula solo debe contener números")
      .refine((val) => Number(val) > 0, "La matrícula debe ser un número positivo"),
    telefono: z
      .string()
      .trim()
      .min(1, "El teléfono es requerido")
      .min(10, "El teléfono debe tener al menos 10 dígitos")
      .regex(/^\d+$/, "El teléfono solo debe contener números"),
    universidad: z
      .string()
      .trim()
      .min(1, "La universidad es requerida"),
    carrera: z
      .string()
      .trim()
      .min(1, "La carrera es requerida"),
    semestre: z
      .string()
      .trim()
      .min(1, "El semestre es requerido")
      .regex(/^\d+$/, "El semestre debe ser un número")
      .refine((val) => Number(val) > 0, "El semestre debe ser un número positivo"),
    turno: turnoSchema,
    email: z
      .string()
      .trim()
      .min(1, "El correo es requerido")
      .email("Ingresa un correo electrónico válido"),
    password: z
      .string()
      .min(8, "La contraseña debe tener al menos 8 caracteres")
      .regex(/[A-Z]/, "Debe contener al menos una letra mayúscula")
      .regex(/[a-z]/, "Debe contener al menos una letra minúscula")
      .regex(/[0-9]/, "Debe contener al menos un número")
      .regex(/[^A-Za-z0-9]/, "Debe contener al menos un carácter especial (ej. !@#$%^&*)"),
    confirmPassword: z.string().min(1, "Confirma tu contraseña"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Las contraseñas no coinciden",
    path: ["confirmPassword"],
  });

export type RegisterFormValues = z.infer<typeof registerSchema>;
