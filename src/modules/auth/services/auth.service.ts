import { post } from "@/modules/core/services/axios.instance";
import type {
  ApiResponse,
  LoginPayload,
  RegistroPayload,
  UsuarioAutenticado,
} from "@/modules/auth/types/auth.types";

export const authService = {
  login: (payload: LoginPayload) =>
    post<ApiResponse<UsuarioAutenticado>>("/api/usuarios/login", payload),

  registro: (payload: RegistroPayload) =>
    post<ApiResponse<null>>("/api/usuarios/registro", payload),

  // Envía al correo un enlace con token (expira en 15 min)
  solicitarRecuperacion: (correo: string) =>
    post<ApiResponse<null>>("/api/recuperacion/recuperar", { correo }),

  // Cambia la contraseña usando el token del enlace
  restablecerPassword: (token: string, password: string) =>
    post<ApiResponse<null>>("/api/recuperacion/restablecer", {
      token,
      password,
    }),
};