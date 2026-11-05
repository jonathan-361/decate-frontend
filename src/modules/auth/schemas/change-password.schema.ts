import { z } from "zod";

export const changePasswordEmailSchema = z.object({
  email: z
    .string()
    .min(1, "El correo es requerido")
    .email("Ingresa un correo válido"),
});

export type ChangePasswordEmailFormValues = z.infer<typeof changePasswordEmailSchema>;

export const changePasswordResetSchema = z
  .object({
    code: z.string().length(6, "El código debe tener 6 dígitos"),
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

export type ChangePasswordResetFormValues = z.infer<typeof changePasswordResetSchema>;

