import { create } from "zustand";
import { authService } from "@/modules/auth/services/auth.service";
import { setTokenGetter } from "@/modules/core/services/axios.instance";
import { getErrorMessage } from "@/modules/core/services/api-error";
import { idbDelete, idbGet, idbSet } from "@/modules/core/services/indexeddb";
import { useTaskStore, TASKS_KEY, OUTBOX_KEY } from "@/modules/tasks/stores/task.store";
import { useProfileStore, PROFILE_KEY, PROFILE_FORM_KEY } from "@/modules/users/stores/profile.store";
import type {
  LoginPayload,
  RegistroPayload,
  UsuarioAutenticado,
} from "@/modules/auth/types/auth.types";

const SESSION_KEY = "dacate-user";

interface AuthState {
  usuario: UsuarioAutenticado | null;
  isAuthenticated: boolean;
  login: (payload: LoginPayload) => Promise<void>;
  registro: (payload: RegistroPayload) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  usuario: null,
  isAuthenticated: false,

  login: async (payload) => {
    try {
      const res = await authService.login(payload);
      if (!res.success || !res.data) {
        throw new Error(res.message || "Error al iniciar sesión");
      }

      await idbSet(SESSION_KEY, res.data);
      set({ usuario: res.data, isAuthenticated: true });
    } catch (err) {
      throw new Error(getErrorMessage(err, "Error al iniciar sesión"));
    }
  },

  registro: async (payload) => {
    try {
      const res = await authService.registro(payload);
      if (!res.success) {
        throw new Error(res.message || "Error al registrarse");
      }
    } catch (err) {
      throw new Error(getErrorMessage(err, "Error al registrarse"));
    }
  },

  logout: () => {
    void idbDelete(SESSION_KEY);
    // Borra la copia local de tareas y perfil para no mostrarlas a otra cuenta en este dispositivo.
    void idbDelete(TASKS_KEY);
    void idbDelete(OUTBOX_KEY);
    void idbDelete(PROFILE_KEY);
    void idbDelete(PROFILE_FORM_KEY);
    useTaskStore.setState({ tasks: [] });
    useProfileStore.setState({ perfil: null });
    set({ usuario: null, isAuthenticated: false });
  },
}));

/** Recupera el usuario de IndexedDB antes de renderizar la app. */
export async function hydrateAuth() {
  // Usar setTimeout para no bloquear el render
  setTimeout(async () => {
    const stored = await idbGet<UsuarioAutenticado>(SESSION_KEY);
    if (stored) {
      // shortcut: el token real lo maneja la cookie httpOnly del backend; aquí solo guardamos el usuario
      setTokenGetter(() => null);
      useAuthStore.setState({ usuario: stored, isAuthenticated: true });
    }
  }, 0);
}
