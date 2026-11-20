import { create } from "zustand";
import { profileService, type PerfilUsuario } from "@/modules/users/services/profile.service";

interface ProfileState {
  perfil: PerfilUsuario | null;
  isLoading: boolean;
  error: string | null;
  fetchPerfil: (id: number) => Promise<void>;
}

export const useProfileStore = create<ProfileState>((set) => ({
  perfil: null,
  isLoading: false,
  error: null,

  fetchPerfil: async (id) => {
    set({ isLoading: true, error: null });
    try {
      const res = await profileService.getPerfil(id);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Error al obtener el perfil");
      }
      set({ perfil: res.data, isLoading: false });
    } catch (err) {
      set({
        error: err instanceof Error ? err.message : "Error al obtener el perfil",
        isLoading: false,
      });
    }
  },
}));
