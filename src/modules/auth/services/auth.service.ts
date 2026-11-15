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
};
