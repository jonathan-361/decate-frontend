import { create } from "zustand";
import {
  profileService,
  type PerfilUsuario,
  type UpdatePerfilPayload,
} from "@/modules/users/services/profile.service";
import { getErrorMessage } from "@/modules/core/services/api-error";
import { idbGet, idbSet } from "@/modules/core/services/indexeddb";
import { useAuthStore } from "@/modules/auth/stores/auth.store";

export const PROFILE_KEY = "dacate-profile";

interface ProfileState {
  perfil: PerfilUsuario | null;
  isLoading: boolean;
  error: string | null;
  fetchPerfil: () => Promise<void>;
  updatePerfil: (payload: UpdatePerfilPayload) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  perfil: null,
  isLoading: false,
  error: null,

  fetchPerfil: async () => {
    set({ isLoading: true, error: null });

    const guardado = await idbGet<PerfilUsuario>(PROFILE_KEY);
    if (guardado && !get().perfil) {
      set({ perfil: guardado });
    }

    try {
      const res = await profileService.getPerfil();
      if (!res.success || !res.data) {
        throw new Error(res.message || "Error al obtener el perfil");
      }
      set({ perfil: res.data, isLoading: false, error: null });
      void idbSet(PROFILE_KEY, res.data);
    } catch (err) {
      if (guardado) {
        set({ error: null, isLoading: false });
        return;
      }

      const usuario = useAuthStore.getState().usuario;
      if (usuario) {
        const fallback: PerfilUsuario = {
          id: usuario.id,
          nombre: usuario.nombre,
          apellidoPaterno: "",
          apellidoMaterno: "",
          matricula: 0,
          correo: usuario.correo,
          telefono: "",
          universidad: "",
          carrera: "",
          semestre: 1,
          turno: "MATUTINO",
        };
        set({ perfil: fallback, error: null, isLoading: false });
      } else {
        set({
          error: getErrorMessage(err, "Error al obtener el perfil"),
          isLoading: false,
        });
      }
    }
  },

  updatePerfil: async (payload) => {
    try {
      const res = await profileService.updatePerfil(payload);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Error al actualizar el perfil");
      }
      set({ perfil: res.data, error: null });
      void idbSet(PROFILE_KEY, res.data);
    } catch (err) {
      throw new Error(getErrorMessage(err, "Error al actualizar el perfil"));
    }
  },
}));