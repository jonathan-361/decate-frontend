import { get, patch, remove } from "@/modules/core/services/axios.instance";
import type { ApiResponse, Turno } from "@/modules/auth/types/auth.types";

export interface PerfilUsuario {
  id?: number;
  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  matricula: number;
  correo: string;
  telefono: string;
  universidad: string;
  carrera: string;
  semestre: number;
  turno: Turno;
}

export interface UpdatePerfilPayload {
  carrera?: string;
  semestre?: number;
  telefono?: string;
  turno?: Turno;
}

export const profileService = {
  getPerfil: () =>
    get<ApiResponse<PerfilUsuario>>("/api/usuarios/perfil"),

  updatePerfil: (payload: UpdatePerfilPayload) =>
    patch<ApiResponse<PerfilUsuario>>("/api/usuarios/actualizar", payload),

  deletePerfil: () =>
    remove<ApiResponse<null>>("/api/usuarios/eliminar"),
};