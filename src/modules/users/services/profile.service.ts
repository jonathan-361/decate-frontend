import { get } from "@/modules/core/services/axios.instance";
import type { ApiResponse } from "@/modules/auth/types/auth.types";

export interface PerfilUsuario {
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  matricula: string;
  correo: string;
}

export const profileService = {
  getPerfil: (id: number) =>
    get<ApiResponse<PerfilUsuario>>(`/api/usuarios/perfil`, { params: { id } }),
};
