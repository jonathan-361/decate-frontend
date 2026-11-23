import { create } from "zustand";
import { profileService, type PerfilUsuario } from "@/modules/users/services/profile.service";
import { idbGet, idbSet } from "@/modules/core/services/indexeddb";
import { useAuthStore } from "@/modules/auth/stores/auth.store";

export const PROFILE_KEY = "dacate-profile";
export const PROFILE_FORM_KEY = "dacate-profile-form";

interface ProfileState {
  perfil: PerfilUsuario | null;
  isLoading: boolean;
  error: string | null;
  fetchPerfil: (id: number) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set, get) => ({
  perfil: null,
  isLoading: false,
  error: null,

  fetchPerfil: async (id) => {
    set({ isLoading: true, error: null });

    // 1. Mostrar de inmediato la copia guardada en IndexedDB si existe
    const guardado = await idbGet<PerfilUsuario>(PROFILE_KEY);
    if (guardado && !get().perfil) {
      set({ perfil: guardado });
    }

    // 2. Intentar actualizar desde el servidor
    try {
      const res = await profileService.getPerfil(id);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Error al obtener el perfil");
      }
      set({ perfil: res.data, isLoading: false, error: null });
      void idbSet(PROFILE_KEY, res.data);
    } catch (err) {
      // Si ya hay perfil guardado en IndexedDB o en la sesión auth, se usa sin error bloqueante
      if (guardado) {
        set({ error: null, isLoading: false });
      } else {
        const usuario = useAuthStore.getState().usuario;
        if (usuario) {
          const fallback: PerfilUsuario = {
            nombre: usuario.nombre,
            apellidoPaterno: "",
            apellidoMaterno: "",
            matricula: "",
            correo: usuario.correo,
          };
          set({ perfil: fallback, error: null, isLoading: false });
        } else {
          set({
            error: err instanceof Error ? err.message : "Error al obtener el perfil",
            isLoading: false,
          });
        }
      }
    }
  },
}));
